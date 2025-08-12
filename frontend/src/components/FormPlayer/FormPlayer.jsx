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
} from "@mui/material";
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

  // answers: { [questionId]: {...} }
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

        // init empty answers for each question
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

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !form) {
    return (
      <Container maxWidth="md" className="py-6">
        <Alert severity="error" className="mb-3">
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="md" className="py-6">
        <Paper className="p-5 mb-4">
          <Typography variant="h4" className="mb-2">
            Thank you!
          </Typography>
          <Typography variant="body1" className="mb-2">
            Your response has been recorded.
          </Typography>
          {submitted.totalScore !== undefined && (
            <Typography variant="h6" className="mt-2">
              Score: {submitted.totalScore}
              {submitted.maxScore ? ` / ${submitted.maxScore}` : ""}
            </Typography>
          )}
          {submitted.breakdown && (
            <Box className="mt-3">
              <Typography variant="subtitle1">Breakdown</Typography>
              <pre className="bg-gray-50 p-3 rounded overflow-auto">
                {JSON.stringify(submitted.breakdown, null, 2)}
              </pre>
            </Box>
          )}
        </Paper>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-6">
      {error && (
        <Alert severity="error" className="mb-3" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper className="p-5 mb-4 shadow-sm">
        <Typography variant="h4" className="font-bold mb-2">
          {form?.title}
        </Typography>
        {form?.description && (
          <Typography variant="body1" color="text.secondary" className="mb-3">
            {form.description}
          </Typography>
        )}
        <Box className="flex items-center gap-2">
          <Chip label="Quiz" />
          <Chip label={`${questions.length} questions`} variant="outlined" />
        </Box>
      </Paper>

      <Divider className="mb-4" />

      {questions.map((q, idx) => (
        <Box key={q._id}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            className="mb-1"
          >
            Question {idx + 1}
          </Typography>
          <QuestionPlayer
            question={q}
            value={answers[q._id]}
            onChange={(val) => handleChange(q._id, val)}
          />
        </Box>
      ))}

      <Box className="mt-6 flex gap-2">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Container>
  );
}
