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
} from "@mui/material";
import { ArrowBack, Add, Preview } from "@mui/icons-material";
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

  return (
    <Container maxWidth="lg" className="py-6">
      <Box className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconButton onClick={() => navigate("/dashboard")}>
            <ArrowBack />
          </IconButton>
          <div>
            <Typography variant="h4" className="font-bold">
              {form.title}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {questions.length} questions
            </Typography>
          </div>
        </div>
        <div className="flex gap-2">
          {form?.isPublished && form?.shareableLink && (
            <Button
              variant="outlined"
              onClick={() => navigate(`/form/${form.shareableLink}`)}
            >
              Open Public Link
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => navigate(`/form/preview/${form._id}`)}
          >
            Preview
          </Button>
          <Button
            variant={form?.isPublished ? "outlined" : "contained"}
            color={form?.isPublished ? "success" : "primary"}
            onClick={handlePublish}
            disabled={saving}
          >
            {form?.isPublished ? "Published" : "Publish"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddQuestionOpen(true)}
          >
            Add Question
          </Button>
        </div>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper className="shadow-sm">
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          className="px-4"
        >
          <Tab label="Questions" />
          <Tab label="Settings" />
        </Tabs>

        <Box className="p-4">
          {tabValue === 0 && (
            <QuestionList
              questions={questions}
              onDelete={handleDeleteQuestion}
              onUpdate={handleUpdateQuestion}
            />
          )}
          {tabValue === 1 && (
            <FormSettings form={form} onSave={handleSaveForm} saving={saving} />
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
