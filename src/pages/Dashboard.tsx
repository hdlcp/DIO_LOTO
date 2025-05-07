import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Table, TableHead, TableRow, TableCell } from "@mui/material";
import "../styles/Dashboard.css";
import { useAuth } from "../AuthContext";

// Interface pour les données utilisateur
interface UserData {
  id: number;
  uniqueUserId: string;
  lastName: string;
  firstName: string;
  email: string;
  solde: number;
  gain: number;
  created: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!token) {
      navigate("/login");
      return;
    }

    // Récupération de l'ID utilisateur depuis localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const user = JSON.parse(storedUser);
    const userId = user.id || user.uniqueUserId;

    // Charger les informations utilisateur
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://dio-loto-api.onrender.com/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Échec de récupération des informations utilisateur');
        }
        
        setUserData(data.data);
      } catch (err) {
        setError("Impossible de charger les informations utilisateur");
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">Erreur</div>
          <div className="error-message">{error}</div>
          <Button variant="contained" onClick={handleLogout} className="custom-button">
            Déconnexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header avec animation */}
        <motion.div
          className="dashboard-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard 📁 - Bienvenue {userData?.firstName} {userData?.lastName}
        </motion.div>

        {/* Balance Section */}
        <div className="balance-section">
          <motion.div
            className="balance-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Solde principale</h3>
            <p>{userData?.solde} XOF</p>
          </motion.div>
          <motion.div
            className="balance-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3>Gains</h3>
            <p>{userData?.gain} XOF</p>
          </motion.div>
        </div>

        {/* Boutons avec Material UI */}
        <div className="buttons-container">
          <Link to="/recharger">
            <Button variant="contained" className="custom-button">💰 RECHARGER AVEC GAIN</Button>
          </Link>
          <Link to="/withdrawal">
            <Button variant="contained" className="custom-button">🏦 RETRAIT</Button>
          </Link>
          <Link to="/tickets">
            <Button variant="contained" className="custom-button">🎟️ TICKETS</Button>
          </Link>
          <Link to="/cart">
            <Button variant="contained" className="custom-button">🛒 PANIER</Button>
          </Link>
          <Link to="/games">
            <Button variant="contained" className="custom-button">🎲 JOUER</Button>
          </Link>
          <Button variant="contained" onClick={handleLogout} className="custom-button">🚪 DÉCONNEXION</Button>
        </div>

        {/* Tableau Transactions */}
        <div className="transactions-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <p className="view-more">Voir plus...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;