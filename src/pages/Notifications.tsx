import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBell, FaCheckDouble, FaCheck, FaTrash, FaArrowLeft } from "react-icons/fa";
import "../styles/Notifications.css";
import { useAuth } from "../AuthContext";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from "../services/notificationService";

const Notifications: React.FC = () => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotifications = () => {
    if (!user?.uniqueUserId || !token) return;
    setLoading(true);
    getUserNotifications(user.uniqueUserId, token)
      .then((res: any) => setNotifications(res.data.notifications))
      .catch(() => setError("Erreur lors du chargement"))
      .then(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, [user, token]);

  const handleMarkAsRead = async (id: number) => {
    if (!token) return;
    await markNotificationAsRead(id, token);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.uniqueUserId || !token) return;
    await markAllNotificationsAsRead(user.uniqueUserId, token);
    fetchNotifications();
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await deleteNotification(id, token);
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notifs-page">
      <div className="notifs-content">

        {/* Header */}
        <motion.div className="notifs-header"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="notifs-header-left">
            <button className="notifs-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft size={14} />
            </button>
            <FaBell size={20} color="rgb(163,89,160)" />
            <h2 className="notifs-title">Notifications</h2>
            {unreadCount > 0 && <span className="notifs-badge">{unreadCount}</span>}
          </div>
          {notifications.length > 0 && (
            <button
              className="notifs-mark-all-btn"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheckDouble size={13} style={{ marginRight: 6 }} />
              Tout lire
            </button>
          )}
        </motion.div>

        {/* Contenu */}
        {loading ? (
          <div className="notifs-loading">
            <div className="notifs-spinner" />
            <p>Chargement...</p>
          </div>
        ) : error ? (
          <div className="notifs-error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="notifs-empty">
            <FaBell size={36} color="rgba(255,255,255,0.2)" />
            <p>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="notifs-list">
            {notifications.map((notif, i) => (
              <motion.div key={notif.id}
                className={`notif-card${notif.isRead ? "" : " notif-card--unread"}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}>

                <div className="notif-body">
                  {!notif.isRead && <span className="notif-dot" />}
                  <div className="notif-texts">
                    <span className="notif-title">{notif.title}</span>
                    <span className="notif-message">{notif.message}</span>
                    <span className="notif-date">{new Date(notif.created).toLocaleString('fr-FR')}</span>
                  </div>
                </div>

                <div className="notif-actions">
                  {!notif.isRead && (
                    <button className="notif-read-btn" onClick={() => handleMarkAsRead(notif.id)} title="Marquer comme lu">
                      <FaCheck size={12} />
                    </button>
                  )}
                  <button className="notif-delete-btn" onClick={() => handleDelete(notif.id)} title="Supprimer">
                    <FaTrash size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
