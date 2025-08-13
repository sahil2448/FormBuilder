import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Alert,
  Box,
  Paper,
  Chip,
  Fade,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import FormList from "./FormList";
import CreateFormDialog from "./CreateFormDialog";
import Loading from "../common/Loading";
import { formService } from "../../services/formService";

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await formService.getForms();
      if (response.success) {
        setForms(response.data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");
      const response = await formService.getForms();
      if (response.success) {
        setForms(response.data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to refresh forms");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateForm = async (formData) => {
    try {
      const response = await formService.createForm(formData);
      if (response.success) {
        setForms((prev) => [...prev, response.data]);
        setCreateDialogOpen(false);
      }
    } catch (err) {
      setError(err.message || "Failed to create form");
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await formService.deleteForm(formId);
      setForms((prev) => prev.filter((form) => form._id !== formId));
    } catch (err) {
      setError(err.message || "Failed to delete form");
    }
  };

  const handlePublishForm = async (formId) => {
    try {
      const response = await formService.publishForm(formId);
      if (response.success) {
        setForms((prev) =>
          prev.map((form) =>
            form._id === formId ? { ...form, isPublished: true } : form
          )
        );
      }
    } catch (err) {
      setError(err.message || "Failed to publish form");
    }
  };

  if (loading) {
    return <Loading />;
  }

  const publishedForms = forms.filter((form) => form.isPublished);
  const draftForms = forms.filter((form) => !form.isPublished);

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
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <DashboardIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                My Forms
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Create, manage, and track your interactive forms
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            gap={1}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Tooltip title="Refresh forms">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: "bold",
                px: 3,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                },
              }}
            >
              Create New Form
            </Button>
          </Box>
        </Box>

        <Box display="flex" gap={3} mt={3} flexWrap="wrap">
          <Chip
            label={`${forms.length} Total Forms`}
            sx={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={`${publishedForms.length} Published`}
            sx={{
              backgroundColor: "rgba(76, 175, 80, 0.8)",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Chip
            label={`${draftForms.length} Drafts`}
            sx={{
              backgroundColor: "rgba(255, 152, 0, 0.8)",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>
      </Paper>

      {/* Error Alert */}
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
          p: 3,
          borderRadius: 3,
          backgroundColor: "#fafafa",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {forms.length > 0 ? (
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                Your Forms
              </Typography>
              <Chip
                size="small"
                label={forms.length}
                color="primary"
                variant="outlined"
              />
            </Box>
            <FormList
              forms={forms}
              onDelete={handleDeleteForm}
              onPublish={handlePublishForm}
            />
          </Box>
        ) : (
          <Box textAlign="center" py={6}>
            <Typography
              variant="h6"
              sx={{ color: "#666", mb: 2, fontWeight: 500 }}
            >
              🎯 Ready to create your first form?
            </Typography>
            <Typography variant="body1" sx={{ color: "#888", mb: 3 }}>
              Start building interactive forms with categorize, cloze, and
              comprehension questions.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              Create Your First Form
            </Button>
          </Box>
        )}
      </Paper>

      <CreateFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateForm}
      />
    </Container>
  );
};

export default Dashboard;
