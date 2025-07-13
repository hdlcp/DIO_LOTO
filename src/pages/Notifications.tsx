import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, IconButton } from "@mui/material";
import "../styles/Notifications.css";
import { useAuth } from "../AuthContext";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../services/notificationService";
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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
      .catch(() => setError("Erreur lors du chargement des notifications"))
      .then(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [user, token]);

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

  return (
    <div className="notifications-container">
      <div className="notifications-content">
        <motion.div
          className="notifications-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Notifications
        </motion.div>
        <div style={{ margin: '20px 0', textAlign: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllAsRead}
            disabled={notifications.length === 0 || notifications.every(n => n.isRead)}
          >
            Tout marquer comme lu
          </Button>
        </div>
        <div className="notifications-list">
          {loading ? (
            <div style={{ color: 'white' }}>Chargement...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : notifications.length === 0 ? (
            <div className="no-notification">Aucune notification</div>
          ) : notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-card${notif.isRead ? ' read' : ' unread'}`}
            >
              <div className="notif-header">
                <span className="notif-title">{notif.title}</span>
                <span className="notif-date">{new Date(notif.created).toLocaleString()}</span>
              </div>
              <div className="notif-message">{notif.message}</div>
              <div className="notif-actions">
                {!notif.isRead && (
                  <Button size="small" color="success" variant="outlined" onClick={() => handleMarkAsRead(notif.id)}>
                    Marquer comme lu
                  </Button>
                )}
                <IconButton color="error" onClick={() => handleDelete(notif.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30 }}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

