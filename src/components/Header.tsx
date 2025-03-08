import React, { useState } from "react";
import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Drawer, List, ListItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import logo from "../assets/logo-dio-loto.png"; // Assure-toi que le chemin est correct

const Header: React.FC = () => {
  // 🛠️ Déplace ces lignes DANS le composant !
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ background: "#0D0D0D", padding: "10px 40px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Dio Loto Logo" style={{ height: 50 }} />
        </Link>
  
        {/* MENU BURGER POUR MOBILE */}
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ display: { xs: "block", md: "none" }, color: "white" }}
        >
          <MenuIcon />
        </IconButton>
  
        <Drawer
  anchor="left"
  open={mobileOpen}
  onClose={handleDrawerToggle}
  sx={{ "& .MuiDrawer-paper": { backgroundColor: "#0D0D0D" } }} // Fond noir
>
  <List>
    <ListItem component={Link} to="/" onClick={handleDrawerToggle} sx={{ color: "white" }}>
      Accueil
    </ListItem>
    <ListItem component={Link} to="/guide" onClick={handleDrawerToggle} sx={{ color: "white" }}>
      Guide
    </ListItem>
    <ListItem component={Link} to="/results" onClick={handleDrawerToggle} sx={{ color: "white" }}>
      Résultats
    </ListItem>
    <ListItem component={Link} to="/commerciaux" onClick={handleDrawerToggle} sx={{ color: "white" }}>
      Commerciaux
    </ListItem>
    <ListItem component={Link} to="/login" onClick={handleDrawerToggle} sx={{ color: "white" }}>
      Connexion
    </ListItem>
  </List>
</Drawer>
  
        {/* MENU NORMAL POUR GRAND ÉCRAN */}
        <div style={{ display: "none" }} className="menu-desktop">
          <Button color="inherit" component={Link} to="/">Accueil</Button>
          <Button color="inherit" component={Link} to="/guide">Guide</Button>
          <Button color="inherit" component={Link} to="/results">Résultats</Button>
          <Button color="inherit" component={Link} to="/commerciaux">Commerciaux</Button>
          <Button color="inherit" component={Link} to="/login">Connexion</Button>
        </div>
  
        {/* Langue & Profil */}
        <div>
          <IconButton color="inherit">
            <LanguageIcon />
          </IconButton>
  
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
  
          {/* Menu déroulant Profil */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Mon Compte</MenuItem>
            <MenuItem onClick={handleMenuClose}>Déconnexion</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
