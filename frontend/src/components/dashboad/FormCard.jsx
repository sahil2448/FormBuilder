// components/Dashboard/FormCard.jsx - Updated
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Paper,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Publish,
  Visibility,
  Assignment,
  Public,
  Schedule,
  Star,
} from "@mui/icons-material";

const FormCard = ({ form, onDelete, onPublish }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/form/edit/${form._id}`);
    console.log(form._id);
  };

  const handlePreview = () => {
    if (form.isPublished) {
      navigate(`/form/preview/${form._id}`);
    }
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.05)",
        backgroundColor: "white",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          elevation: 6,
          transform: "translateY(-4px)",
          "& .form-card-header": {
            background: form.isPublished
              ? "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)"
              : "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
          },
          "& .form-card-actions": {
            backgroundColor: "#f8f9fa",
          },
        },
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      {/* Status Indicator Bar */}
      <Box
        className="form-card-header"
        sx={{
          height: 4,
          background: form.isPublished
            ? "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)"
            : "linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)",
          transition: "all 0.3s ease-in-out",
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1} flex={1} mr={1}>
            <Assignment
              sx={{
                color: form.isPublished ? "#4caf50" : "#ff9800",
                fontSize: 20,
              }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: "#333",
                fontSize: "1.1rem",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {form.title}
            </Typography>
          </Box>

          <Tooltip title="More options">
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                color: "grey.500",
                "&:hover": {
                  backgroundColor: form.isPublished ? "#4caf5015" : "#ff980015",
                  color: form.isPublished ? "#4caf50" : "#ff9800",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 3,
            minHeight: 40,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {form.description || "📝 No description provided"}
        </Typography>

        {/* Status Chips */}
        <Box display="flex" gap={1.5} mb={3} flexWrap="wrap">
          <Chip
            icon={form.isPublished ? <Public /> : <Schedule />}
            label={form.isPublished ? "Published" : "Draft"}
            sx={{
              backgroundColor: form.isPublished ? "#4caf50" : "#ff9800",
              color: "white",
              fontWeight: "bold",
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
            size="small"
          />
          <Chip
            icon={<Assignment />}
            label={`${form.questions?.length || 0} questions`}
            variant="outlined"
            size="small"
            sx={{
              borderColor: form.isPublished ? "#4caf50" : "#ff9800",
              color: form.isPublished ? "#4caf50" : "#ff9800",
              fontWeight: "500",
              "& .MuiChip-icon": {
                color: form.isPublished ? "#4caf50" : "#ff9800",
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Footer Info */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            📅 Created: {new Date(form.createdAt).toLocaleDateString()}
          </Typography>
          {form.isPublished && (
            <Tooltip title="This form is live and accepting responses">
              <Chip
                icon={<Star />}
                label="Live"
                size="small"
                sx={{
                  backgroundColor: "#e8f5e8",
                  color: "#2e7d32",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                }}
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>

      {/* Enhanced Card Actions */}
      <CardActions
        className="form-card-actions"
        sx={{
          p: 2,
          pt: 0,
          backgroundColor: "transparent",
          borderTop: "1px solid rgba(0,0,0,0.05)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Box display="flex" gap={1} width="100%" flexWrap="wrap">
          <Tooltip title="Edit form">
            <Button
              size="small"
              onClick={handleEdit}
              startIcon={<Edit />}
              sx={{
                borderRadius: 2,
                px: 2,
                fontWeight: "600",
                color: "#667eea",
                "&:hover": {
                  backgroundColor: "#667eea15",
                  color: "#5a6fd8",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Edit
            </Button>
          </Tooltip>

          {form.isPublished ? (
            <Tooltip title="Preview published form">
              <Button
                size="small"
                onClick={handlePreview}
                startIcon={<Visibility />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  fontWeight: "600",
                  color: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#4caf5015",
                    color: "#45a049",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Preview
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Publish form to make it live">
              <Button
                size="small"
                startIcon={<Publish />}
                onClick={() => onPublish(form._id)}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  fontWeight: "600",
                  color: "#ff9800",
                  "&:hover": {
                    backgroundColor: "#ff980015",
                    color: "#f57c00",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Publish
              </Button>
            </Tooltip>
          )}
        </Box>
      </CardActions>

      {/* Enhanced Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.05)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onDelete(form._id);
            handleMenuClose();
          }}
          sx={{
            color: "error.main",
            "&:hover": {
              backgroundColor: "error.50",
            },
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
          }}
        >
          <Delete sx={{ mr: 2, fontSize: 18 }} />
          <Typography variant="body2" fontWeight="500">
            Delete Form
          </Typography>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default FormCard;
