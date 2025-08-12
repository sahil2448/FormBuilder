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
} from "@mui/material";

export default function ComprehensionPlayer({ question, value, onChange }) {
  const subs = question.subQuestions || [];

  return (
    <Paper variant="outlined" className="p-4 mb-4">
      <Typography variant="h6" className="mb-2">
        {question.questionText}
      </Typography>
      {question.passage && (
        <Paper
          variant="outlined"
          className="p-3 mb-3"
          sx={{ backgroundColor: "#fafafa" }}
        >
          <Typography variant="body2" whiteSpace="pre-wrap">
            {question.passage}
          </Typography>
        </Paper>
      )}

      {question.instructions && (
        <Typography variant="body2" color="text.secondary" className="mb-3">
          {question.instructions}
        </Typography>
      )}

      <Box className="space-y-3">
        {subs.map((sq, idx) => (
          <Box key={sq.subQuestionId} className="p-3 border rounded">
            <Typography variant="subtitle1" className="mb-2">
              {idx + 1}. {sq.questionText}
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
              >
                {(sq.options || []).map((opt, i) => (
                  <FormControlLabel
                    key={i}
                    value={opt.optionText}
                    control={<Radio />}
                    label={opt.optionText}
                  />
                ))}
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
              >
                <FormControlLabel
                  value="True"
                  control={<Radio />}
                  label="True"
                />
                <FormControlLabel
                  value="False"
                  control={<Radio />}
                  label="False"
                />
              </RadioGroup>
            )}

            {sq.questionType === "short-answer" && (
              <TextField
                fullWidth
                placeholder="Your answer"
                value={value?.[sq.subQuestionId] ?? ""}
                onChange={(e) =>
                  onChange({
                    ...(value || {}),
                    [sq.subQuestionId]: e.target.value,
                  })
                }
              />
            )}
          </Box>
        ))}
      </Box>

      <Box className="mt-3">
        <Chip size="small" label={`${question.points || 0} pts`} />
      </Box>
    </Paper>
  );
}
