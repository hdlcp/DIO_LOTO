import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";
import { useAuth } from "../AuthContext";
import { getUserNotifications } from "../services/notificationService";
import {
  FaWallet, FaStore, FaTrophy, FaWhatsapp, FaGlobe,
  FaUserCheck, FaPlay, FaArrowDown, FaTicketAlt,
  FaHistory, FaShoppingCart, FaUserPlus, FaExchangeAlt, FaBell
} from "react-icons/fa";

const getGreeting = (): string => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)  return "Bonjour";
  if (h >= 12 && h < 18) return "Bon après-midi";
  if (h >= 18 && h < 22) return "Bonsoir";
  return "Bonne nuit";
};

const DashboardRevendeur: React.FC = () => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  if (!user || !user.isRevendeur) {
    return <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Accès refusé.</div>;
  }

  const { firstName, lastName, email, solde, gain, soldeRevendeur, whatsapp, pays, status } = user;

  useEffect(() => {
    if (user?.uniqueUserId && token) {
      getUserNotifications(user.uniqueUserId, token)
        .then(res => setNotifications((res.data as { notifications: any[] }).notifications.slice(0, 4)))
        .catch(console.error);
    }
  }, [user, token]);

  const actions = [
    { icon: <FaPlay size={18} />,         label: "Jouer",               to: "/games",              primary: true },
    { icon: <FaUserPlus size={18} />,      label: "Recharger un user",  to: "/recharger_user"      },
    { icon: <FaExchangeAlt size={18} />,   label: "Recharger avec gain",to: "/recharger-with-gain" },
    { icon: <FaArrowDown size={18} />,     label: "Retrait",            to: "/withdrawal"           },
    { icon: <FaTicketAlt size={18} />,     label: "Mes tickets",        to: "/tickets"              },
    { icon: <FaShoppingCart size={18} />,  label: "Panier",             to: "/panier"               },
    { icon: <FaHistory size={18} />,       label: "Historique retraits",to: "/historyWithdrawal"    },
    { icon: <FaBell size={18} />,          label: "Notifications",      to: "/notifications"        },
  ];

  return (
    <div className="dash-page">
      <div className="dash-content">

        {/* Bienvenue */}
        <motion.div className="dash-welcome"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="dash-welcome-name">{getGreeting()}, {firstName} {lastName}</span>
          <span className="dash-welcome-email">{email}</span>
        </motion.div>

        {/* Balances */}
        <div className="dash-balances" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <motion.div className="dash-balance-card"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            <div className="dash-balance-icon"><FaWallet size={18} /></div>
            <div className="dash-balance-info">
              <span className="dash-balance-label">Solde</span>
              <span className="dash-balance-amount">{solde?.toLocaleString() || 0} <small>XOF</small></span>
            </div>
          </motion.div>

          <motion.div className="dash-balance-card"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.06 }}>
            <div className="dash-balance-icon"><FaStore size={18} /></div>
            <div className="dash-balance-info">
              <span className="dash-balance-label">Revendeur</span>
              <span className="dash-balance-amount">{soldeRevendeur?.toLocaleString() || 0} <small>XOF</small></span>
            </div>
          </motion.div>

          <motion.div className="dash-balance-card dash-balance-card--gains"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, delay: 0.12 }}>
            <div className="dash-balance-icon dash-balance-icon--gains"><FaTrophy size={18} /></div>
            <div className="dash-balance-info">
              <span className="dash-balance-label">Gains</span>
              <span className="dash-balance-amount">{gain?.toLocaleString() || 0} <small>XOF</small></span>
            </div>
          </motion.div>
        </div>

        {/* Infos revendeur */}
        <motion.div className="dash-reseller-info"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
          <div className="dash-reseller-item">
            <FaWhatsapp size={14} color="#25D366" />
            <span>{whatsapp}</span>
          </div>
          <div className="dash-reseller-item">
            <FaGlobe size={14} color="rgb(163,89,160)" />
            <span>{pays}</span>
          </div>
          <div className="dash-reseller-item">
            <FaUserCheck size={14} color="#22c55e" />
            <span>{status}</span>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="dash-section-title">Actions rapides</div>
        <div className="dash-actions">
          {actions.map((action, i) => (
            <motion.div key={action.to}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}>
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

export default DashboardRevendeur;
