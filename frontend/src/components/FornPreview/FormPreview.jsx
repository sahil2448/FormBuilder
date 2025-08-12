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
  Fade,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Public,
  Preview,
  Category,
  TextFields,
  MenuBook,
} from "@mui/icons-material";
import { formService } from "../../services/formService";
import { questionService } from "../../services/questionService";

function CategorizePreview({ question, index }) {
  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 3,
        border: "1px solid rgba(33, 150, 243, 0.2)",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Category sx={{ color: "#2196f3", fontSize: 24 }} />
          <Chip
            label={`Question ${index + 1}`}
            size="small"
            sx={{
              backgroundColor: "#2196f3",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label="Categorize"
            variant="outlined"
            sx={{ borderColor: "#2196f3", color: "#2196f3" }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#333" }}
        >
          {question.questionText}
        </Typography>

        {question.instructions && (
          <Alert
            severity="info"
            sx={{ mb: 3, backgroundColor: "#e3f2fd", borderRadius: 2 }}
          >
            {question.instructions}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                border: "2px dashed #ccc",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                📦 Unassigned Items
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {(question.items || [])
                  .filter((i) => !i.correctCategory)
                  .map((item) => (
                    <Chip
                      key={item.itemId}
                      label={item.itemText}
                      sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    />
                  ))}
                {(question.items || []).filter((i) => !i.correctCategory)
                  .length === 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    No unassigned items
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {(question.categories || []).map((cat, catIndex) => (
            <Grid item xs={12} sm={6} md={4} key={cat.categoryId}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: `hsl(${catIndex * 60}, 70%, 95%)`,
                  border: `2px solid hsl(${catIndex * 60}, 70%, 80%)`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  📁 {cat.categoryName}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {(question.items || [])
                    .filter((i) => i.correctCategory === cat.categoryId)
                    .map((item) => (
                      <Chip
                        key={item.itemId}
                        label={item.itemText}
                        sx={{
                          backgroundColor: `hsl(${catIndex * 60}, 70%, 85%)`,
                          color: `hsl(${catIndex * 60}, 70%, 20%)`,
                          fontWeight: "bold",
                        }}
                      />
                    ))}
                  {(question.items || []).filter(
                    (i) => i.correctCategory === cat.categoryId
                  ).length === 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontStyle="italic"
                    >
                      No items assigned
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Chip
            icon={<Category />}
            label={`${question.points || 0} points`}
            sx={{
              backgroundColor: "#2196f3",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Drag & Drop Question
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function ClozePreview({ question, index }) {
  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 3,
        border: "1px solid rgba(76, 175, 80, 0.2)",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TextFields sx={{ color: "#4caf50", fontSize: 24 }} />
          <Chip
            label={`Question ${index + 1}`}
            size="small"
            sx={{
              backgroundColor: "#4caf50",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label="Cloze"
            variant="outlined"
            sx={{ borderColor: "#4caf50", color: "#4caf50" }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#333" }}
        >
          {question.questionText}
        </Typography>

        {question.instructions && (
          <Alert
            severity="success"
            sx={{ mb: 3, backgroundColor: "#e8f5e8", borderRadius: 2 }}
          >
            {question.instructions}
          </Alert>
        )}

        {question.passage && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              {question.passage}
            </Typography>
          </Paper>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {(question.blanks || []).length > 0 ? (
            (question.blanks || []).map((blank, idx) => (
              <Box
                key={blank.blankId}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Chip
                  label={`Blank ${idx + 1}`}
                  size="small"
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                <TextField
                  size="small"
                  placeholder={blank.placeholder || "Your answer"}
                  disabled
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
                {blank.inputType === "dropdown" && (
                  <Chip
                    label="Dropdown"
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: "#4caf50", color: "#4caf50" }}
                  />
                )}
              </Box>
            ))
          ) : (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              No blanks defined yet.
            </Alert>
          )}
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
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
            Fill in the Blanks
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function ComprehensionPreview({ question, index }) {
  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderRadius: 3,
        border: "1px solid rgba(255, 152, 0, 0.2)",
        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <MenuBook sx={{ color: "#ff9800", fontSize: 24 }} />
          <Chip
            label={`Question ${index + 1}`}
            size="small"
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label="Comprehension"
            variant="outlined"
            sx={{ borderColor: "#ff9800", color: "#ff9800" }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#333" }}
        >
          {question.questionText}
        </Typography>

        {question.passage && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#fff8e1",
              borderRadius: 2,
              border: "1px solid #ffcc02",
            }}
          >
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
            >
              {question.passage}
            </Typography>
          </Paper>
        )}

        {question.instructions && (
          <Alert
            severity="warning"
            sx={{ mb: 3, backgroundColor: "#fff3e0", borderRadius: 2 }}
          >
            {question.instructions}
          </Alert>
        )}

        {(question.subQuestions || []).length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(question.subQuestions || []).map((subQ, subIndex) => (
              <Paper
                key={subQ.subQuestionId}
                elevation={1}
                sx={{ p: 2, borderRadius: 2, backgroundColor: "#fafafa" }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {subIndex + 1}. {subQ.questionText}
                </Typography>
                {subQ.options && subQ.options.length > 0 && (
                  <RadioGroup>
                    {subQ.options.map((opt, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        value={opt.optionText}
                        control={<Radio disabled size="small" />}
                        label={opt.optionText}
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.9rem",
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            No sub-questions added yet.
          </Alert>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Chip
            icon={<MenuBook />}
            label={`${question.points || 0} points`}
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
      </CardContent>
    </Card>
  );
}

function renderQuestionPreview(q, index) {
  switch (q.questionType) {
    case "categorize":
      return <CategorizePreview question={q} index={index} />;
    case "cloze":
      return <ClozePreview question={q} index={index} />;
    case "comprehension":
      return <ComprehensionPreview question={q} index={index} />;
    default:
      return (
        <Card elevation={3} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6">{q.questionText}</Typography>
            <Alert severity="error" sx={{ mt: 2 }}>
              Unsupported question type: {q.questionType}
            </Alert>
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
  }, [formId]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Loading preview...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Tooltip title="Go back">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: "primary.main" }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h6">Back</Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={loadData} sx={{ borderRadius: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Tooltip title="Go back">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: "primary.main" }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h6">Back</Typography>
        </Box>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Form not found
        </Alert>
      </Container>
    );
  }

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Tooltip title="Go back">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Preview sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            Form Preview
          </Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          {form.title}
        </Typography>

        {form.description && (
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            {form.description}
          </Typography>
        )}

        <Box display="flex" flexWrap="wrap" gap={2}>
          <Chip
            label={form.isPublished ? "📢 Published" : "📝 Draft"}
            sx={{
              backgroundColor: form.isPublished
                ? "rgba(76, 175, 80, 0.8)"
                : "rgba(255, 152, 0, 0.8)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={`${questions.length} Questions`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={`${totalPoints} Total Points`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>
      </Paper>

      <Fade in timeout={500}>
        <Box>
          {questions.length === 0 ? (
            <Alert
              severity="info"
              sx={{
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                fontSize: "1.1rem",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                🎯 No questions added yet
              </Typography>
              <Typography variant="body2">
                Add some questions to see the preview here.
              </Typography>
            </Alert>
          ) : (
            questions.map((q, index) => (
              <Fragment key={q._id}>{renderQuestionPreview(q, index)}</Fragment>
            ))
          )}
        </Box>
      </Fade>

      <Paper
        elevation={2}
        sx={{ p: 3, borderRadius: 3, mt: 4, backgroundColor: "#f9f9f9" }}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/form/edit/${form._id}`)}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            Edit Form
          </Button>
          {form.isPublished && form.shareableLink && (
            <Button
              variant="outlined"
              startIcon={<Public />}
              onClick={() => navigate(`/form/${form.shareableLink}`)}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                borderColor: "#667eea",
                color: "#667eea",
                "&:hover": {
                  borderColor: "#5a6fd8",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
              }}
            >
              Open Public Link
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
