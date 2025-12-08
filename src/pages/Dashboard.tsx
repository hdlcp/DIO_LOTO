import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import "../styles/Dashboard.css";
import { useAuth } from "../AuthContext";
import { getUserNotifications } from "../services/notificationService";

// Interface pour les données utilisateur
interface UserData {
  id: number;
  uniqueUserId: string;
  lastName: string;
  firstName: string;
  email: string;
  solde: number;
  bonus: number; // Solde bonus
  gain: number;
  created: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { token, logout, refreshUserData } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!token) {
      navigate("/login");
      return;
    }

    // Charger les informations utilisateur depuis l'API
    const fetchUserData = async () => {
      try {
        const freshUserData = await refreshUserData();
        if (freshUserData) {
          setUserData(freshUserData);
        } else {
          throw new Error('Impossible de récupérer les données utilisateur');
        }
      } catch (err) {
        setError("Impossible de charger les informations utilisateur");
        console.error("Erreur lors du chargement des données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, navigate, location.pathname, refreshUserData]);

  useEffect(() => {
    // Charger les notifications utilisateur
    if (userData?.uniqueUserId && token) {
      getUserNotifications(userData.uniqueUserId, token)
        .then(res => setNotifications((res.data as { notifications: any[] }).notifications.slice(0, 5)))
        .catch(console.error);
    }
  }, [userData, token]);

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
          Bienvenue {userData?.firstName} {userData?.lastName}
        </motion.div>

        {/* Balance Section avec nouveau design */}
        <div className="balance-section">
          <motion.div
            className="balance-box main-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3>💰 Solde principale</h3>
            <p>{userData?.solde?.toLocaleString() || 0} XOF</p>
          </motion.div>
          <motion.div
            className="balance-box gains-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3>🎯 Gains</h3>
            <p>{userData?.gain?.toLocaleString() || 0} XOF</p>
          </motion.div>
          {/* Section bonus masquée - Journée bonus terminée le 07/12/2025
          <motion.div
            className="balance-box bonus-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3>🎁 Bonus 10%</h3>
            <p>{userData?.bonus?.toLocaleString() || 0} XOF</p>
            <small style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
              Valable le 07/12/2025 de 00h00 à 23h59
            </small>
          </motion.div>
          */}
        </div>

        {/* Boutons avec Material UI */}
        <div className="buttons-container">
          <Link to="/recharger-with-gain">
            <Button variant="contained" className="custom-button">💰 RECHARGER AVEC GAIN</Button>
          </Link>
          <Link to="/withdrawal">
            <Button variant="contained" className="custom-button">🏦 RETRAIT</Button>
          </Link>
          <Link to="/tickets">
            <Button variant="contained" className="custom-button">🎟️ TICKETS</Button>
          </Link>
          <Link to="/historyWithdrawal">
            <Button variant="contained" className="custom-button">💸 HISTORIQUE DES RETRAITS</Button>
          </Link>
          <Link to="/games">
            <Button variant="contained" className="custom-button">🎲 JOUER</Button>
          </Link>
          <Link to="/panier">
            <Button variant="contained" className="custom-button">PANIER</Button>
          </Link>
          <Button variant="contained" onClick={handleLogout} className="custom-button">🚪 DÉCONNEXION</Button>
        </div>

        {/* Aperçu Notifications */}
        <div className="transactions-container">
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notification">Aucune notification</div>
            ) : notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-card${notif.isRead ? ' read' : ' unread'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/notifications')}
              >
                <div className="notif-header">
                  <span className="notif-title">{notif.title}</span>
                  <span className="notif-date">{new Date(notif.created).toLocaleString()}</span>
                </div>
                <div className="notif-message">
                  {notif.message.length > 40 ? notif.message.slice(0, 40) + '...' : notif.message}
                </div>
              </div>
            ))}
          </div>
          <p className="view-more" onClick={() => navigate("/notifications")}>Voir plus...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;