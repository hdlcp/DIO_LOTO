import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaCheck, FaTrash } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import ticketService, { Ticket } from "../services/ticketService";
import { formatGainsForDisplay } from "../utils/formatUtils";
import "../styles/Tickets.css";

const getStatusDisplay = (apiStatus: string) => {
  switch (apiStatus.toLowerCase()) {
    case 'validé':      return { text: 'Gagné',      className: 'status-won' };
    case 'invalidé':    return { text: 'Perdu',      className: 'status-lost' };
    case 'attribué':    return { text: 'Attribué',   className: 'status-attributed' };
    case 'en attente':  return { text: 'En attente', className: 'status-pending' };
    default:            return { text: apiStatus,    className: 'status-default' };
  }
};

const parseNumbers = (val: unknown): string[] => {
  if (val == null) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'number') return [String(val)];
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        // continue avec le fallback ci-dessous
      }
    }
    return trimmed.includes(',')
      ? trimmed.split(',').map(s => s.trim()).filter(Boolean)
      : [trimmed];
  }
  return [];
};

const Panier = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (user?.uniqueUserId && token) {
      const r = await ticketService.getUserCartTickets(user.uniqueUserId, token);
      setTickets(r.tickets);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (!user?.uniqueUserId || !token) { setError("Connectez-vous pour voir votre panier"); setLoading(false); return; }
      try { await reload(); }
      catch (err) { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user, token]);

  const handleValidate = async (id: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const r = await ticketService.validateTicket(id, token);
      if (r.ticket) await reload();
      else throw new Error(r.message);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur validation"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!token || !window.confirm("Supprimer ce ticket du panier ?")) return;
    setLoading(true);
    try {
      await ticketService.deleteTicket(id, token);
      await reload();
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur suppression"); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="tickets-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="loading">Chargement du panier...</div>
    </div>
  );

  if (error) return (
    <div className="tickets-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="tickets-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>

      <div className="tickets-header">
        <div className="tickets-info">
          <span className="ticket-number">{tickets.length}</span>
          <span className="ticket-text">Panier</span>
          <FaShoppingCart className="ticket-icon" />
        </div>
      </div>

      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="no-tickets">Votre panier est vide</div>
        ) : tickets.map(ticket => {
          const status = getStatusDisplay(ticket.statut);
          const nums = parseNumbers(ticket.numerosJoues);
          const date = new Date(ticket.created);

          return (
            <div key={ticket.id} className="tcard">
              <div className="tcard-header">
                <span className="tcard-game">{ticket.nomJeu.toUpperCase()}</span>
                <span className={`tcard-status ${status.className}`}>{status.text}</span>
              </div>

              <div className="tcard-meta">
                <span>{date.toLocaleDateString('fr-FR')} · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>{ticket.typeJeu} · {ticket.formule}</span>
              </div>

              {nums.length > 0 && nums.length <= 20 && (
                <div className="tcard-numbers">
                  {nums.map((n, i) => <span key={i} className="tcard-ball">{n}</span>)}
                </div>
              )}

              <div className="tcard-amounts">
                <div className="tcard-amount-box">
                  <span className="tcard-amount-label">Mise</span>
                  <span className="tcard-amount-value">{ticket.mise.toLocaleString()} <small>XOF</small></span>
                </div>
                <div className="tcard-divider" />
                <div className="tcard-amount-box tcard-amount-box--gains">
                  <span className="tcard-amount-label">Gains potentiels</span>
                  <span className="tcard-amount-value tcard-amount-value--gains">
                    {formatGainsForDisplay(ticket.gains)} <small>XOF</small>
                  </span>
                </div>
              </div>

              {ticket.statut !== 'validé' && (
                <div className="tcard-actions">
                  <button className="tcard-btn tcard-btn--validate" onClick={() => handleValidate(ticket.id)}>
                    <FaCheck size={13} /><span>Valider</span>
                  </button>
                  <button className="tcard-btn tcard-btn--delete" onClick={() => handleDelete(ticket.id)}>
                    <FaTrash size={13} /><span>Supprimer</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Panier;
