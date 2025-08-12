import React from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  TextFields,
  Edit,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";

export default function ClozePlayer({ question, value, onChange }) {
  const blanks = (question.blanks || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const answeredBlanks = blanks.filter(
    (blank) => value?.[blank.blankId] && value[blank.blankId].trim() !== ""
  ).length;

  const completionPercentage =
    blanks.length > 0 ? Math.round((answeredBlanks / blanks.length) * 100) : 0;

  const renderPassage = () => {
    const regex = /\[\[blank-([a-zA-Z0-9_-]+)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let idx = 0;

    while ((match = regex.exec(question.passage || "")) !== null) {
      const start = match.index;
      const end = regex.lastIndex;
      const before = question.passage.slice(lastIndex, start);
      if (before)
        parts.push(
          <span key={`txt-${idx}`} style={{ lineHeight: 2.2 }}>
            {before}
          </span>
        );

      const blankId = `blank-${match[1]}`;
      const b = blanks.find((bb) => bb.blankId === blankId);
      const isAnswered = value?.[blankId] && value[blankId].trim() !== "";

      if (b?.inputType === "dropdown") {
        parts.push(
          <Tooltip
            key={`blank-${idx}`}
            title={`Blank ${idx + 1}: Select from dropdown`}
          >
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                mx: 0.5,
                my: 0.5,
                minWidth: 160,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: isAnswered ? "#e8f5e8" : "#fff",
                  border: isAnswered
                    ? "2px solid #4caf50"
                    : "2px solid #e0e0e0",
                  "&:hover": {
                    borderColor: "#4caf50",
                  },
                  "&.Mui-focused": {
                    borderColor: "#4caf50",
                    boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: isAnswered ? "#4caf50" : "#666",
                  fontWeight: 500,
                },
              }}
            >
              <InputLabel>Select Answer</InputLabel>
              <Select
                label="Select Answer"
                value={value?.[blankId] ?? ""}
                onChange={(e) =>
                  onChange({ ...(value || {}), [blankId]: e.target.value })
                }
                startAdornment={
                  isAnswered ? (
                    <CheckCircle
                      sx={{ color: "#4caf50", fontSize: 16, mr: 0.5 }}
                    />
                  ) : (
                    <RadioButtonUnchecked
                      sx={{ color: "#ccc", fontSize: 16, mr: 0.5 }}
                    />
                  )
                }
              >
                <MenuItem value="">
                  <em style={{ color: "#999" }}>Choose an option...</em>
                </MenuItem>
                {(b.options || []).map((opt, i) => (
                  <MenuItem key={i} value={opt.optionText}>
                    {opt.optionText}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        );
      } else {
        parts.push(
          <Tooltip
            key={`blank-${idx}`}
            title={`Blank ${idx + 1}: Type your answer`}
          >
            <TextField
              size="small"
              placeholder={b?.placeholder || "Type your answer..."}
              value={value?.[blankId] ?? ""}
              onChange={(e) =>
                onChange({ ...(value || {}), [blankId]: e.target.value })
              }
              sx={{
                mx: 0.5,
                my: 0.5,
                width: { xs: "100%", sm: 200 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: isAnswered ? "#e8f5e8" : "#fff",
                  border: isAnswered
                    ? "2px solid #4caf50"
                    : "2px solid #e0e0e0",
                  "&:hover": {
                    borderColor: "#4caf50",
                  },
                  "&.Mui-focused": {
                    borderColor: "#4caf50",
                    boxShadow: "0 0 0 3px rgba(76, 175, 80, 0.1)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  fontWeight: isAnswered ? 600 : 400,
                  color: isAnswered ? "#2e7d32" : "#333",
                },
              }}
              InputProps={{
                startAdornment: isAnswered ? (
                  <CheckCircle
                    sx={{ color: "#4caf50", fontSize: 16, mr: 0.5 }}
                  />
                ) : (
                  <Edit sx={{ color: "#ccc", fontSize: 16, mr: 0.5 }} />
                ),
              }}
            />
          </Tooltip>
        );
      }

      lastIndex = end;
      idx++;
    }

    const after = question.passage.slice(lastIndex);
    if (after)
      parts.push(
        <span key="tail" style={{ lineHeight: 2.2 }}>
          {after}
        </span>
      );

    return (
      <Box
        sx={{
          display: "inline-block",
          lineHeight: 2.4,
          fontSize: "1.1rem",
          color: "#333",
        }}
      >
        {parts}
      </Box>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: "1px solid rgba(76, 175, 80, 0.2)",
        backgroundColor: "#fafafa",
        "&:hover": {
          boxShadow: 4,
          borderColor: "rgba(76, 175, 80, 0.4)",
        },
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Enhanced Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TextFields sx={{ color: "#4caf50", fontSize: 28 }} />
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
        <Tooltip title="Completion progress">
          <Chip
            icon={
              completionPercentage === 100 ? <CheckCircle /> : <TextFields />
            }
            label={`${completionPercentage}% Complete`}
            sx={{
              backgroundColor:
                completionPercentage === 100 ? "#4caf50" : "#4caf50",
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
            Progress: {answeredBlanks} of {blanks.length} blanks filled
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
                  : "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
              transition: "all 0.5s ease-in-out",
            }}
          />
        </Box>
      </Box>

      {/* Enhanced Passage Section */}
      <Fade in timeout={300}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            border: "2px dashed rgba(76, 175, 80, 0.3)",
            mb: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Edit sx={{ color: "#4caf50", fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight="bold" color="#4caf50">
              Fill in the Blanks
            </Typography>
          </Box>
          {renderPassage()}
        </Paper>
      </Fade>

      {/* Enhanced Footer */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={2}
        sx={{ borderTop: "1px solid #e0e0e0" }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            icon={<TextFields />}
            label={`${question.points || 0} points`}
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Fill in the Blanks Question
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">
            {blanks.length} blanks to complete
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
