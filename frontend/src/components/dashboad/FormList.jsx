// components/Dashboard/FormList.jsx
import React from "react";
import { Grid, Typography } from "@mui/material";
import FormCard from "./FormCard";

const FormList = ({ forms, onDelete, onPublish }) => {
  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography variant="h6" className="text-gray-500">
          No forms created yet
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Click "Create New Form" to get started
        </Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={3}>
      {forms.map((form) => (
        <Grid item xs={12} sm={6} md={4} key={form._id}>
          <FormCard form={form} onDelete={onDelete} onPublish={onPublish} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FormList;
