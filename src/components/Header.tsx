import React, { useState } from "react";
import {
  AppBar, Toolbar, IconButton, Menu, MenuItem,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import BarChartIcon from "@mui/icons-material/BarChart";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import logo from "../assets/logo-dio-loto.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const DRAWER_WIDTH = 280;

const drawerPaper = {
  backgroundColor: "#0d1526",
  borderRight: "1px solid rgba(255,255,255,0.07)",
  width: DRAWER_WIDTH,
  display: "flex",
  flexDirection: "column" as const,
};

const itemBase = {
  color: "rgba(255,255,255,0.7)",
  cursor: "pointer",
  borderRadius: "8px",
  margin: "2px 12px",
  padding: "10px 12px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(168,85,247,0.1)",
    color: "#fff",
    borderLeft: "3px solid #a855f7",
    paddingLeft: "9px",
  },
};

const iconBase = { color: "inherit", minWidth: 36 };

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleProfileMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated()) { navigate("/login"); return; }
    setAnchorEl(e.currentTarget);
  };

  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleMenuItemClick = (path: string) => {
    setMobileOpen(false);
    const publicRoutes = ["/guide", "/results", "/commerciaux"];
    if (!isAuthenticated() && !publicRoutes.includes(path)) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleProfileMenuClose();
    setMobileOpen(false);
  };

  const navItems = [
    { label: "Accueil",    path: "/acceuil",     icon: <HomeIcon /> },
    { label: "Guide",      path: "/guide",        icon: <InfoIcon /> },
    { label: "Résultats",  path: "/results",      icon: <BarChartIcon /> },
    { label: "Revendeurs", path: "/commerciaux",  icon: <StoreIcon /> },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "#0d1526",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "none",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, #a855f7, #4169e1)",
          },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "64px !important", px: "16px" }}>

          {/* Hamburger */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "rgba(255,255,255,0.6)",
              "&:hover": { color: "#fff", backgroundColor: "rgba(168,85,247,0.1)" },
              borderRadius: "8px",
              p: "8px",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo centré */}
          <img
            src={logo}
            alt="Dio Loto"
            style={{ height: 44, cursor: "pointer", objectFit: "contain" }}
            onClick={() => navigate("/")}
          />

          {/* Profil */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                color: "rgba(255,255,255,0.6)",
                "&:hover": { color: "#fff", backgroundColor: "rgba(168,85,247,0.1)" },
                borderRadius: "8px",
                p: "8px",
              }}
            >
              <AccountCircleIcon />
            </IconButton>

            {isAuthenticated() && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    backgroundColor: "#0d1526",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    minWidth: 200,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    mt: 1,
                  },
                }}
              >
                <MenuItem
                  onClick={() => { handleProfileMenuClose(); navigate("/dashboard"); }}
                  sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", gap: 1, "&:hover": { backgroundColor: "rgba(168,85,247,0.1)", color: "#fff" } }}
                >
                  <DashboardIcon sx={{ fontSize: 18 }} /> Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => { handleProfileMenuClose(); navigate("/profile"); }}
                  sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", gap: 1, "&:hover": { backgroundColor: "rgba(168,85,247,0.1)", color: "#fff" } }}
                >
                  <PersonIcon sx={{ fontSize: 18 }} /> Mon Compte
                </MenuItem>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 0.5 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: "#ef4444", fontSize: "0.875rem", gap: 1, "&:hover": { backgroundColor: "rgba(239,68,68,0.1)" } }}
                >
                  <ExitToAppIcon sx={{ fontSize: 18 }} /> Déconnexion
                </MenuItem>
              </Menu>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer latéral */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{ sx: drawerPaper }}
      >
        {/* Header du drawer */}
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <img src={logo} alt="Dio Loto" style={{ height: 36, objectFit: "contain" }} />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }}>DIO LOTO</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "1px", textTransform: "uppercase" }}>Plateforme de jeux</div>
          </div>
        </div>

        {/* Navigation */}
        <List sx={{ flex: 1, pt: 1.5 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} onClick={() => handleMenuItemClick(item.path)} sx={itemBase}>
              <ListItemIcon sx={iconBase}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
              />
            </ListItem>
          ))}

          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 1, mx: 2 }} />

          {!isAuthenticated() ? (
            <ListItem onClick={() => handleMenuItemClick("/login")} sx={itemBase}>
              <ListItemIcon sx={iconBase}><LoginIcon /></ListItemIcon>
              <ListItemText primary="Connexion" primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }} />
            </ListItem>
          ) : (
            <ListItem onClick={handleLogout} sx={{ ...itemBase, color: "#ef4444", "&:hover": { backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", borderLeft: "3px solid #ef4444", paddingLeft: "9px" } }}>
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Déconnexion" primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }} />
            </ListItem>
          )}
        </List>

        {/* Footer drawer */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: "50%",
            border: "2px solid rgba(239,68,68,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ef4444", fontWeight: 900, fontSize: "0.7rem", flexShrink: 0,
          }}>
            18+
          </div>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", lineHeight: 1.4 }}>
            Jeu réservé aux personnes majeures. Jouer peut créer une dépendance.
          </Typography>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
