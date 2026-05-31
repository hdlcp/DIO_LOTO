import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";
import { useAuth } from "../AuthContext";
import { getUserNotifications } from "../services/notificationService";
import {
  FaWallet, FaTrophy, FaExchangeAlt, FaArrowDown,
  FaTicketAlt, FaHistory, FaPlay, FaShoppingCart, FaBell
} from "react-icons/fa";

interface UserData {
  id: number;
  uniqueUserId: string;
  lastName: string;
  firstName: string;
  email: string;
  solde: number;
  bonus: number;
  gain: number;
  created: string;
  updatedAt: string;
}

const actions = [
  { icon: <FaPlay size={18} />,         label: "Jouer",                  to: "/games",              primary: true  },
  { icon: <FaExchangeAlt size={18} />,  label: "Recharger avec gain",    to: "/recharger-with-gain" },
  { icon: <FaArrowDown size={18} />,    label: "Retrait",                to: "/withdrawal"          },
  { icon: <FaTicketAlt size={18} />,    label: "Mes tickets",            to: "/tickets"             },
  { icon: <FaShoppingCart size={18} />, label: "Panier",                 to: "/panier"              },
  { icon: <FaHistory size={18} />,      label: "Historique retraits",    to: "/historyWithdrawal"   },
  { icon: <FaBell size={18} />,         label: "Notifications",          to: "/notifications"       },
];

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return "Bonjour";
  if (h >= 12 && h < 18) return "Bon après-midi";
  if (h >= 18 && h < 22) return "Bonsoir";
  return "Bonne nuit";
};

const Dashboard: React.FC = () => {
  const { token, logout, refreshUserData } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const fetchUserData = async () => {
      try {
        const freshUserData = await refreshUserData();
        if (freshUserData) setUserData(freshUserData);
        else throw new Error("Impossible de récupérer les données");
      } catch {
        setError("Impossible de charger vos informations");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [token, navigate, location.pathname, refreshUserData]);

  useEffect(() => {
    if (userData?.uniqueUserId && token) {
      getUserNotifications(userData.uniqueUserId, token)
        .then(res => setNotifications((res.data as { notifications: any[] }).notifications.slice(0, 4)))
        .catch(console.error);
    }
  }, [userData, token]);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (loading) return (
    <div className="dash-page">
      <div className="dash-loading"><div className="dash-spinner" /><p>Chargement...</p></div>
    </div>
  );

  if (error) return (
    <div className="dash-page">
      <div className="dash-error">
        <p>{error}</p>
        <button className="dash-logout-btn" onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );

  return (
    <div className="dash-page">
      <div className="dash-content">

        {/* Bienvenue */}
        <motion.div className="dash-welcome"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="dash-welcome-name">{getGreeting()}, {userData?.firstName} {userData?.lastName}</span>
          <span className="dash-welcome-email">{userData?.email}</span>
        </motion.div>

        {/* Balances */}
        <div className="dash-balances">
          <motion.div className="dash-balance-card"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            <div className="dash-balance-icon"><FaWallet size={20} /></div>
            <div className="dash-balance-info">
              <span className="dash-balance-label">Solde</span>
              <span className="dash-balance-amount">{userData?.solde?.toLocaleString() || 0} <small>XOF</small></span>
            </div>
          </motion.div>

          <motion.div className="dash-balance-card dash-balance-card--gains"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.08 }}>
            <div className="dash-balance-icon dash-balance-icon--gains"><FaTrophy size={20} /></div>
            <div className="dash-balance-info">
              <span className="dash-balance-label">Gains</span>
              <span className="dash-balance-amount">{userData?.gain?.toLocaleString() || 0} <small>XOF</small></span>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="dash-section-title">Actions rapides</div>
        <div className="dash-actions">
          {actions.map((action, i) => (
            <motion.div key={action.to}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}>
              <Link to={action.to} className={`dash-action-btn${action.primary ? " dash-action-btn--primary" : ""}`}>
                <span className="dash-action-icon">{action.icon}</span>
                <span className="dash-action-label">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>


        {/* Notifications */}
        <div className="dash-notifs">
          <div className="dash-section-title">Notifications récentes</div>
          {notifications.length === 0 ? (
            <div className="dash-notif-empty">Aucune notification pour le moment</div>
          ) : (
            <>
              {notifications.map((notif) => (
                <div key={notif.id}
                  className={`dash-notif-card${notif.isRead ? "" : " dash-notif-card--unread"}`}
                  onClick={() => navigate("/notifications")}>
                  <span className="dash-notif-title">{notif.title}</span>
                  <span className="dash-notif-msg">
                    {notif.message.length > 60 ? notif.message.slice(0, 60) + "…" : notif.message}
                  </span>
                  <span className="dash-notif-date">{new Date(notif.created).toLocaleDateString()}</span>
                </div>
              ))}
              <span className="dash-notif-more" onClick={() => navigate("/notifications")}>Voir toutes les notifications</span>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
