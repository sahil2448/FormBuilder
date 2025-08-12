import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { Add, Delete, Save } from "@mui/icons-material";

// Sortable item card
function SortableCard({ id, item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        variant="outlined"
        sx={{ mb: 1, p: 1, borderStyle: "dashed" }}
        {...attributes}
        {...listeners}
      >
        <Typography variant="body2">{item.itemText}</Typography>
      </Card>
    </div>
  );
}

function SortableItemList({ items }) {
  const ids = items.map((i) => i.itemId);
  return (
    <SortableContext items={ids} strategy={rectSortingStrategy}>
      {items.map((it) => (
        <SortableCard key={it.itemId} id={it.itemId} item={it} />
      ))}
    </SortableContext>
  );
}

function CategoryColumn({ category, children, onAddItem, onDeleteCategory }) {
  return (
    <Card variant="outlined" sx={{ minWidth: 260, backgroundColor: "white" }}>
      <CardContent>
        <Box className="flex items-center justify-between mb-2">
          <TextField
            label="Category Name"
            size="small"
            value={category.categoryName}
            onChange={(e) => category.onRename(e.target.value)}
          />
          <IconButton
            size="small"
            onClick={() => onDeleteCategory(category.categoryId)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ minHeight: 120 }}>{children}</Box>
        <Box className="mt-3">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onAddItem(category.categoryId)}
          >
            Add Item
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function PoolColumn({ children, onAddItem }) {
  return (
    <Card variant="outlined" sx={{ minWidth: 260, backgroundColor: "white" }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="600" className="mb-2">
          Unassigned Items
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ minHeight: 120 }}>{children}</Box>
        <Box className="mt-3">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onAddItem(null)}
          >
            Add Item
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function CategorizeQuestion({
  // Provide the question from backend when editing; fallback to template for new
  initialQuestion = {
    questionType: "categorize",
    questionText: "Categorize the items.",
    points: 5,
    instructions: "Drag each item into the correct category.",
    categories: [
      { categoryName: "Category A", categoryId: "cat-a" },
      { categoryName: "Category B", categoryId: "cat-b" },
    ],
    items: [
      { itemText: "Item 1", itemId: "item-1", correctCategory: "cat-a" },
      { itemText: "Item 2", itemId: "item-2", correctCategory: "cat-b" },
      { itemText: "Item 3", itemId: "item-3", correctCategory: null },
    ],
  },
  onSave, // async (payload) => {}
  onDelete, // async () => {}
}) {
  const [questionText, setQuestionText] = useState(
    initialQuestion.questionText || ""
  );
  const [points, setPoints] = useState(initialQuestion.points || 1);
  const [instructions, setInstructions] = useState(
    initialQuestion.instructions || ""
  );
  const [categories, setCategories] = useState(
    initialQuestion.categories || []
  );
  const [items, setItems] = useState(initialQuestion.items || []);
  const [activeItem, setActiveItem] = useState(null);
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  const containers = useMemo(
    () => ["pool", ...categories.map((c) => c.categoryId)],
    [categories]
  );

  const itemsByContainer = useMemo(() => {
    const map = { pool: [] };
    categories.forEach((c) => (map[c.categoryId] = []));
    items.forEach((it) => {
      const key = it.correctCategory || "pool";
      if (!map[key]) map[key] = [];
      map[key].push(it);
    });
    return map;
  }, [items, categories]);

  const findItem = (id) => items.find((it) => it.itemId === id);
  const getContainerFor = (id) => {
    if (containers.includes(id)) return id;
    const it = findItem(id);
    return it ? it.correctCategory || "pool" : null;
  };

  const handleDragStart = (event) => {
    const current = findItem(event.active.id);
    setActiveItem(current || null);
  };

  const handleDragEnd = (event) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const from = getContainerFor(active.id);
    const to = containers.includes(over.id)
      ? over.id
      : getContainerFor(over.id);
    if (!from || !to || from === to) return;

    setItems((prev) =>
      prev.map((it) =>
        it.itemId === active.id
          ? { ...it, correctCategory: to === "pool" ? null : to }
          : it
      )
    );
  };

  const addCategory = () => {
    const id = `cat-${Math.random().toString(36).slice(2, 8)}`;
    setCategories((prev) => [
      ...prev,
      { categoryName: `Category ${prev.length + 1}`, categoryId: id },
    ]);
  };

  const deleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId));
    setItems((prev) =>
      prev.map((it) =>
        it.correctCategory === categoryId
          ? { ...it, correctCategory: null }
          : it
      )
    );
  };

  const renameCategory = (categoryId, name) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.categoryId === categoryId ? { ...c, categoryName: name } : c
      )
    );
  };

  // Item ops
  const addItem = (categoryIdOrNull) => {
    const newId = `item-${Math.random().toString(36).slice(2, 8)}`;
    setItems((prev) => [
      ...prev,
      {
        itemId: newId,
        itemText: `New Item ${prev.length + 1}`,
        correctCategory: categoryIdOrNull,
      },
    ]);
  };

  const deleteItem = (itemId) => {
    setItems((prev) => prev.filter((it) => it.itemId !== itemId));
  };

  const validate = () => {
    if (!questionText.trim()) {
      setError("Question text is required.");
      return false;
    }
    if (categories.length === 0) {
      setError("Add at least one category.");
      return false;
    }
    if (items.length === 0) {
      setError("Add at least one item.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError("");
    if (!validate()) return;
    const payload = {
      questionType: "categorize",
      questionText: questionText.trim(),
      points: Number(points) || 1,
      instructions: instructions.trim(),
      categories,
      items,
    };
    await onSave?.(payload);
  };

  return (
    <Box className="space-y-4">
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Question Text"
        fullWidth
        multiline
        rows={2}
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      <Box className="flex gap-4">
        <TextField
          label="Points"
          type="number"
          sx={{ maxWidth: 140 }}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          inputProps={{ min: 1 }}
        />
        <TextField
          label="Instructions"
          fullWidth
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Box>

      <Box className="flex items-center gap-2">
        <Button variant="outlined" onClick={addCategory} startIcon={<Add />}>
          Add Category
        </Button>
        <Button variant="contained" onClick={handleSave} startIcon={<Save />}>
          Save Question
        </Button>
        <Button color="error" onClick={onDelete} startIcon={<Delete />}>
          Delete Question
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor]}
      >
        <Box className="flex gap-4 overflow-x-auto" sx={{ py: 1 }}>
          <Box id="pool" sx={{ flex: "0 0 auto" }}>
            <PoolColumn onAddItem={addItem}>
              <SortableItemList items={itemsByContainer["pool"] || []} />
              {itemsByContainer["pool"]?.length > 0 && (
                <Box mt={1}>
                  {itemsByContainer["pool"].map((it) => (
                    <Box
                      key={`pool-del-${it.itemId}`}
                      className="flex items-center justify-between"
                    >
                      <Typography variant="caption" color="text.secondary">
                        {it.itemText}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => deleteItem(it.itemId)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </PoolColumn>
          </Box>

          {categories.map((cat) => (
            <Box
              id={cat.categoryId}
              key={cat.categoryId}
              sx={{ flex: "0 0 auto" }}
            >
              <CategoryColumn
                category={{
                  ...cat,
                  onRename: (name) => renameCategory(cat.categoryId, name),
                }}
                onAddItem={addItem}
                onDeleteCategory={deleteCategory}
              >
                <SortableItemList
                  items={itemsByContainer[cat.categoryId] || []}
                />
                {itemsByContainer[cat.categoryId]?.length > 0 && (
                  <Box mt={1}>
                    {itemsByContainer[cat.categoryId].map((it) => (
                      <Box
                        key={`cat-del-${it.itemId}`}
                        className="flex items-center justify-between"
                      >
                        <Typography variant="caption" color="text.secondary">
                          {it.itemText}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => deleteItem(it.itemId)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </CategoryColumn>
            </Box>
          ))}
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Card variant="outlined" sx={{ p: 1, background: "white" }}>
              <Typography variant="body2">{activeItem.itemText}</Typography>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}
