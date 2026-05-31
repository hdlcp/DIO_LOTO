import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import "../styles/Dashboard.css";
import { useAuth } from "../AuthContext";
import { getUserNotifications } from "../services/notificationService";
import { FaWallet, FaStore, FaTrophy, FaUserCheck, FaWhatsapp, FaGlobe, FaExchangeAlt, FaArrowDown, FaTicketAlt, FaHistory, FaPlay, FaShoppingCart, FaUserPlus } from "react-icons/fa";

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
            <h3><FaWallet size={12} style={{marginRight: 6}} />Solde principale</h3>
            <p>{solde?.toLocaleString() || 0} XOF</p>
          </motion.div>
          <motion.div
            className="balance-box reseller-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3><FaStore size={12} style={{marginRight: 6}} />Solde revendeur</h3>
            <p>{soldeRevendeur?.toLocaleString() || 0} XOF</p>
          </motion.div>
          <motion.div
            className="balance-box gains-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <h3><FaTrophy size={12} style={{marginRight: 6}} />Gains</h3>
            <p>{gain?.toLocaleString() || 0} XOF</p>
          </motion.div>
          {/* Section bonus - Journée bonus terminée le 01/03/2025
          <motion.div
            className="balance-box bonus-balance"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3>🎁 Bonus 10%</h3>
            <p>{user?.bonus?.toLocaleString() || 0} XOF</p>
            <small style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
              Valable le 01/03/2025 de 00h00 à 23h59
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
            <p><b><FaWhatsapp size={13} style={{marginRight: 6, verticalAlign: 'middle'}} />WhatsApp:</b> {whatsapp}</p>
            <p><b><FaGlobe size={13} style={{marginRight: 6, verticalAlign: 'middle'}} />Pays:</b> {pays}</p>
            <p><b><FaUserCheck size={13} style={{marginRight: 6, verticalAlign: 'middle'}} />Statut:</b> {status}</p>
        </motion.div>

        {/* ✅ Boutons avec Material UI */}
        <div className="buttons-container">
          <Link to="/recharger_user">
            <Button variant="contained" className="custom-button recharge-btn"><FaUserPlus size={16} /><span>RECHARGER USER</span></Button>
          </Link>
          <Link to="/recharger-with-gain">
            <Button variant="contained" className="custom-button recharge-btn"><FaExchangeAlt size={16} /><span>RECHARGER AVEC GAIN</span></Button>
          </Link>
          <Link to="/withdrawal">
            <Button variant="contained" className="custom-button withdrawal-btn"><FaArrowDown size={16} /><span>RETRAIT</span></Button>
          </Link>
          <Link to="/tickets">
            <Button variant="contained" className="custom-button"><FaTicketAlt size={16} /><span>TICKETS</span></Button>
          </Link>
          <Link to="/historyWithdrawal">
            <Button variant="contained" className="custom-button"><FaHistory size={16} /><span>HISTORIQUE RETRAITS</span></Button>
          </Link>
          <Link to="/games">
            <Button variant="contained" className="custom-button game-btn"><FaPlay size={16} /><span>JOUER</span></Button>
          </Link>
          <Link to="/panier">
            <Button variant="contained" className="custom-button"><FaShoppingCart size={16} /><span>PANIER</span></Button>
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