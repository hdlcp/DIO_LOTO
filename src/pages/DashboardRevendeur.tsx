import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import "../styles/Dashboard.css"; // ✅ Import du CSS
import { useAuth } from "../AuthContext"; // Importer le hook useAuth
import { getUserNotifications } from "../services/notificationService";

const DashboardRevendeur: React.FC = () => {
  const { user, token } = useAuth(); // Accéder aux informations de l'utilisateur via le contexte
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const navigate = useNavigate ? useNavigate() : () => {};

  // Assurez-vous que l'utilisateur et les informations du revendeur sont disponibles
  if (!user || !user.isRevendeur) {
    // Cela ne devrait normalement pas se produire si ProtectedRoute fonctionne correctement,
    // mais c'est une sécurité.
    return <div>Accès refusé ou informations revendeur non disponibles.</div>;
  }

  // Utiliser les informations spécifiques au revendeur depuis l'objet user
  const { firstName, lastName, solde, gain, soldeRevendeur, whatsapp, pays, status } = user;

  React.useEffect(() => {
    if (user?.uniqueUserId && token) {
      getUserNotifications(user.uniqueUserId, token)
        .then(res => setNotifications((res.data as { notifications: any[] }).notifications.slice(0, 5)))
        .catch(console.error);
    }
  }, [user, token]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* ✅ Header avec animation */}
        <motion.div
          className="dashboard-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
        Bienvenue {firstName} {lastName}
        </motion.div>

        {/* ✅ Balance Section avec nouveau design */}
        <div className="balance-section">
          <motion.div
            className="balance-box main-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3>💰 Solde principale</h3>
            <p>{solde?.toLocaleString() || 0} XOF</p>
          </motion.div>
          <motion.div
            className="balance-box reseller-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3>🏪 Solde revendeur</h3>
            <p>{soldeRevendeur?.toLocaleString() || 0} XOF</p>
          </motion.div>
          <motion.div
            className="balance-box gains-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h3>🎯 Gains</h3>
            <p>{gain?.toLocaleString() || 0} XOF</p>
          </motion.div>
          {/* Section bonus - Journée bonus terminée le 04/01/2026
          <motion.div
            className="balance-box bonus-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3>🎁 Bonus 10%</h3>
            <p>{user?.bonus?.toLocaleString() || 0} XOF</p>
            <small style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
              Valable le 04/01/2026 de 00h00 à 23h59
            </small>
          </motion.div>
          */}
        </div>

        {/* Afficher d'autres informations spécifiques au revendeur si nécessaire */}
        <motion.div 
          className="reseller-info"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
            <p><b>📱 WhatsApp:</b> {whatsapp}</p>
            <p><b>🌍 Pays:</b> {pays}</p>
            <p><b>✅ Statut:</b> {status}</p>
        </motion.div>

        {/* ✅ Boutons avec Material UI */}
        <div className="buttons-container">
          <Link to="/recharger_user">
            <Button variant="contained" className="custom-button"> RECHARGER</Button>
          </Link>
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

export default DashboardRevendeur;