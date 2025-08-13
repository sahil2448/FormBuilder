import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Login,
  Logout,
  Dashboard,
  Assignment,
  Person,
  Home,
  Close,
} from "@mui/icons-material";

export default function Navbar() {
  const routeTo = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  React.useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, [location.pathname]);

  React.useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  React.useEffect(() => {
    const handleLoginEvent = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("authStateChange", handleLoginEvent);
    return () => {
      window.removeEventListener("authStateChange", handleLoginEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileDrawerOpen(false);
    window.dispatchEvent(new Event("authStateChange"));
    routeTo("/login");
  };

  const handleLogin = () => {
    setMobileDrawerOpen(false);
    routeTo("/login");
  };

  const handleDashboard = () => {
    setMobileDrawerOpen(false);
    routeTo("/dashboard");
  };

  const handleHome = () => {
    setMobileDrawerOpen(false);
    routeTo("/");
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const isOnDashboard = location.pathname === "/dashboard";
  const isOnLogin = location.pathname === "/login";
  const isOnHome = location.pathname === "/";

  const drawerContent = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Assignment sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            FormBuilder
          </Typography>
        </Box>
        <IconButton onClick={toggleMobileDrawer} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: isLoggedIn ? "#4caf50" : "#9e9e9e",
            }}
          >
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {isLoggedIn ? "Welcome Back!" : "Guest User"}
            </Typography>
            <Chip
              label={isLoggedIn ? "Online" : "Not Logged In"}
              size="small"
              sx={{
                backgroundColor: isLoggedIn ? "#4caf50" : "#9e9e9e",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleHome}
            selected={isOnHome}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.Mui-selected": {
                backgroundColor: "#667eea15",
                color: "#667eea",
                "& .MuiListItemIcon-root": {
                  color: "#667eea",
                },
              },
            }}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleDashboard}
              selected={isOnDashboard}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&.Mui-selected": {
                  backgroundColor: "#667eea15",
                  color: "#667eea",
                  "& .MuiListItemIcon-root": {
                    color: "#667eea",
                  },
                },
              }}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        {isLoggedIn ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: "600",
              borderColor: "#f44336",
              color: "#f44336",
              "&:hover": {
                backgroundColor: "#f4433615",
                borderColor: "#d32f2f",
              },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<Login />}
            onClick={handleLogin}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: "600",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            {isOnLogin ? "Sign In" : "Login"}
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar sx={{ py: { xs: 0.5, sm: 1 }, minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && (
            <Tooltip title="Menu">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileDrawer}
                sx={{
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}

          <Box
            display="flex"
            alignItems="center"
            gap={{ xs: 0.5, sm: 1 }}
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              minWidth: 0,
            }}
            onClick={() => routeTo("/")}
          >
            <Assignment sx={{ fontSize: { xs: 24, sm: 28 } }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: "bold",
                letterSpacing: "0.5px",
                "&:hover": {
                  opacity: 0.9,
                },
                transition: "opacity 0.2s ease-in-out",
                display: { xs: "block", xxs: "none" },
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
              }}
            >
              {isMobile && !isTablet ? "FormBuilder" : "FormBuilder"}
            </Typography>
          </Box>

          {!isMobile && (
            <Box display="flex" alignItems="center" gap={{ sm: 1, md: 2 }}>
              {isLoggedIn ? (
                <>
                  {!isOnDashboard && (
                    <Tooltip title="Go to Dashboard">
                      <Button
                        color="inherit"
                        startIcon={!isTablet && <Dashboard />}
                        onClick={handleDashboard}
                        size={isTablet ? "small" : "medium"}
                        sx={{
                          borderRadius: 3,
                          px: { sm: 2, md: 3 },
                          py: 1,
                          fontWeight: "600",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          },
                          transition: "all 0.3s ease-in-out",
                          fontSize: { sm: "0.8rem", md: "0.875rem" },
                        }}
                      >
                        {isTablet ? "Dashboard" : "Dashboard"}
                      </Button>
                    </Tooltip>
                  )}

                  {!isTablet && (
                    <Tooltip title="Logged in user">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: "rgba(255,255,255,0.2)",
                          border: "2px solid rgba(255,255,255,0.3)",
                        }}
                      >
                        <Person />
                      </Avatar>
                    </Tooltip>
                  )}

                  <Chip
                    icon={<Person />}
                    label="Online"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(76, 175, 80, 0.9)",
                      color: "white",
                      fontWeight: "bold",
                      display: { xs: "none", lg: "flex" },
                      fontSize: { sm: "0.7rem", md: "0.75rem" },
                    }}
                  />

                  <Tooltip title="Logout">
                    <Button
                      color="inherit"
                      startIcon={!isTablet && <Logout />}
                      onClick={handleLogout}
                      size={isTablet ? "small" : "medium"}
                      sx={{
                        borderRadius: 3,
                        px: { sm: 2, md: 3 },
                        py: 1,
                        fontWeight: "600",
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(244, 67, 54, 0.3)",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.2)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
                        },
                        transition: "all 0.3s ease-in-out",
                        fontSize: { sm: "0.8rem", md: "0.875rem" },
                      }}
                    >
                      Logout
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Chip
                    icon={<Person />}
                    label="Guest"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(158, 158, 158, 0.9)",
                      color: "white",
                      fontWeight: "bold",
                      display: { xs: "none", lg: "flex" },
                      fontSize: { sm: "0.7rem", md: "0.75rem" },
                    }}
                  />

                  <Tooltip title="Login to access your forms">
                    <Button
                      color="inherit"
                      startIcon={!isTablet && <Login />}
                      onClick={handleLogin}
                      size={isTablet ? "small" : "medium"}
                      sx={{
                        borderRadius: 3,
                        px: { sm: 2, md: 3 },
                        py: 1,
                        fontWeight: "600",
                        backgroundColor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.25)",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        },
                        transition: "all 0.3s ease-in-out",
                        fontSize: { sm: "0.8rem", md: "0.875rem" },
                      }}
                    >
                      {isOnLogin ? "Sign In" : "Login"}
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>
          )}

          {isMobile && isLoggedIn && (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label="Online"
                size="small"
                sx={{
                  backgroundColor: "rgba(76, 175, 80, 0.9)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  height: 24,
                }}
              />
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Person sx={{ fontSize: 18 }} />
              </Avatar>
            </Box>
          )}

          {isMobile && !isLoggedIn && (
            <Chip
              label="Guest"
              size="small"
              sx={{
                backgroundColor: "rgba(158, 158, 158, 0.9)",
                color: "white",
                fontWeight: "bold",
                fontSize: "0.7rem",
                height: 24,
              }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundImage: "none",
            backgroundColor: "white",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
