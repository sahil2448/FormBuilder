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
} from "@mui/material";
import {
  MoreVert,
  Edit,
  Delete,
  Publish,
  Visibility,
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
    <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex justify-between items-start mb-2">
          <Typography variant="h6" className="font-semibold truncate">
            {form.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </div>

        <Typography variant="body2" className="text-gray-600 mb-3">
          {form.description || "No description"}
        </Typography>

        <div className="flex gap-2 mb-3">
          <Chip
            label={form.isPublished ? "Published" : "Draft"}
            color={form.isPublished ? "success" : "default"}
            size="small"
          />
          <Chip
            label={`${form.questions?.length || 0} questions`}
            variant="outlined"
            size="small"
          />
        </div>

        <Typography variant="caption" className="text-gray-500">
          Created: {new Date(form.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={handleEdit} startIcon={<Edit />}>
          Edit
        </Button>
        {form.isPublished && (
          <Button
            size="small"
            onClick={handlePreview}
            startIcon={<Visibility />}
          >
            Preview
          </Button>
        )}
        {!form.isPublished && (
          <Button
            size="small"
            startIcon={<Publish />}
            onClick={() => onPublish(form._id)}
          >
            Publish
          </Button>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            onDelete(form._id);
            handleMenuClose();
          }}
        >
          <Delete className="mr-2" />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default FormCard;
