import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit, Delete, DragIndicator } from "@mui/icons-material";

const QuestionList = ({ questions, onDelete, onUpdate }) => {
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

  return (
    <Box className="space-y-4">
      <Typography variant="h6" className="mb-4">
        Questions ({questions.length})
      </Typography>

      {questions.map((question, index) => (
        <Card key={question._id} className="shadow-sm">
          <CardContent>
            <Box className="flex items-start justify-between">
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
            </Box>

            <Typography variant="body1" className="mb-2">
              {question.questionText}
            </Typography>

            {question.questionType === "categorize" && (
              <Typography variant="body2" className="text-gray-600">
                Categories: {question.categories?.length || 0}, Items:{" "}
                {question.items?.length || 0}
              </Typography>
            )}
            {question.questionType === "cloze" && (
              <Typography variant="body2" className="text-gray-600">
                Blanks: {question.blanks?.length || 0}
              </Typography>
            )}
            {question.questionType === "comprehension" && (
              <Typography variant="body2" className="text-gray-600">
                Options: {question.options?.length || 0}
              </Typography>
            )}
          </CardContent>

          <CardActions>
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={() => console.log("Edit question:", question._id)}
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
    </Box>
  );
};

export default QuestionList;
