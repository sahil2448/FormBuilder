import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
  Fade,
  Card,
  CardContent,
} from "@mui/material";
import {
  Quiz,
  CheckCircle,
  Timer,
  Send,
  Assignment,
  Lightbulb,
} from "@mui/icons-material";
import { responseService } from "../../services/responseService";
import CategorizeDndPlayer from "./CategorizeDndPlayer";
import ClozePlayer from "./ClozePlayer";
import ComprehensionPlayer from "./ComprehensionPlayer";

function QuestionPlayer({ question, value, onChange }) {
  switch (question.questionType) {
    case "categorize":
      return (
        <CategorizeDndPlayer
          question={question}
          value={value}
          onChange={onChange}
        />
      );
    case "cloze":
      return (
        <ClozePlayer question={question} value={value} onChange={onChange} />
      );
    case "comprehension":
      return (
        <ComprehensionPlayer
          question={question}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

export default function FormPlayer() {
  const { shareableLink } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await responseService.getPublicForm(shareableLink);
        if (!res?.success) throw new Error(res?.error || "Unable to load form");

        const data = res.data || {};
        const qs = (data.questions || [])
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setForm(data.form || null);
        setQuestions(qs);

        const init = {};
        for (const q of qs) {
          if (q.questionType === "categorize") {
            const m = {};
            (q.items || []).forEach((it) => {
              m[it.itemId] = "";
            });
            init[q._id] = m;
          } else if (q.questionType === "cloze") {
            const m = {};
            (q.blanks || []).forEach((b) => {
              m[b.blankId] = "";
            });
            init[q._id] = m;
          } else if (q.questionType === "comprehension") {
            const m = {};
            (q.subQuestions || []).forEach((sq) => {
              m[sq.subQuestionId] = "";
            });
            init[q._id] = m;
          }
        }
        setAnswers(init);
        setStartedAt(Date.now());
      } catch (e) {
        setError(e?.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    })();
  }, [shareableLink]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const validateRequired = () => {
    const missing = [];
    for (const q of questions) {
      if (q.isRequired === false) continue;
      const v = answers[q._id];

      if (q.questionType === "categorize") {
        const items = q.items || [];
        const anyUnassigned = items.some(
          (it) =>
            !v ||
            v[it.itemId] === "" ||
            v[it.itemId] === null ||
            v[it.itemId] === undefined
        );
        if (anyUnassigned) missing.push(q._id);
      } else if (q.questionType === "cloze") {
        const blanks = q.blanks || [];
        const anyEmpty = blanks.some(
          (b) =>
            !v ||
            v[b.blankId] === undefined ||
            v[b.blankId].toString().trim() === ""
        );
        if (anyEmpty) missing.push(q._id);
      } else if (q.questionType === "comprehension") {
        const subs = q.subQuestions || [];
        const anyEmpty = subs.some(
          (sq) =>
            !v ||
            v[sq.subQuestionId] === "" ||
            v[sq.subQuestionId] === null ||
            v[sq.subQuestionId] === undefined
        );
        if (anyEmpty) missing.push(q._id);
      }
    }
    return missing;
  };

  const buildSubmissionPayload = () => {
    const completionTime = Date.now() - startedAt;

    const answersArray = questions.map((q) => {
      const v = answers[q._id];

      if (q.questionType === "categorize") {
        return {
          questionId: q._id,
          questionType: q.questionType,
          answer: {
            itemPlacements: (q.items || []).map((it) => ({
              itemId: it.itemId,
              categoryId: v?.[it.itemId] || null,
            })),
          },
        };
      }

      if (q.questionType === "cloze") {
        return {
          questionId: q._id,
          questionType: q.questionType,
          answer: {
            blankAnswers: (q.blanks || [])
              .slice()
              .sort((a, b) => (a.position || 0) - (b.position || 0))
              .map((b) => ({
                blankId: b.blankId,
                userAnswer: v?.[b.blankId] ?? "",
              })),
          },
        };
      }

      if (q.questionType === "comprehension") {
        return {
          questionId: q._id,
          questionType: q.questionType,
          answer: {
            subAnswers: (q.subQuestions || []).map((sq) => ({
              subQuestionId: sq.subQuestionId,
              userAnswer: v?.[sq.subQuestionId] ?? "",
            })),
          },
        };
      }

      return { questionId: q._id, questionType: q.questionType, answer: {} };
    });

    return {
      answers: answersArray,
      completionTime,
    };
  };

  const handleSubmit = async () => {
    const missing = validateRequired();
    if (missing.length > 0) {
      setError("Please answer all required questions before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const payload = buildSubmissionPayload();
      const res = await responseService.submitResponses(shareableLink, payload);
      if (!res?.success) throw new Error(res?.error || "Submission failed");
      setSubmitted(res.data || { message: "Submitted" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    let totalAnswerable = 0;
    let answered = 0;

    questions.forEach((q) => {
      const v = answers[q._id];

      if (q.questionType === "categorize") {
        const items = q.items || [];
        totalAnswerable += items.length;
        answered += items.filter(
          (it) => v?.[it.itemId] && v[it.itemId] !== ""
        ).length;
      } else if (q.questionType === "cloze") {
        const blanks = q.blanks || [];
        totalAnswerable += blanks.length;
        answered += blanks.filter(
          (b) => v?.[b.blankId] && v[b.blankId].toString().trim() !== ""
        ).length;
      } else if (q.questionType === "comprehension") {
        const subs = q.subQuestions || [];
        totalAnswerable += subs.length;
        answered += subs.filter(
          (sq) =>
            v?.[sq.subQuestionId] &&
            v[sq.subQuestionId].toString().trim() !== ""
        ).length;
      }
    });

    return totalAnswerable > 0
      ? Math.round((answered / totalAnswerable) * 100)
      : 0;
  };

  const progress = calculateProgress();
  const elapsedTime = Math.floor((Date.now() - startedAt) / 1000 / 60); // minutes

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" color="text.secondary">
          Loading quiz...
        </Typography>
      </Box>
    );
  }

  if (error && !form) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" color="error" sx={{ mb: 2 }}>
            ⚠️ Unable to Load Quiz
          </Typography>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Card
          elevation={4}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
            color: "white",
            mb: 3,
          }}
        >
          <CheckCircle sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            🎉 Submission Successful!
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
            Your response has been recorded successfully.
          </Typography>

          {submitted.totalScore !== undefined && (
            <Card
              elevation={2}
              sx={{
                p: 2,
                mt: 3,
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "#333",
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="primary">
                📊 Your Score: {submitted.totalScore}
                {submitted.maxScore ? ` / ${submitted.maxScore}` : ""}
              </Typography>
              {submitted.maxScore && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Percentage:{" "}
                  {Math.round(
                    (submitted.totalScore / submitted.maxScore) * 100
                  )}
                  %
                </Typography>
              )}
            </Card>
          )}
        </Card>

        {submitted.breakdown && (
          <Card elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              📈 Detailed Breakdown
            </Typography>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                fontFamily: "monospace",
                fontSize: "0.9rem",
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <pre>{JSON.stringify(submitted.breakdown, null, 2)}</pre>
            </Paper>
          </Card>
        )}

        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/dashboard")}
            sx={{
              borderRadius: 3,
              px: 4,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Error Alert */}
      <Fade in={!!error}>
        <Box sx={{ mb: 3 }}>
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

      {/* Enhanced Header */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Quiz sx={{ fontSize: 32 }} />
          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold">
              {form?.title}
            </Typography>
            {form?.description && (
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                {form.description}
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Chip
            icon={<Assignment />}
            label="Interactive Quiz"
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            icon={<Quiz />}
            label={`${questions.length} Questions`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            icon={<Timer />}
            label={`${elapsedTime} min elapsed`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        {/* Progress Bar */}
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body2" fontWeight="500">
              Overall Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {progress}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.3)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: progress === 100 ? "#4caf50" : "#fff",
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Paper>

      {/* Instructions Card */}
      <Card
        elevation={2}
        sx={{ mb: 4, borderRadius: 3, border: "1px solid #e3f2fd" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Lightbulb sx={{ color: "#2196f3", fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Instructions
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            📝 Answer all questions to the best of your ability
            <br />
            ⏱️ Take your time - there's no time limit
            <br />
            ✅ Make sure to complete all required fields before submitting
            <br />
            💾 Your progress is automatically saved as you go
          </Typography>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Fade in timeout={500}>
        <Box>
          {questions.map((q, idx) => (
            <Box key={q._id} sx={{ mb: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={`Question ${idx + 1}`}
                    size="small"
                    sx={{
                      backgroundColor: "#667eea",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {q.questionType.charAt(0).toUpperCase() +
                      q.questionType.slice(1)}{" "}
                    Question
                  </Typography>
                  {q.isRequired !== false && (
                    <Chip
                      label="Required"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Paper>

              <QuestionPlayer
                question={q}
                value={answers[q._id]}
                onChange={(val) => handleChange(q._id, val)}
              />
            </Box>
          ))}
        </Box>
      </Fade>

      {/* Enhanced Submit Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 6,
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#fafafa",
          border: "2px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Ready to Submit?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please review your answers before submitting. You won't be able to
          change them afterwards.
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Tooltip
            title={
              progress < 100
                ? "Complete all questions for full credit"
                : "All questions completed!"
            }
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                background:
                  progress === 100
                    ? "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    progress === 100
                      ? "linear-gradient(135deg, #45a049 0%, #5cb85c 100%)"
                      : "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
                "&:disabled": {
                  background: "#ccc",
                },
              }}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </Tooltip>
        </Box>

        {progress < 100 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            💡 Tip: Complete all questions for the best score!
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
