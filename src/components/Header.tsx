import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import logo from "../assets/logo-dio-loto.png";
//import eighteenIcon from "../assets/loto.png";  Ajoute ton image "18+"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState("fr"); // Langue par défaut : Français
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isAuthenticated()) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      navigate("/login");
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLangMenuOpen(event.currentTarget);
  };

  const handleLangMenuClose = (lang: string) => {
    setLanguage(lang);
    setLangMenuOpen(null);
  };

  // Gestionnaire pour les clics sur les éléments du menu
  const handleMenuItemClick = (path: string) => {
    handleDrawerToggle(); // Fermer le drawer
    
    // Si l'utilisateur n'est pas connecté et que la route n'est pas publique, rediriger vers login
    const publicRoutes = ["/guide"]; // Routes accessibles sans connexion
    
    if (!isAuthenticated() && !publicRoutes.includes(path)) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // Gestionnaire pour la déconnexion
  const handleLogout = () => {
    logout();
    navigate("/");
    handleProfileMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ background: "rgba(163, 89, 160)", padding: "10px 20px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Icône du menu hamburger */}
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>

        {/* Logo au centre */}
        <img src={logo} alt="Dio Loto Logo" style={{ height: 60 }} />

        {/* Langue & Profil */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Langue */}
          <IconButton color="inherit" onClick={handleLangMenuOpen}>
            <LanguageIcon />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              {language === "fr" ? "FR" : "EN"}
            </Typography>
          </IconButton>
          <Menu anchorEl={langMenuOpen} open={Boolean(langMenuOpen)} onClose={() => setLangMenuOpen(null)}>
            <MenuItem onClick={() => handleLangMenuClose("fr")}>🇫🇷 Français</MenuItem>
            <MenuItem onClick={() => handleLangMenuClose("en")}>🇬🇧 English</MenuItem>
          </Menu>

          {/* Profil */}
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
          {isAuthenticated() && (
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
              <MenuItem onClick={() => {handleProfileMenuClose(); navigate("/dashboard");}}>
                <DashboardIcon sx={{ marginRight: 1 }} /> Dashboard
              </MenuItem>
              <MenuItem onClick={() => {handleProfileMenuClose(); navigate("/profile");}}>
                <PersonIcon sx={{ marginRight: 1 }} /> Mon Compte
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{ marginRight: 1 }} /> Déconnexion
              </MenuItem>
            </Menu>
          )}
        </div>

      </Toolbar>

      {/* Menu latéral Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ "& .MuiDrawer-paper": { backgroundColor: "rgb(163, 89, 160)", width: "75%" } }}
      >
        <List>
          <ListItem 
            onClick={() => handleMenuItemClick("/acceuil")} 
            sx={{ color: "white", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "white" }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Accueil" sx={{ color: "white" }} />
          </ListItem>
          
          <ListItem 
            onClick={() => handleMenuItemClick("/guide")} 
            sx={{ color: "white", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "white" }}><InfoIcon /></ListItemIcon>
            <ListItemText primary="Guide" sx={{ color: "white" }} />
          </ListItem>
          
          <ListItem 
            onClick={() => handleMenuItemClick("/results")} 
            sx={{ color: "white", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "white" }}><SportsSoccerIcon /></ListItemIcon>
            <ListItemText primary="Résultats" sx={{ color: "white" }} />
          </ListItem>
          
          <ListItem 
            onClick={() => handleMenuItemClick("/commerciaux")} 
            sx={{ color: "white", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <ListItemIcon sx={{ color: "white" }}><StoreIcon /></ListItemIcon>
            <ListItemText primary="Commerciaux" sx={{ color: "white" }} />
          </ListItem>
          
          {/* Afficher soit "Connexion" soit "Déconnexion" en fonction de l'état d'authentification */}
          {!isAuthenticated() ? (
            <ListItem 
              onClick={() => handleMenuItemClick("/login")} 
              sx={{ color: "white", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            >
              <ListItemIcon sx={{ color: "white" }}><LoginIcon /></ListItemIcon>
              <ListItemText primary="Connexion" sx={{ color: "white" }} />
            </ListItem>
          ) : (
            <ListItem 
              onClick={() => {
                logout();
                navigate("/");
                handleDrawerToggle();
              }} 
              sx={{ color: "white", display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            >
              <ListItemIcon sx={{ color: "white" }}><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary="Déconnexion" sx={{ color: "white" }} />
            </ListItem>
          )}
        </List>

        <Divider sx={{ backgroundColor: "white", margin: "10px 0" }} />

        {/* Icône Interdit aux -18 ans */}
        <div style={{ textAlign: "center", padding: "10px" }}>
          <img src={logo} alt="logo loto dio" style={{ height: 70 }} />
          <Typography variant="body2" sx={{ color: "white" }}>Interdit aux -18 ans</Typography>
        </div>
      </Drawer>
    </AppBar>
  );
};

export default Header;