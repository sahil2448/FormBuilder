import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add, Delete, Save } from "@mui/icons-material";

const SUB_TYPES = [
  { value: "mcq", label: "Multiple Choice" },
  { value: "short-answer", label: "Short Answer" },
  { value: "true-false", label: "True / False" },
];

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function ComprehensionQuestion({
  initialQuestion = {
    questionType: "comprehension",
    questionText: "Read the passage and answer.",
    instructions: "Read the passage carefully and answer the questions below",
    points: 3, // can be sum of subs or independent—kept for compatibility
    passage: "The Earth revolves around the Sun in approximately 365 days.",
    passageImage: null,
    subQuestions: [
      {
        subQuestionId: "sq-1",
        questionText: "What does the Earth revolve around?",
        questionType: "mcq",
        options: [
          { optionText: "The Moon", isCorrect: false },
          { optionText: "The Sun", isCorrect: true },
        ],
        correctAnswer: "The Sun",
        points: 1,
      },
      {
        subQuestionId: "sq-2",
        questionText: "True or False: One year is ~365 days.",
        questionType: "true-false",
        options: [
          { optionText: "True", isCorrect: true },
          { optionText: "False", isCorrect: false },
        ],
        correctAnswer: "True",
        points: 1,
      },
      {
        subQuestionId: "sq-3",
        questionText: "Name the planet we live on.",
        questionType: "short-answer",
        options: [],
        correctAnswer: "Earth",
        points: 1,
      },
    ],
  },
  onSave,
  onDelete,
}) {
  const [questionText, setQuestionText] = useState(
    initialQuestion.questionText || ""
  );
  const [instructions, setInstructions] = useState(
    initialQuestion.instructions || ""
  );
  const [points, setPoints] = useState(initialQuestion.points || 1);
  const [passage, setPassage] = useState(initialQuestion.passage || "");
  const [passageImage, setPassageImage] = useState(
    initialQuestion.passageImage || null
  );
  const [subs, setSubs] = useState(initialQuestion.subQuestions || []);
  const [error, setError] = useState("");

  // Ensure each sub has an ID
  useEffect(() => {
    setSubs((prev) =>
      prev.map((sq) => ({
        subQuestionId: sq.subQuestionId || uid("sq"),
        questionText: sq.questionText || "",
        questionType: sq.questionType || "mcq",
        options: Array.isArray(sq.options) ? sq.options : [],
        correctAnswer: sq.correctAnswer || "",
        points: typeof sq.points === "number" ? sq.points : 1,
      }))
    );
  }, []);

  const validate = () => {
    if (!questionText.trim())
      return setError("Question text is required."), false;
    if (!passage.trim()) return setError("Passage is required."), false;
    if (subs.length === 0)
      return setError("Add at least one sub-question."), false;

    for (const [idx, sq] of subs.entries()) {
      if (!sq.questionText || !sq.questionText.trim()) {
        setError(`Sub-question ${idx + 1} text is required.`);
        return false;
      }
      if (
        !sq.questionType ||
        !["mcq", "short-answer", "true-false"].includes(sq.questionType)
      ) {
        setError(`Sub-question ${idx + 1} must have a valid question type.`);
        return false;
      }
      if (sq.points <= 0) {
        setError(`Sub-question ${idx + 1} points must be greater than 0.`);
        return false;
      }
      if (sq.questionType === "mcq") {
        if (!sq.options || sq.options.length < 2) {
          setError(`Sub-question ${idx + 1}: MCQ needs at least 2 options.`);
          return false;
        }
        const hasCorrectInOptions = sq.options.some(
          (o) => o.isCorrect && o.optionText === sq.correctAnswer
        );
        if (!hasCorrectInOptions) {
          setError(
            `Sub-question ${idx + 1}: correctAnswer must match an option marked isCorrect.`
          );
          return false;
        }
      }
      if (sq.questionType === "true-false") {
        // enforce options True/False by convention
        const labels = (sq.options || []).map((o) =>
          (o.optionText || "").toLowerCase()
        );
        const hasTrue = labels.includes("true");
        const hasFalse = labels.includes("false");
        if (!hasTrue || !hasFalse) {
          setError(
            `Sub-question ${idx + 1}: true-false must have options "True" and "False".`
          );
          return false;
        }
        if (!["True", "False"].includes(sq.correctAnswer)) {
          setError(
            `Sub-question ${idx + 1}: correctAnswer must be "True" or "False".`
          );
          return false;
        }
      }
      if (sq.questionType === "short-answer") {
        if (!sq.correctAnswer || !sq.correctAnswer.trim()) {
          setError(
            `Sub-question ${idx + 1}: provide a correctAnswer for short-answer.`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    setError("");
    if (!validate()) return;
    const payload = {
      questionType: "comprehension",
      questionText: questionText.trim(),
      points: Number(points) || 1, // optional aggregate or unused on server if you sum per sub
      instructions: instructions.trim(),
      passage,
      passageImage: passageImage || null,
      subQuestions: subs.map((sq) => ({
        subQuestionId: sq.subQuestionId,
        questionText: sq.questionText.trim(),
        questionType: sq.questionType,
        options:
          sq.questionType === "short-answer"
            ? []
            : (sq.options || []).map((o) => ({
                optionText: o.optionText || "",
                isCorrect: !!o.isCorrect,
              })),
        correctAnswer: sq.correctAnswer,
        points: Number(sq.points) || 1,
      })),
    };
    await onSave?.(payload);
  };

  const addSub = (type = "mcq") => {
    const id = uid("sq");
    const base = {
      subQuestionId: id,
      questionText: "",
      questionType: type,
      options: [],
      correctAnswer: "",
      points: 1,
    };
    if (type === "true-false") {
      base.options = [
        { optionText: "True", isCorrect: false },
        { optionText: "False", isCorrect: false },
      ];
      base.correctAnswer = "True";
    }
    if (type === "mcq") {
      base.options = [
        { optionText: "Option 1", isCorrect: true },
        { optionText: "Option 2", isCorrect: false },
      ];
      base.correctAnswer = "Option 1";
    }
    setSubs((prev) => [...prev, base]);
  };

  const deleteSub = (subQuestionId) => {
    setSubs((prev) => prev.filter((s) => s.subQuestionId !== subQuestionId));
  };

  const setSubField = (id, field, value) => {
    setSubs((prev) =>
      prev.map((s) => (s.subQuestionId === id ? { ...s, [field]: value } : s))
    );
  };

  const addOption = (id) => {
    setSubs((prev) =>
      prev.map((s) =>
        s.subQuestionId === id
          ? {
              ...s,
              options: [
                ...(s.options || []),
                { optionText: "", isCorrect: false },
              ],
            }
          : s
      )
    );
  };

  const setOptionField = (id, idx, field, value) => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.subQuestionId !== id) return s;
        const opts = [...(s.options || [])];
        opts[idx] = { ...opts[idx], [field]: value };
        return { ...s, options: opts };
      })
    );
  };

  const deleteOption = (id, idx) => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.subQuestionId !== id) return s;
        const opts = (s.options || []).filter((_, i) => i !== idx);
        return { ...s, options: opts };
      })
    );
  };

  return (
    <Box className="space-y-4">
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Question Title"
        fullWidth
        multiline
        rows={2}
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <Box className="flex gap-4">
        <TextField
          label="Total Points (optional)"
          type="number"
          sx={{ maxWidth: 200 }}
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          inputProps={{ min: 0 }}
        />
        <TextField
          label="Instructions (optional)"
          fullWidth
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" fontWeight="600" className="mb-2">
            Passage
          </Typography>
          <TextField
            label="Passage"
            fullWidth
            multiline
            minRows={6}
            value={passage}
            onChange={(e) => setPassage(e.target.value)}
          />
          <Box className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextField
              label="Passage Image URL (optional)"
              value={passageImage || ""}
              onChange={(e) => setPassageImage(e.target.value)}
              placeholder="https://..."
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Box className="flex items-center justify-between mb-2">
            <Typography variant="subtitle1" fontWeight="600">
              Sub-Questions ({subs.length})
            </Typography>
            <Box className="flex gap-2">
              <Button
                size="small"
                variant="outlined"
                onClick={() => addSub("mcq")}
              >
                Add MCQ
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => addSub("true-false")}
              >
                Add True/False
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => addSub("short-answer")}
              >
                Add Short Answer
              </Button>
            </Box>
          </Box>
          <Divider className="mb-3" />

          <Box className="space-y-3">
            {subs.map((sq, idx) => (
              <Card key={sq.subQuestionId} variant="outlined">
                <CardContent>
                  <Box className="flex items-center justify-between mb-2">
                    <Box className="flex items-center gap-2">
                      <Chip size="small" label={`Q${idx + 1}`} />
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          label="Type"
                          value={sq.questionType}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "questionType",
                              e.target.value
                            )
                          }
                        >
                          {SUB_TYPES.map((t) => (
                            <MenuItem key={t.value} value={t.value}>
                              {t.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => deleteSub(sq.subQuestionId)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <TextField
                      label="Sub-question Text"
                      value={sq.questionText}
                      onChange={(e) =>
                        setSubField(
                          sq.subQuestionId,
                          "questionText",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label="Points"
                      type="number"
                      value={sq.points}
                      onChange={(e) =>
                        setSubField(
                          sq.subQuestionId,
                          "points",
                          Number(e.target.value)
                        )
                      }
                      inputProps={{ min: 1 }}
                    />
                  </Box>

                  {sq.questionType === "mcq" && (
                    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" className="mb-2">
                        Options (mark at least one as correct)
                      </Typography>
                      <Box className="space-y-2">
                        {(sq.options || []).map((opt, oIdx) => (
                          <Box
                            key={oIdx}
                            className="grid grid-cols-12 gap-2 items-center"
                          >
                            <TextField
                              className="col-span-8"
                              label={`Option ${oIdx + 1}`}
                              value={opt.optionText || ""}
                              onChange={(e) =>
                                setOptionField(
                                  sq.subQuestionId,
                                  oIdx,
                                  "optionText",
                                  e.target.value
                                )
                              }
                            />
                            <TextField
                              className="col-span-3"
                              label="Correct?"
                              value={opt.isCorrect ? "Yes" : "No"}
                              onClick={() =>
                                setOptionField(
                                  sq.subQuestionId,
                                  oIdx,
                                  "isCorrect",
                                  !opt.isCorrect
                                )
                              }
                              inputProps={{ readOnly: true }}
                            />
                            <IconButton
                              className="col-span-1"
                              size="small"
                              onClick={() =>
                                deleteOption(sq.subQuestionId, oIdx)
                              }
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => addOption(sq.subQuestionId)}
                          startIcon={<Add />}
                        >
                          Add Option
                        </Button>
                      </Box>

                      <Box className="mt-3">
                        <TextField
                          label="Correct Answer (must match a correct option)"
                          fullWidth
                          value={sq.correctAnswer || ""}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        />
                      </Box>
                    </Card>
                  )}

                  {sq.questionType === "true-false" && (
                    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" className="mb-2">
                        True/False Options
                      </Typography>
                      <Box className="space-y-2">
                        {(sq.options || []).map((opt, oIdx) => (
                          <Box
                            key={oIdx}
                            className="grid grid-cols-12 gap-2 items-center"
                          >
                            <TextField
                              className="col-span-8"
                              label={`Option ${oIdx + 1}`}
                              value={opt.optionText || ""}
                              onChange={(e) =>
                                setOptionField(
                                  sq.subQuestionId,
                                  oIdx,
                                  "optionText",
                                  e.target.value
                                )
                              }
                            />
                            <TextField
                              className="col-span-3"
                              label="Correct?"
                              value={opt.isCorrect ? "Yes" : "No"}
                              onClick={() =>
                                setOptionField(
                                  sq.subQuestionId,
                                  oIdx,
                                  "isCorrect",
                                  !opt.isCorrect
                                )
                              }
                              inputProps={{ readOnly: true }}
                            />
                            <IconButton
                              className="col-span-1"
                              size="small"
                              onClick={() =>
                                deleteOption(sq.subQuestionId, oIdx)
                              }
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>

                      <Box className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <TextField
                          label='Correct Answer ("True" or "False")'
                          fullWidth
                          value={sq.correctAnswer || ""}
                          onChange={(e) =>
                            setSubField(
                              sq.subQuestionId,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        />
                      </Box>
                    </Card>
                  )}

                  {sq.questionType === "short-answer" && (
                    <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" className="mb-2">
                        Short Answer
                      </Typography>
                      <TextField
                        label="Correct Answer"
                        fullWidth
                        value={sq.correctAnswer || ""}
                        onChange={(e) =>
                          setSubField(
                            sq.subQuestionId,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                      />
                    </Card>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Box className="flex items-center gap-2">
        <Button variant="contained" onClick={handleSave} startIcon={<Save />}>
          Save Question
        </Button>
        <Button color="error" onClick={onDelete} startIcon={<Delete />}>
          Delete Question
        </Button>
      </Box>
    </Box>
  );
}
