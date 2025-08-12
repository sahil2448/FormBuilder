// src/pages/HomePage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Fade,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PublicIcon from "@mui/icons-material/Public";
import InsightsIcon from "@mui/icons-material/Insights";
import ConstructionIcon from "@mui/icons-material/Construction";
import {
  PlayArrow,
  Dashboard,
  Star,
  TrendingUp,
  Speed,
  Security,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      title: "Create Forms & Quizzes",
      description:
        "Build interactive forms with Categorize, Cloze, and Comprehension questions easily.",
      icon: <AssignmentIcon sx={{ fontSize: 50, color: "#2196f3" }} />,
      color: "#2196f3",
      bgColor: "#e3f2fd",
    },
    {
      title: "Publish & Share",
      description:
        "Generate shareable links and allow anyone to attempt your published forms.",
      icon: <PublicIcon sx={{ fontSize: 50, color: "#4caf50" }} />,
      color: "#4caf50",
      bgColor: "#e8f5e8",
    },
    {
      title: "Analyze Responses",
      description:
        "Get instant scoring, detailed breakdowns, and response statistics for better insights.",
      icon: <InsightsIcon sx={{ fontSize: 50, color: "#ff9800" }} />,
      color: "#ff9800",
      bgColor: "#fff3e0",
    },
    {
      title: "Easy to Use",
      description:
        "Drag & drop interface, clean UI, and ready-to-use components powered by MUI.",
      icon: <ConstructionIcon sx={{ fontSize: 50, color: "#9c27b0" }} />,
      color: "#9c27b0",
      bgColor: "#f3e5f5",
    },
  ];

  const stats = [
    { label: "Interactive", value: "3", suffix: "Question Types" },
    { label: "Fast", value: "< 1s", suffix: "Response Time" },
    { label: "Secure", value: "100%", suffix: "Data Protection" },
  ];

  return (
    <Box sx={{ bgcolor: "#f8fafc", flexGrow: 1 }}>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 10, sm: 16 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box textAlign="center">
              <Chip
                label="🚀 Interactive Form Builder"
                sx={{
                  mb: 3,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  backdropFilter: "blur(10px)",
                }}
              />

              <Typography
                variant={isMobile ? "h4" : "h2"}
                fontWeight="bold"
                gutterBottom
                sx={{
                  mb: 2,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Welcome to FormBuilder
              </Typography>

              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Create. Publish. Analyze.
                <br />
                Your complete solution for interactive forms & quizzes.
              </Typography>

              {/* Stats Row */}
              <Box
                display="flex"
                justifyContent="center"
                gap={4}
                mb={5}
                flexWrap="wrap"
              >
                {stats.map((stat, index) => (
                  <Box key={index} textAlign="center">
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {stat.suffix}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Enhanced CTA Buttons */}
              <Box
                display="flex"
                gap={2}
                justifyContent="center"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate("/login")}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "#667eea",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Get Started Free
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Dashboard />}
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.8)",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 12 } }}>
        <Fade in timeout={1000}>
          <Box textAlign="center" mb={8}>
            <Chip
              label="✨ Key Features"
              sx={{
                mb: 2,
                backgroundColor: "#667eea",
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Everything You Need
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Powerful tools to create, share, and analyze interactive forms and
              quizzes
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Fade in timeout={1200 + index * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    height: 280,
                    width: "100%",
                    maxWidth: 320,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 4,
                    border: `2px solid ${feature.color}20`,
                    backgroundColor: "white",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 40px ${feature.color}30`,
                      borderColor: `${feature.color}60`,
                      "& .feature-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                      "& .feature-bg": {
                        opacity: 1,
                        transform: "scale(1.2)",
                      },
                    },
                    transition:
                      "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  {/* Background Decoration */}
                  <Box
                    className="feature-bg"
                    sx={{
                      position: "absolute",
                      top: -20,
                      right: -20,
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      backgroundColor: feature.bgColor,
                      opacity: 0.3,
                      transform: "scale(0.8)",
                      transition: "all 0.4s ease-in-out",
                    }}
                  />

                  <CardContent
                    sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}
                  >
                    <Box
                      className="feature-icon"
                      sx={{
                        mb: 2,
                        transition: "all 0.4s ease-in-out",
                      }}
                    >
                      {feature.icon}
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        mb: 2,
                        color: feature.color,
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                      }}
                    >
                      {feature.description}
                    </Typography>

                    {/* Feature Badge */}
                    <Chip
                      icon={<Star sx={{ fontSize: 16 }} />}
                      label="Popular"
                      size="small"
                      sx={{
                        mt: 2,
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}
                    />
                  </CardContent>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced Footer */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          color: "white",
          py: 4,
        }}
      >
        <Container>
          <Box textAlign="center">
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                fontWeight: 500,
              }}
            >
              © {new Date().getFullYear()} FormBuilder — Built with ❤️ using
              MERN Stack & MUI
            </Typography>

            <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
              <Chip
                icon={<Speed />}
                label="Fast"
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
              <Chip
                icon={<Security />}
                label="Secure"
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
              <Chip
                icon={<Star />}
                label="Trusted"
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
