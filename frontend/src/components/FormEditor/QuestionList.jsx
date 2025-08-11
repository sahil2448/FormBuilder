import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Edit, Delete, DragIndicator } from "@mui/icons-material";
import QuestionEditor from "../QuestionBuilder/QuestionEditor";

const QuestionList = ({ questions, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(null); // question object or null

  const getQuestionTypeLabel = (type) => {
    const types = {
      categorize: "Categorize",
      cloze: "Fill in the blanks",
      comprehension: "Comprehension",
    };
    return types[type] || type;
  };

  const getQuestionTypeColor = (type) => {
    const colors = {
      categorize: "primary",
      cloze: "secondary",
      comprehension: "success",
    };
    return colors[type] || "default";
  };

  const handleSaved = (updatedQuestion) => {
    onUpdate(updatedQuestion._id, updatedQuestion);
    setEditing(null);
  };

  const handleDeleted = (questionId) => {
    onDelete(questionId);
    setEditing(null);
  };

  if (questions.length === 0) {
    return (
      <Box className="text-center py-12">
        <Typography variant="h6" className="text-gray-500 mb-2">
          No questions added yet
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Click "Add Question" to create your first question
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <Typography variant="h6" className="mb-4">
        Questions ({questions.length})
      </Typography>

      {questions.map((question, index) => (
        <Card key={question._id} className="shadow-sm">
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <IconButton size="small" className="cursor-grab">
                <DragIndicator />
              </IconButton>
              <Typography variant="h6" className="text-sm font-medium">
                Question {index + 1}
              </Typography>
              <Chip
                label={getQuestionTypeLabel(question.questionType)}
                color={getQuestionTypeColor(question.questionType)}
                size="small"
              />
              <Chip
                label={`${question.points} points`}
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography variant="body1" className="mb-2">
              {question.questionText}
            </Typography>
          </CardContent>

          <CardActions>
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={() => setEditing(question)}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={() => onDelete(question._id)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}

      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent dividers>
          {editing && (
            <QuestionEditor
              question={editing}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QuestionList;
