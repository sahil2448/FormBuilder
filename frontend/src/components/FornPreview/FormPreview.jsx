import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  Button,
  Alert,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { formService } from "../../services/formService";
import { questionService } from "../../services/questionService";

function CategorizePreview({ question }) {
  return (
    <Card variant="outlined" className="mb-4">
      <CardContent>
        <Typography variant="h6" className="mb-2">
          {question.questionText}
        </Typography>
        {question.instructions && (
          <Typography variant="body2" color="text.secondary" className="mb-3">
            {question.instructions}
          </Typography>
        )}
        <Box className="flex flex-wrap gap-4">
          <Box className="min-w-[220px]">
            <Typography variant="subtitle2" className="mb-1">
              Unassigned Items
            </Typography>
            <Paper variant="outlined" className="p-2">
              {(question.items || [])
                .filter((i) => !i.correctCategory)
                .map((item) => (
                  <Chip
                    key={item.itemId}
                    label={item.itemText}
                    className="m-1"
                  />
                ))}
              {(question.items || []).filter((i) => !i.correctCategory)
                .length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No unassigned items
                </Typography>
              )}
            </Paper>
          </Box>
          {(question.categories || []).map((cat) => (
            <Box key={cat.categoryId} className="min-w-[220px]">
              <Typography variant="subtitle2" className="mb-1">
                {cat.categoryName}
              </Typography>
              <Paper variant="outlined" className="p-2">
                {(question.items || [])
                  .filter((i) => i.correctCategory === cat.categoryId)
                  .map((item) => (
                    <Chip
                      key={item.itemId}
                      label={item.itemText}
                      className="m-1"
                    />
                  ))}
                {(question.items || []).filter(
                  (i) => i.correctCategory === cat.categoryId
                ).length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    No items
                  </Typography>
                )}
              </Paper>
            </Box>
          ))}
        </Box>
        <Box className="mt-3">
          <Chip size="small" label={`${question.points || 0} pts`} />
        </Box>
      </CardContent>
    </Card>
  );
}

// Cloze Preview
function ClozePreview({ question }) {

  return (
    <Card variant="outlined" className="mb-4">
      <CardContent>
        <Typography variant="h6" className="mb-2">
          {question.questionText}
        </Typography>
        {question.instructions && (
          <Typography variant="body2" color="text.secondary" className="mb-3">
            {question.instructions}
          </Typography>
        )}
        <Box className="space-y-2">
          {(question.blanks || []).length > 0 ? (
            (question.blanks || []).map((b, idx) => (
              <Box key={b.blankId} className="flex items-center gap-2">
                <Chip label={`Blank ${idx + 1}`} size="small" />
                <TextField size="small" placeholder="Your answer" disabled />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No blanks defined yet.
            </Typography>
          )}
        </Box>
        <Box className="mt-3">
          <Chip size="small" label={`${question.points || 0} pts`} />
        </Box>
      </CardContent>
    </Card>
  );
}

// Comprehension Preview
function ComprehensionPreview({ question }) {

  return (
    <Card variant="outlined" className="mb-4">
      <CardContent>
        <Typography variant="h6" className="mb-2">
          {question.questionText}
        </Typography>
        {question.passage && (
          <Paper variant="outlined" className="p-3 mb-3 bg-gray-50">
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
        {(question.options || []).length > 0 ? (
          <RadioGroup>
            {question.options.map((opt) => (
              <FormControlLabel
                key={opt.optionId || opt._id || opt.text}
                value={opt.optionId || opt._id || opt.text}
                control={<Radio disabled />}
                label={opt.text}
              />
            ))}
          </RadioGroup>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No options added yet.
          </Typography>
        )}
        <Box className="mt-3">
          <Chip size="small" label={`${question.points || 0} pts`} />
        </Box>
      </CardContent>
    </Card>
  );
}

function renderQuestionPreview(q) {
  switch (q.questionType) {
    case "categorize":
      return <CategorizePreview question={q} />;
    case "cloze":
      return <ClozePreview question={q} />;
    case "comprehension":
      return <ComprehensionPreview question={q} />;
    default:
      return (
        <Card variant="outlined" className="mb-4">
          <CardContent>
            <Typography variant="h6">{q.questionText}</Typography>
            <Typography variant="body2" color="text.secondary">
              Unsupported question type: {q.questionType}
            </Typography>
          </CardContent>
        </Card>
      );
  }
}

export default function FormPreview() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [formRes, qRes] = await Promise.all([
        formService.getFormById(formId),
        questionService.getQuestions(formId),
      ]);

      if (!formRes.success)
        throw new Error(formRes.error || "Failed to load form");
      if (!qRes.success)
        throw new Error(qRes.error || "Failed to load questions");

      setForm(formRes.data);
      // Sort by order if available
      const qs = (qRes.data || [])
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setQuestions(qs);
    } catch (e) {
      setError(e.message || "Failed to load preview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className="py-6">
        <Box className="flex items-center gap-2 mb-4">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Back</Typography>
        </Box>
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
        <Button variant="outlined" onClick={loadData}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="md" className="py-6">
        <Box className="flex items-center gap-2 mb-4">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Back</Typography>
        </Box>
        <Alert severity="error">Form not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-6">
      <Box className="flex items-center gap-2 mb-4">
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">Back</Typography>
      </Box>

      <Paper className="p-5 mb-4 shadow-sm">
        <Typography variant="h4" className="font-bold mb-2">
          {form.title}
        </Typography>
        {form.description && (
          <Typography variant="body1" color="text.secondary" className="mb-3">
            {form.description}
          </Typography>
        )}
        <Box className="flex items-center gap-2">
          <Chip
            label={form.isPublished ? "Published" : "Draft"}
            color={form.isPublished ? "success" : "default"}
          />
          <Chip label={`${questions.length} questions`} variant="outlined" />
        </Box>
      </Paper>

      <Divider className="mb-4" />

      {questions.length === 0 ? (
        <Alert severity="info">No questions added yet.</Alert>
      ) : (
        <Fragment>
          {questions.map((q) => (
            <Fragment key={q._id}>{renderQuestionPreview(q)}</Fragment>
          ))}
        </Fragment>
      )}

      <Box className="mt-6 flex gap-2">
        <Button
          variant="contained"
          onClick={() => navigate(`/form/edit/${form._id}`)}
        >
          Edit Form
        </Button>
        {form.isPublished && form.shareableLink && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/form/${form.shareableLink}`)}
          >
            Open Public Link
          </Button>
        )}
      </Box>
    </Container>
  );
}
