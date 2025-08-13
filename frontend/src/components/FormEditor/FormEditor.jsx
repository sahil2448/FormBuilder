import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Add,
  Preview,
  Settings,
  Quiz,
  Public,
  Edit,
} from "@mui/icons-material";
import { formService } from "../../services/formService";
import { questionService } from "../../services/questionService";
import FormSettings from "./FormSettings";
import QuestionList from "./QuestionList";
import AddQuestionDialog from "./AddQuestionDialog";
import Loading from "../common/Loading";

const FormEditor = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  useEffect(() => {
    loadFormData();
  }, [formId]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      setError("");
      const formResponse = await formService.getFormById(formId);
      if (formResponse.success) setForm(formResponse.data);
      const questionsResponse = await questionService.getQuestions(formId);
      if (questionsResponse.success) setQuestions(questionsResponse.data || []);
    } catch (err) {
      setError(err.message || "Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveForm = async (formData) => {
    try {
      setSaving(true);
      const response = await formService.updateForm(formId, formData);
      if (response.success) setForm(response.data);
    } catch (err) {
      setError(err.message || "Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async (questionData) => {
    try {
      const response = await questionService.createQuestion({
        ...questionData,
        formId: formId,
      });
      if (response.success) {
        setQuestions((prev) => [...prev, response.data]);
        setAddQuestionOpen(false);
      }
    } catch (err) {
      setError(err.message || "Failed to add question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await questionService.deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      setError(err.message || "Failed to delete question");
    }
  };

  const handleUpdateQuestion = async (questionId, questionDataOrUpdated) => {
    if (questionDataOrUpdated && questionDataOrUpdated._id) {
      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? questionDataOrUpdated : q))
      );
      return;
    }
    try {
      const response = await questionService.updateQuestion(
        questionId,
        questionDataOrUpdated
      );
      if (response.success) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === questionId ? response.data : q))
        );
      }
    } catch (err) {
      setError(err.message || "Failed to update question");
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);
      const res = await formService.publishForm(formId);
      if (!res.success) throw new Error(res.error || "Failed to publish");
      setForm(res.data);
    } catch (err) {
      setError(err.message || "Failed to publish form");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!form) return <Alert severity="error">Form not found</Alert>;

  const questionTypes = questions.reduce((acc, q) => {
    acc[q.questionType] = (acc[q.questionType] || 0) + 1;
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          color: "white",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Back to Dashboard">
              <IconButton
                onClick={() => navigate("/dashboard")}
                sx={{
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Box display="flex" alignItems="center" gap={1}>
              <Edit sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {form.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Form Editor • {questions.length} questions
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            gap={1}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            {form?.isPublished && form?.shareableLink && (
              <Tooltip title="Open public form">
                <Button
                  variant="outlined"
                  startIcon={<Public />}
                  onClick={() => navigate(`/form/${form.shareableLink}`)}
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.5)",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Public Link
                </Button>
              </Tooltip>
            )}
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={() => navigate(`/form/preview/${form._id}`)}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              color={form?.isPublished ? "success" : "primary"}
              onClick={handlePublish}
              disabled={saving}
              sx={{
                backgroundColor: form?.isPublished
                  ? "rgba(76, 175, 80, 0.9)"
                  : "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: form?.isPublished
                    ? "rgba(76, 175, 80, 1)"
                    : "rgba(255,255,255,0.25)",
                },
              }}
            >
              {saving
                ? "Publishing..."
                : form?.isPublished
                  ? "Published"
                  : "Publish"}
            </Button>
          </Box>
        </Box>

        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <Chip
            icon={<Quiz />}
            label={`${questions.length} Questions`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          {form?.isPublished ? (
            <Chip
              icon={<Public />}
              label="Published"
              sx={{
                backgroundColor: "rgba(76, 175, 80, 0.8)",
                color: "white",
                fontWeight: "bold",
              }}
            />
          ) : (
            <Chip
              label="Draft"
              sx={{
                backgroundColor: "rgba(255, 152, 0, 0.8)",
                color: "white",
                fontWeight: "bold",
              }}
            />
          )}
          {Object.entries(questionTypes).map(([type, count]) => (
            <Chip
              key={type}
              label={`${count} ${type}`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                textTransform: "capitalize",
              }}
            />
          ))}
        </Box>
      </Paper>

      <Fade in={!!error}>
        <Box sx={{ mb: 3 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": { fontSize: "0.95rem" },
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              px: 2,
              "& .MuiTab-root": {
                minHeight: 64,
                fontSize: "1rem",
                fontWeight: 500,
                textTransform: "none",
              },
            }}
          >
            <Tab
              icon={<Quiz />}
              iconPosition="start"
              label={`Questions (${questions.length})`}
            />
            <Tab icon={<Settings />} iconPosition="start" label="Settings" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3, backgroundColor: "#fafafa", minHeight: 400 }}>
          {tabValue === 0 && (
            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Questions
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddQuestionOpen(true)}
                  sx={{
                    borderRadius: 2,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1a3460 0%, #24467d 100%)",
                    },
                  }}
                >
                  Add Question
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <QuestionList
                questions={questions}
                onDelete={handleDeleteQuestion}
                onUpdate={handleUpdateQuestion}
              />
            </Box>
          )}
          {tabValue === 1 && (
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                mb={3}
              >
                Form Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <FormSettings
                form={form}
                onSave={handleSaveForm}
                saving={saving}
              />
            </Box>
          )}
        </Box>
      </Paper>

      <AddQuestionDialog
        open={addQuestionOpen}
        onClose={() => setAddQuestionOpen(false)}
        onSubmit={handleAddQuestion}
      />
    </Container>
  );
};

export default FormEditor;
