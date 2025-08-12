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
} from "@mui/material";

export default function ClozePlayer({ question, value, onChange }) {
  const blanks = (question.blanks || [])
    .slice()
    .sort((a, b) => (a.position || 0) - (b.position || 0));

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
      if (before) parts.push(<span key={`txt-${idx}`}>{before}</span>);

      const blankId = `blank-${match[1]}`;
      const b = blanks.find((bb) => bb.blankId === blankId);

      if (b?.inputType === "dropdown") {
        parts.push(
          <FormControl
            key={`blank-${idx}`}
            variant="outlined"
            size="small"
            sx={{ mx: 0.5, minWidth: 140 }}
          >
            <InputLabel>Select</InputLabel>
            <Select
              label="Select"
              value={value?.[blankId] ?? ""}
              onChange={(e) =>
                onChange({ ...(value || {}), [blankId]: e.target.value })
              }
            >
              <MenuItem value="">
                <em>Choose</em>
              </MenuItem>
              {(b.options || []).map((opt, i) => (
                <MenuItem key={i} value={opt.optionText}>
                  {opt.optionText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      } else {
        parts.push(
          <TextField
            key={`blank-${idx}`}
            size="small"
            placeholder={b?.placeholder || "Answer"}
            value={value?.[blankId] ?? ""}
            onChange={(e) =>
              onChange({ ...(value || {}), [blankId]: e.target.value })
            }
            sx={{ mx: 0.5, width: { xs: "100%", sm: 180 } }}
          />
        );
      }

      lastIndex = end;
      idx++;
    }

    const after = question.passage.slice(lastIndex);
    if (after) parts.push(<span key="tail">{after}</span>);

    return <Box sx={{ display: "inline", flexWrap: "wrap" }}>{parts}</Box>;
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
      {renderPassage()}
      <Box sx={{ mt: 2 }}>
        <Chip size="small" label={`${question.points || 0} pts`} />
      </Box>
    </Paper>
  );
}
