// components/FormEditor/FormSettings.jsx
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Save } from "@mui/icons-material";

const FormSettings = ({ form, onSave, saving }) => {
  const [formData, setFormData] = useState({
    title: form?.title || "",
    description: form?.description || "",
    headerImage: form?.headerImage || "",
    settings: {
      allowAnonymous: form?.settings?.allowAnonymous || true,
      collectEmail: form?.settings?.collectEmail || false,
      showResults: form?.settings?.showResults || true,
    },
  });

  const [error, setError] = useState("");

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSettingChange = (setting) => (event) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: event.target.checked,
      },
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Form title is required");
      return;
    }

    try {
      setError("");
      await onSave(formData);
    } catch (err) {
      setError(err.message || "Failed to save form");
    }
  };

  return (
    <Box className="max-w-2xl">
      <Typography variant="h6" className="mb-4">
        Form Settings
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Box className="space-y-4 mt-3">
        <div className="flex flex-col gap-5 ">
          <TextField
            label="Form Title"
            fullWidth
            required
            value={formData.title}
            onChange={handleInputChange("title")}
            disabled={saving}
          />

          <TextField
            label="Form Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange("description")}
            disabled={saving}
          />

          <TextField
            label="Header Image URL"
            fullWidth
            value={formData.headerImage}
            onChange={handleInputChange("headerImage")}
            disabled={saving}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <Box className="mt-6">
          <Typography variant="subtitle1" className="mb-3">
            Form Options
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.settings.allowAnonymous}
                  onChange={handleSettingChange("allowAnonymous")}
                  disabled={saving}
                />
              }
              label="Allow Anonymous Responses"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.settings.collectEmail}
                  onChange={handleSettingChange("collectEmail")}
                  disabled={saving}
                />
              }
              label="Collect Email Addresses"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.settings.showResults}
                  onChange={handleSettingChange("showResults")}
                  disabled={saving}
                />
              }
              label="Show Results to Respondents"
            />
          </FormGroup>
        </Box>

        <Box className="pt-4">
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={saving || !formData.title.trim()}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FormSettings;
