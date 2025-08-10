import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function CreateFormDialog({ open, onClose, onSubmit }) {
  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    headerImage: "",
    settings: {
      allowAnonymous: true,
      collectEmail: false,
      showResults: true,
    },
  });

  // UI state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        description: "",
        headerImage: "",
        settings: {
          allowAnonymous: true,
          collectEmail: false,
          showResults: true,
        },
      });
      setError("");
    }
  }, [open]);

  // Handle input changes
  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Handle settings changes
  const handleSettingChange = (setting) => (event) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: event.target.checked,
      },
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Form title is required");
      return false;
    }
    if (formData.title.trim().length < 3) {
      setError("Form title must be at least 3 characters");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || "Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-form-dialog-title"
    >
      <DialogTitle id="create-form-dialog-title">Create New Form</DialogTitle>

      <DialogContent dividers>
        <Box className="space-y-4">
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          <div className="flex flex-col gap-5">
            <TextField
              label="Form Title"
              variant="outlined"
              fullWidth
              required
              value={formData.title}
              onChange={handleInputChange("title")}
              error={!formData.title.trim() && error}
              disabled={loading}
            />

            <TextField
              label="Form Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange("description")}
              disabled={loading}
            />

            <TextField
              label="Header Image URL (Optional)"
              variant="outlined"
              fullWidth
              value={formData.headerImage}
              onChange={handleInputChange("headerImage")}
              disabled={loading}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <Box className="mt-6">
            <h3 className="text-lg font-medium mb-3">Form Settings</h3>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.allowAnonymous}
                    onChange={handleSettingChange("allowAnonymous")}
                    disabled={loading}
                  />
                }
                label="Allow Anonymous Responses"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.collectEmail}
                    onChange={handleSettingChange("collectEmail")}
                    disabled={loading}
                  />
                }
                label="Collect Email Addresses"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.showResults}
                    onChange={handleSettingChange("showResults")}
                    disabled={loading}
                  />
                }
                label="Show Results to Respondents"
              />
            </FormGroup>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Creating..." : "Create Form"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
