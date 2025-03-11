import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon  from "@mui/icons-material/Language";
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
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState("fr"); // Langue par défaut : Français

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
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
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem component={Link} to="/dashboard" onClick={handleProfileMenuClose}>
              <DashboardIcon sx={{ marginRight: 1 }} /> Dashboard
            </MenuItem>
            <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
              <PersonIcon sx={{ marginRight: 1 }} /> Mon Compte
            </MenuItem>
            <Divider />
            <MenuItem component={Link} to="/" onClick={handleProfileMenuClose}>
              <ExitToAppIcon sx={{ marginRight: 1 }} /> Déconnexion
            </MenuItem>
          </Menu>
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
        <ListItem component={Link} to="/acceuil" onClick={handleDrawerToggle} sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>

<ListItemIcon sx={{ color: "white" }}><HomeIcon /></ListItemIcon>
<ListItemText primary="Accueil" sx={{ color: "white" }} />
</ListItem>
<ListItem component={Link} to="/guide" onClick={handleDrawerToggle} sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>

<ListItemIcon sx={{ color: "white" }}><InfoIcon /></ListItemIcon>
<ListItemText primary="Guide" sx={{ color: "white" }} />
</ListItem>
<ListItem component={Link} to="/results" onClick={handleDrawerToggle} sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>

<ListItemIcon sx={{ color: "white" }}><SportsSoccerIcon /></ListItemIcon>
<ListItemText primary="Résultats" sx={{ color: "white" }} />
</ListItem>
<ListItem component={Link} to="/commerciaux" onClick={handleDrawerToggle} sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>

<ListItemIcon sx={{ color: "white" }}><StoreIcon /></ListItemIcon>
<ListItemText primary="Commerciaux" sx={{ color: "white" }} />
</ListItem>
<ListItem component={Link} to="/login" onClick={handleDrawerToggle} sx={{ color: "white", display: "flex", alignItems: "center", gap: 1 }}>

<ListItemIcon sx={{ color: "white" }}><LoginIcon /></ListItemIcon>
<ListItemText primary="Connexion" sx={{ color: "white" }} />
</ListItem>
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







