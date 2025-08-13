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
  Paper,
  Typography,
  Divider,
  IconButton,
  Chip,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Close,
  Add,
  Assignment,
  Settings,
  Image,
  Security,
  Visibility,
  Email,
} from "@mui/icons-material";

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

  const settingsConfig = [
    {
      key: "allowAnonymous",
      icon: <Security sx={{ fontSize: 20 }} />,
      label: "Allow Anonymous Responses",
      description: "Let users submit without logging in",
      color: "#2196f3",
    },
    {
      key: "collectEmail",
      icon: <Email sx={{ fontSize: 20 }} />,
      label: "Collect Email Addresses",
      description: "Require email for form submissions",
      color: "#ff9800",
    },
    {
      key: "showResults",
      icon: <Visibility sx={{ fontSize: 20 }} />,
      label: "Show Results to Respondents",
      description: "Display scores after completion",
      color: "#4caf50",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="create-form-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Enhanced Dialog Title */}
      <DialogTitle
        id="create-form-dialog-title"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Assignment sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Create New Form
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Loading Progress Bar */}
      {loading && (
        <Box
          sx={{
            height: 3,
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}

      <DialogContent sx={{ p: 3, backgroundColor: "#fafafa" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Fade in={!!error}>
            <Box>
              {error && (
                <Alert
                  severity="error"
                  sx={{ borderRadius: 2, mb: 2 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Assignment sx={{ color: "#667eea", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                Form Details
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                label="Form Title"
                variant="outlined"
                fullWidth
                required
                value={formData.title}
                onChange={handleInputChange("title")}
                error={!formData.title.trim() && error}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Assignment
                      sx={{ color: "grey.400", fontSize: 20, mr: 1 }}
                    />
                  ),
                }}
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
                placeholder="Describe what this form is about..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                label="Header Image URL (Optional)"
                variant="outlined"
                fullWidth
                value={formData.headerImage}
                onChange={handleInputChange("headerImage")}
                disabled={loading}
                placeholder="https://example.com/image.jpg"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Image sx={{ color: "grey.400", fontSize: 20, mr: 1 }} />
                  ),
                }}
              />
            </Box>
          </Paper>

          {/* Form Settings Section */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Settings sx={{ color: "#667eea", fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                Form Settings
              </Typography>
              <Chip
                label="3 Options"
                size="small"
                sx={{
                  backgroundColor: "#667eea",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>

            <FormGroup>
              {settingsConfig.map((setting) => (
                <Paper
                  key={setting.key}
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: formData.settings[setting.key]
                      ? `2px solid ${setting.color}`
                      : "2px solid #e0e0e0",
                    backgroundColor: formData.settings[setting.key]
                      ? `${setting.color}10`
                      : "white",
                    "&:hover": {
                      borderColor: setting.color,
                      backgroundColor: `${setting.color}05`,
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.settings[setting.key]}
                        onChange={handleSettingChange(setting.key)}
                        disabled={loading}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: setting.color,
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: setting.color,
                            },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1} flex={1}>
                        <Box sx={{ color: setting.color }}>{setting.icon}</Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600">
                            {setting.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {setting.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{
                      width: "100%",
                      m: 0,
                      "& .MuiFormControlLabel-label": {
                        width: "100%",
                      },
                    }}
                  />
                </Paper>
              ))}
            </FormGroup>
          </Paper>

          {/* Preview Section */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#f8f9fa",
              border: "2px dashed #667eea",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="500"
            >
              💡 Preview: Your form "{formData.title || "Untitled Form"}" will
              be created with{" "}
              {Object.values(formData.settings).filter(Boolean).length} enabled
              settings
            </Typography>
          </Paper>
        </Box>
      </DialogContent>

      {/* Enhanced Dialog Actions */}
      <DialogActions
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "600",
          }}
        >
          Cancel
        </Button>
        <Tooltip
          title={!formData.title.trim() ? "Enter a form title to continue" : ""}
        >
          <span>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !formData.title.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Add />}
              sx={{
                borderRadius: 2,
                px: 4,
                fontWeight: "bold",
                background: loading
                  ? "#ccc"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: loading
                    ? "#ccc"
                    : "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
                "&:disabled": {
                  background: "#ccc",
                  color: "white",
                },
              }}
            >
              {loading ? "Creating..." : "Create Form"}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
