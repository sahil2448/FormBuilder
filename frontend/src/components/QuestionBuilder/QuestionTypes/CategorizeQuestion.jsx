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
  Paper,
  Chip,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Add,
  Delete,
  Save,
  Category,
  DragIndicator,
  Edit,
} from "@mui/icons-material";

// Enhanced Sortable item card
function SortableCard({ id, item, onEdit, onDelete }) {
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
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        variant="outlined"
        sx={{
          mb: 1,
          p: 1.5,
          borderStyle: "solid",
          borderColor: isDragging ? "primary.main" : "grey.300",
          backgroundColor: isDragging ? "primary.50" : "white",
          cursor: "grab",
          "&:hover": {
            borderColor: "primary.main",
            boxShadow: 2,
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
          borderRadius: 2,
        }}
        {...attributes}
        {...listeners}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <DragIndicator sx={{ color: "grey.400", fontSize: 16 }} />
            <Typography variant="body2" fontWeight="500">
              {item.itemText}
            </Typography>
          </Box>
          <Box display="flex" gap={0.5}>
            <Tooltip title="Edit item">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(item.itemId);
                }}
                sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete item">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(item.itemId);
                }}
                sx={{
                  opacity: 0.7,
                  "&:hover": { opacity: 1, color: "error.main" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Card>
    </div>
  );
}

function SortableItemList({ items, onEditItem, onDeleteItem }) {
  const ids = items.map((i) => i.itemId);
  return (
    <SortableContext items={ids} strategy={rectSortingStrategy}>
      {items.map((it) => (
        <SortableCard
          key={it.itemId}
          id={it.itemId}
          item={it}
          onEdit={onEditItem}
          onDelete={onDeleteItem}
        />
      ))}
    </SortableContext>
  );
}

function CategoryColumn({
  category,
  children,
  onAddItem,
  onDeleteCategory,
  itemCount,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        minWidth: 280,
        backgroundColor: "white",
        borderRadius: 3,
        border: "2px solid",
        borderColor: "primary.100",
        "&:hover": {
          borderColor: "primary.300",
          boxShadow: 4,
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Category sx={{ color: "primary.main", fontSize: 20 }} />
            <TextField
              size="small"
              variant="outlined"
              value={category.categoryName}
              onChange={(e) => category.onRename(e.target.value)}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontWeight: "600",
                },
              }}
            />
          </Box>
          <Tooltip title="Delete category">
            <IconButton
              size="small"
              onClick={() => onDeleteCategory(category.categoryId)}
              sx={{
                color: "error.main",
                "&:hover": { backgroundColor: "error.50" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Chip
            size="small"
            label={`${itemCount} items`}
            sx={{
              backgroundColor: "primary.100",
              color: "primary.800",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            minHeight: 140,
            backgroundColor: "grey.50",
            borderRadius: 2,
            p: 1,
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          {children}
        </Box>

        <Box mt={2}>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => onAddItem(category.categoryId)}
            startIcon={<Add />}
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              "&:hover": { backgroundColor: "primary.50" },
            }}
          >
            Add Item
          </Button>
        </Box>
      </CardContent>
    </Paper>
  );
}

function PoolColumn({ children, onAddItem, itemCount }) {
  return (
    <Paper
      elevation={3}
      sx={{
        minWidth: 280,
        backgroundColor: "white",
        borderRadius: 3,
        border: "2px solid",
        borderColor: "warning.200",
        "&:hover": {
          borderColor: "warning.400",
          boxShadow: 4,
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "warning.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="white" fontWeight="bold">
                ?
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              color="warning.800"
            >
              Unassigned Items
            </Typography>
          </Box>
          <Chip
            size="small"
            label={`${itemCount} items`}
            sx={{
              backgroundColor: "warning.100",
              color: "warning.800",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            minHeight: 140,
            backgroundColor: "warning.50",
            borderRadius: 2,
            p: 1,
            border: "2px dashed",
            borderColor: "warning.300",
          }}
        >
          {children}
        </Box>

        <Box mt={2}>
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => onAddItem(null)}
            startIcon={<Add />}
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              borderColor: "warning.main",
              color: "warning.main",
              "&:hover": {
                backgroundColor: "warning.50",
                borderColor: "warning.dark",
              },
            }}
          >
            Add Item
          </Button>
        </Box>
      </CardContent>
    </Paper>
  );
}

export default function CategorizeQuestion({
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
  onSave,
  onDelete,
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

  const editItem = (itemId) => {
    const newText = prompt("Enter new item text:");
    if (newText && newText.trim()) {
      setItems((prev) =>
        prev.map((it) =>
          it.itemId === itemId ? { ...it, itemText: newText.trim() } : it
        )
      );
    }
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
    <Paper
      elevation={2}
      sx={{ p: 3, borderRadius: 3, backgroundColor: "#fafafa" }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Category sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          Categorize Question Editor
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
        <Fade in={!!error}>
          <Box>
            {error && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Fade>

        <TextField
          label="Question Text"
          fullWidth
          multiline
          rows={3}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Box display="flex" gap={2}>
          <TextField
            label="Points"
            type="number"
            sx={{ maxWidth: 150 }}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            inputProps={{ min: 1 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
          <TextField
            label="Instructions"
            fullWidth
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2}>
          <Button
            variant="outlined"
            onClick={addCategory}
            startIcon={<Add />}
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              px: 3,
            }}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Save />}
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              px: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Save Question
          </Button>
          <Button
            color="error"
            onClick={onDelete}
            startIcon={<Delete />}
            sx={{
              borderRadius: 2,
              fontWeight: "600",
              px: 3,
            }}
          >
            Delete Question
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
        📋 Drag & Drop Editor
      </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor]}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            py: 2,
            px: 1,
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#c1c1c1",
              borderRadius: 4,
            },
          }}
        >
          <Box sx={{ flex: "0 0 auto" }}>
            <PoolColumn
              onAddItem={addItem}
              itemCount={itemsByContainer["pool"]?.length || 0}
            >
              <SortableItemList
                items={itemsByContainer["pool"] || []}
                onEditItem={editItem}
                onDeleteItem={deleteItem}
              />
            </PoolColumn>
          </Box>

          {categories.map((cat) => (
            <Box key={cat.categoryId} sx={{ flex: "0 0 auto" }}>
              <CategoryColumn
                category={{
                  ...cat,
                  onRename: (name) => renameCategory(cat.categoryId, name),
                }}
                onAddItem={addItem}
                onDeleteCategory={deleteCategory}
                itemCount={itemsByContainer[cat.categoryId]?.length || 0}
              >
                <SortableItemList
                  items={itemsByContainer[cat.categoryId] || []}
                  onEditItem={editItem}
                  onDeleteItem={deleteItem}
                />
              </CategoryColumn>
            </Box>
          ))}
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Card
              variant="outlined"
              sx={{
                p: 1.5,
                background: "white",
                borderRadius: 2,
                boxShadow: 4,
                borderColor: "primary.main",
              }}
            >
              <Typography variant="body2" fontWeight="500">
                {activeItem.itemText}
              </Typography>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
}
