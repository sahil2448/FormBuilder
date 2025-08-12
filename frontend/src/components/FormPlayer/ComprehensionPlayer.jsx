import React from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  MenuBook,
  Quiz,
  CheckCircle,
  RadioButtonUnchecked,
  Edit,
  HelpOutline,
} from "@mui/icons-material";

export default function ComprehensionPlayer({ question, value, onChange }) {
  const subs = question.subQuestions || [];

  const answeredQuestions = subs.filter(
    (sq) =>
      value?.[sq.subQuestionId] &&
      value[sq.subQuestionId].toString().trim() !== ""
  ).length;

  const completionPercentage =
    subs.length > 0 ? Math.round((answeredQuestions / subs.length) * 100) : 0;

  const getQuestionTypeInfo = (type) => {
    switch (type) {
      case "mcq":
        return { icon: "🔘", color: "#2196f3", label: "Multiple Choice" };
      case "true-false":
        return { icon: "❓", color: "#ff9800", label: "True/False" };
      case "short-answer":
        return { icon: "✏️", color: "#4caf50", label: "Short Answer" };
      default:
        return { icon: "❔", color: "#9e9e9e", label: "Unknown" };
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: "1px solid rgba(255, 152, 0, 0.2)",
        backgroundColor: "#fafafa",
        "&:hover": {
          boxShadow: 4,
          borderColor: "rgba(255, 152, 0, 0.4)",
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Enhanced Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <MenuBook sx={{ color: "#ff9800", fontSize: 28 }} />
        <Box flex={1}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#333", mb: 0.5 }}
          >
            {question.questionText}
          </Typography>
        </Box>
        <Tooltip title="Completion progress">
          <Chip
            icon={completionPercentage === 100 ? <CheckCircle /> : <MenuBook />}
            label={`${completionPercentage}% Complete`}
            sx={{
              backgroundColor:
                completionPercentage === 100 ? "#4caf50" : "#ff9800",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Tooltip>
      </Box>

      {/* Progress Indicator */}
      <Box sx={{ mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="caption" color="text.secondary" fontWeight="500">
            Progress: {answeredQuestions} of {subs.length} questions answered
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
                  : "linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)",
              transition: "all 0.5s ease-in-out",
            }}
          />
        </Box>
      </Box>

      {/* Enhanced Passage Section */}
      {question.passage && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: "#fff8e1",
            borderRadius: 2,
            border: "2px solid rgba(255, 152, 0, 0.3)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <MenuBook sx={{ color: "#ff9800", fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight="bold" color="#ff9800">
              Reading Passage
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
              color: "#333",
              fontSize: "1.05rem",
            }}
          >
            {question.passage}
          </Typography>
        </Paper>
      )}

      {question.instructions && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              p: 2,
              backgroundColor: "rgba(255, 152, 0, 0.1)",
              borderRadius: 2,
              border: "1px solid rgba(255, 152, 0, 0.2)",
              fontStyle: "italic",
            }}
          >
            💡 {question.instructions}
          </Typography>
        </Box>
      )}

      {/* Enhanced Questions Section */}
      <Fade in timeout={300}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {subs.map((sq, idx) => {
            const typeInfo = getQuestionTypeInfo(sq.questionType);
            const isAnswered =
              value?.[sq.subQuestionId] &&
              value[sq.subQuestionId].toString().trim() !== "";

            return (
              <Paper
                key={sq.subQuestionId}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: isAnswered
                    ? `2px solid ${typeInfo.color}`
                    : "2px solid #e0e0e0",
                  backgroundColor: isAnswered ? `${typeInfo.color}10` : "white",
                  "&:hover": {
                    boxShadow: 4,
                    borderColor: typeInfo.color,
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip
                      label={`Q${idx + 1}`}
                      sx={{
                        backgroundColor: typeInfo.color,
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                    <Chip
                      label={`${typeInfo.icon} ${typeInfo.label}`}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: typeInfo.color,
                        color: typeInfo.color,
                        fontWeight: "500",
                      }}
                    />
                  </Box>
                  {isAnswered && (
                    <Tooltip title="Question answered">
                      <CheckCircle
                        sx={{ color: typeInfo.color, fontSize: 20 }}
                      />
                    </Tooltip>
                  )}
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  sx={{ mb: 2, color: "#333", fontSize: "1.1rem" }}
                >
                  {sq.questionText}
                </Typography>

                {sq.questionType === "mcq" && (
                  <RadioGroup
                    value={value?.[sq.subQuestionId] ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...(value || {}),
                        [sq.subQuestionId]: e.target.value,
                      })
                    }
                    sx={{ ml: 1 }}
                  >
                    {(sq.options || []).map((opt, i) => {
                      const isSelected =
                        value?.[sq.subQuestionId] === opt.optionText;
                      return (
                        <FormControlLabel
                          key={i}
                          value={opt.optionText}
                          control={
                            <Radio
                              sx={{
                                color: typeInfo.color,
                                "&.Mui-checked": {
                                  color: typeInfo.color,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? typeInfo.color : "#333",
                              }}
                            >
                              {opt.optionText}
                            </Typography>
                          }
                          sx={{
                            mb: 0.5,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: isSelected
                              ? `${typeInfo.color}15`
                              : "transparent",
                            "&:hover": {
                              backgroundColor: `${typeInfo.color}10`,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                      );
                    })}
                  </RadioGroup>
                )}

                {sq.questionType === "true-false" && (
                  <RadioGroup
                    value={value?.[sq.subQuestionId] ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...(value || {}),
                        [sq.subQuestionId]: e.target.value,
                      })
                    }
                    sx={{ ml: 1 }}
                  >
                    {["True", "False"].map((option) => {
                      const isSelected = value?.[sq.subQuestionId] === option;
                      return (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={
                            <Radio
                              sx={{
                                color: typeInfo.color,
                                "&.Mui-checked": {
                                  color: typeInfo.color,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? typeInfo.color : "#333",
                              }}
                            >
                              {option === "True" ? "✅ True" : "❌ False"}
                            </Typography>
                          }
                          sx={{
                            mb: 0.5,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor: isSelected
                              ? `${typeInfo.color}15`
                              : "transparent",
                            "&:hover": {
                              backgroundColor: `${typeInfo.color}10`,
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                      );
                    })}
                  </RadioGroup>
                )}

                {sq.questionType === "short-answer" && (
                  <TextField
                    fullWidth
                    placeholder="Type your answer here..."
                    value={value?.[sq.subQuestionId] ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...(value || {}),
                        [sq.subQuestionId]: e.target.value,
                      })
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: isAnswered
                          ? `${typeInfo.color}10`
                          : "#fff",
                        "&:hover": {
                          borderColor: typeInfo.color,
                        },
                        "&.Mui-focused": {
                          borderColor: typeInfo.color,
                          boxShadow: `0 0 0 3px ${typeInfo.color}20`,
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <Edit
                          sx={{ color: typeInfo.color, fontSize: 20, mr: 1 }}
                        />
                      ),
                    }}
                  />
                )}

                {sq.points && (
                  <Box mt={2}>
                    <Chip
                      size="small"
                      label={`${sq.points} pts`}
                      sx={{
                        backgroundColor: `${typeInfo.color}20`,
                        color: typeInfo.color,
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                )}
              </Paper>
            );
          })}
        </Box>
      </Fade>

      {/* Enhanced Footer */}
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
            icon={<MenuBook />}
            label={`${question.points || 0} points total`}
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Reading Comprehension
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {subs.length} questions to answer
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
