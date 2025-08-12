import React, { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Card, CardContent, Typography, Chip, Paper } from "@mui/material";

function DroppableColumn({ id, title, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      id={id}
      sx={{
        minWidth: 240,
        flex: "0 0 auto",
        outline: isOver ? "2px solid #1976d2" : "none",
        outlineOffset: 2,
        borderRadius: 1,
      }}
    >
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}

function SortableItem({ id, item }) {
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
    opacity: isDragging ? 0.4 : 1,
    cursor: "grab",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card variant="outlined" sx={{ mb: 1, p: 1 }}>
        <Typography variant="body2">{item.itemText}</Typography>
      </Card>
    </div>
  );
}

export default function CategorizeDndPlayer({ question, value, onChange }) {
  const categories = question.categories || [];
  const items = question.items || [];

  const containers = useMemo(
    () => ["pool", ...categories.map((c) => c.categoryId)],
    [categories]
  );

  const itemsByContainer = useMemo(() => {
    const map = { pool: [] };
    categories.forEach((c) => (map[c.categoryId] = []));
    items.forEach((it) => {
      const assigned = value?.[it.itemId] ?? "";
      const key = assigned && containers.includes(assigned) ? assigned : "pool";
      map[key].push(it);
    });
    return map;
  }, [items, categories, value, containers]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  const [activeItem, setActiveItem] = useState(null);
  const findItem = (id) => items.find((i) => i.itemId === id);

  const getContainerOfItem = (itemId) => {
    const assigned = value?.[itemId] ?? "";
    return assigned && containers.includes(assigned) ? assigned : "pool";
  };

  const handleDragStart = (event) => {
    const current = findItem(event.active.id);
    setActiveItem(current || null);
  };

  const handleDragEnd = (event) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Dropped directly into a container
    let targetContainer = overId;
    // If dropped over an item, infer its parent container
    if (!containers.includes(overId)) {
      targetContainer = getContainerOfItem(overId);
    }

    const from = getContainerOfItem(activeId);
    if (!targetContainer || from === targetContainer) return;

    const next = { ...(value || {}) };
    next[activeId] = targetContainer === "pool" ? "" : targetContainer;
    onChange(next);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {question.questionText}
      </Typography>
      {question.instructions && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {question.instructions}
        </Typography>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 1 }}>
          {/* Pool */}
          <DroppableColumn id="pool" title="Unassigned">
            <SortableContext
              items={(itemsByContainer["pool"] || []).map((it) => it.itemId)}
              strategy={rectSortingStrategy}
            >
              {(itemsByContainer["pool"] || []).map((it) => (
                <SortableItem key={it.itemId} id={it.itemId} item={it} />
              ))}
            </SortableContext>
          </DroppableColumn>

          {/* Categories */}
          {categories.map((cat) => (
            <DroppableColumn
              key={cat.categoryId}
              id={cat.categoryId}
              title={cat.categoryName}
            >
              <SortableContext
                items={(itemsByContainer[cat.categoryId] || []).map(
                  (it) => it.itemId
                )}
                strategy={rectSortingStrategy}
              >
                {(itemsByContainer[cat.categoryId] || []).map((it) => (
                  <SortableItem key={it.itemId} id={it.itemId} item={it} />
                ))}
              </SortableContext>
            </DroppableColumn>
          ))}
        </Box>

        <DragOverlay>
          {activeItem ? (
            <Card variant="outlined" sx={{ p: 1, bgcolor: "white" }}>
              <Typography>{activeItem.itemText}</Typography>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Box sx={{ mt: 2 }}>
        <Chip size="small" label={`${question.points || 0} pts`} />
      </Box>
    </Paper>
  );
}
