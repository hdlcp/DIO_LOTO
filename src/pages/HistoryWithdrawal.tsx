import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import withdrawalService, { Withdrawal } from "../services/withdrawalService";
import "../styles/Tickets.css";

const HistoryWithdrawal = () => {
  const { user, token } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      if (!user?.uniqueUserId || !token) {
        setError("Vous devez être connecté pour voir vos retraits");
        setLoading(false);
        return;
      }

      try {
        const response = await withdrawalService.getUserWithdrawals(user.uniqueUserId, token);
        setWithdrawals(response.withdrawals);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des retraits");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [user, token]);

  if (loading) {
    return (
      <div className="tickets-container">
        <Link to="/dashboard" className="back-link">‹ Retour</Link>
        <div className="loading">Chargement des retraits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-container">
        <Link to="/dashboard" className="back-link">‹ Retour</Link>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      
      <div className="tickets-header">
        <div className="tickets-info">
          <span className="ticket-number">{withdrawals.length}</span>
          <span className="ticket-text">Historique des retraits</span>
          <FaMoneyBillWave className="ticket-icon" />
        </div>
      </div>

      <div className="tickets-list">
        {withdrawals.length === 0 ? (
          <div className="no-tickets">Aucun retrait trouvé</div>
        ) : (
          withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="ticket-card">
              <div className="ticket-header">
                <span className="ticket-game">{withdrawal.pays}</span>
                <span className="ticket-date">{new Date(withdrawal.created).toLocaleDateString()}</span>
              </div>
              <div className="ticket-details">
                <div className="ticket-type">
                  <span className="label">Nom:</span>
                  <span className="value">{withdrawal.fullName}</span>
                </div>
                <div className="ticket-formula">
                  <span className="label">Réseau:</span>
                  <span className="value">{withdrawal.reseauMobile}</span>
                </div>
                <div className="ticket-numbers">
                  <span className="label">Téléphone:</span>
                  <span className="value">{withdrawal.phoneNumber}</span>
                </div>
                <div className="ticket-stake">
                  <span className="label">Montant:</span>
                  <span className="value">{withdrawal.montant} FCFA</span>
                </div>
                <div className="ticket-status">
                  <span className="label">Statut:</span>
                  <span className={`value status-${withdrawal.statut.replace(/\s+/g, '-').toLowerCase()}`}>
                    {withdrawal.statut}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryWithdrawal;
