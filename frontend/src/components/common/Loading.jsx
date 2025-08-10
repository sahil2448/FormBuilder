import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loading = () => {
  return (
    <Box className="flex justify-center items-center py-12">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
