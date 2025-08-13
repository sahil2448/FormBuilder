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
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
  Tooltip,
  Fade,
} from "@mui/material";
import { Category, DragIndicator, CheckCircle } from "@mui/icons-material";

function DroppableColumn({ id, title, children, itemCount, isPool = false }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      id={id}
      sx={{
        minWidth: 280,
        flex: "0 0 auto",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Paper
        elevation={isOver ? 6 : 2}
        sx={{
          borderRadius: 3,
          border: isOver
            ? "3px solid #2196f3"
            : isPool
              ? "2px dashed #ff9800"
              : "2px solid #e3f2fd",
          backgroundColor: isOver ? "#e3f2fd" : isPool ? "#fff8e1" : "white",
          transform: isOver ? "scale(1.02)" : "scale(1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-2px)",
          },
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
              {isPool ? (
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "#ff9800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="white" fontWeight="bold">
                    ?
                  </Typography>
                </Box>
              ) : (
                <Category sx={{ color: "#2196f3", fontSize: 24 }} />
              )}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: isPool ? "#ff9800" : "#2196f3",
                  fontSize: "1.1rem",
                }}
              >
                {title}
              </Typography>
            </Box>
            <Chip
              size="small"
              label={`${itemCount} items`}
              sx={{
                backgroundColor: isPool ? "#ff9800" : "#2196f3",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            />
          </Box>

          <Box
            sx={{
              minHeight: 120,
              backgroundColor: isOver
                ? "rgba(33, 150, 243, 0.1)"
                : isPool
                  ? "rgba(255, 152, 0, 0.05)"
                  : "rgba(33, 150, 243, 0.02)",
              borderRadius: 2,
              p: 1,
              border: "2px dashed",
              borderColor: isOver
                ? "#2196f3"
                : isPool
                  ? "rgba(255, 152, 0, 0.3)"
                  : "rgba(33, 150, 243, 0.2)",
              position: "relative",
            }}
          >
            {children}
            {itemCount === 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  opacity: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  {isPool ? "Drag items here to unassign" : "Drop items here"}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Paper>
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
    opacity: isDragging ? 0.7 : 1,
    cursor: "grab",
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        variant="outlined"
        sx={{
          mb: 1.5,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: isDragging ? "#e3f2fd" : "white",
          border: isDragging ? "2px solid #2196f3" : "1px solid #e0e0e0",
          boxShadow: isDragging ? 4 : 1,
          "&:hover": {
            borderColor: "#2196f3",
            boxShadow: 2,
            transform: "translateY(-1px)",
            backgroundColor: "#f8f9fa",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <DragIndicator
            sx={{
              color: "grey.400",
              fontSize: 16,
              opacity: isDragging ? 1 : 0.6,
            }}
          />
          <Typography
            variant="body2"
            fontWeight="500"
            sx={{
              flex: 1,
              color: isDragging ? "#2196f3" : "text.primary",
            }}
          >
            {item.itemText}
          </Typography>
        </Box>
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

    let targetContainer = overId;
    if (!containers.includes(overId)) {
      targetContainer = getContainerOfItem(overId);
    }

    const from = getContainerOfItem(activeId);
    if (!targetContainer || from === targetContainer) return;

    const next = { ...(value || {}) };
    next[activeId] = targetContainer === "pool" ? "" : targetContainer;
    onChange(next);
  };

  const assignedCount = items.filter((item) => value?.[item.itemId]).length;
  const completionPercentage =
    items.length > 0 ? Math.round((assignedCount / items.length) * 100) : 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: "1px solid rgba(33, 150, 243, 0.2)",
        backgroundColor: "#fafafa",
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Category sx={{ color: "#2196f3", fontSize: 28 }} />
        <Box flex={1}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#333", mb: 0.5 }}
          >
            {question.questionText}
          </Typography>
          {question.instructions && (
            <Typography variant="body2" color="text.secondary">
              {question.instructions}
            </Typography>
          )}
        </Box>
        <Tooltip title="Question progress">
          <Chip
            icon={completionPercentage === 100 ? <CheckCircle /> : <Category />}
            label={`${completionPercentage}% Complete`}
            sx={{
              backgroundColor:
                completionPercentage === 100 ? "#4caf50" : "#2196f3",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Tooltip>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            Progress: {assignedCount} of {items.length} items assigned
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {completionPercentage}%
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: 6,
            backgroundColor: "#e0e0e0",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${completionPercentage}%`,
              height: "100%",
              background:
                completionPercentage === 100
                  ? "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)"
                  : "linear-gradient(90deg, #2196f3 0%, #42a5f5 100%)",
              transition: "all 0.5s ease-in-out",
            }}
          />
        </Box>
      </Box>

      <Fade in timeout={300}>
        <Box>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                overflowX: "auto",
                pb: 2,
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
                  "&:hover": {
                    backgroundColor: "#a1a1a1",
                  },
                },
              }}
            >
              <DroppableColumn
                id="pool"
                title="Unassigned Items"
                itemCount={itemsByContainer["pool"]?.length || 0}
                isPool={true}
              >
                <SortableContext
                  items={(itemsByContainer["pool"] || []).map(
                    (it) => it.itemId
                  )}
                  strategy={rectSortingStrategy}
                >
                  {(itemsByContainer["pool"] || []).map((it) => (
                    <SortableItem key={it.itemId} id={it.itemId} item={it} />
                  ))}
                </SortableContext>
              </DroppableColumn>

              {categories.map((cat) => (
                <DroppableColumn
                  key={cat.categoryId}
                  id={cat.categoryId}
                  title={cat.categoryName}
                  itemCount={itemsByContainer[cat.categoryId]?.length || 0}
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
                <Card
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 6,
                    border: "2px solid #2196f3",
                    transform: "rotate(3deg)",
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <DragIndicator sx={{ color: "#2196f3", fontSize: 16 }} />
                    <Typography
                      variant="body2"
                      fontWeight="500"
                      color="#2196f3"
                    >
                      {activeItem.itemText}
                    </Typography>
                  </Box>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Box>
      </Fade>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        pt={2}
        sx={{ borderTop: "1px solid #e0e0e0" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={<Category />}
            label={`${question.points || 0} points`}
            sx={{
              backgroundColor: "#2196f3",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Drag & Drop Question
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {categories.length} categories • {items.length} items
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
