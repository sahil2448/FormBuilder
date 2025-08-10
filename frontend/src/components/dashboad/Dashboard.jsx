import React, { useState, useEffect } from "react";

import { Container, Typography, Button, Alert, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import FormList from "./FormList";
import CreateFormDialog from "./CreateFormDialog";
import Loading from "../common/Loading";
import { formService } from "../../services/formService";

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New Form
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <FormList
        forms={forms}
        onDelete={handleDeleteForm}
        onPublish={handlePublishForm}
      />

      <CreateFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateForm}
      />
    </Container>
  );
};

export default Dashboard;
