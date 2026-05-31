import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
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

const parseNumbers = (str: string): string[] =>
  str.split(/[,\s\-\|]+/).map(n => n.trim()).filter(n => n.length > 0 && n.length <= 3);

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const status = getStatusDisplay(ticket.statut);
  const nums = parseNumbers(ticket.numerosJoues);
  const date = new Date(ticket.created);

  return (
    <div className="tcard">
      {/* Header */}
      <div className="tcard-header">
        <span className="tcard-game">{ticket.nomJeu.toUpperCase()}</span>
        <span className={`tcard-status ${status.className}`}>{status.text}</span>
      </div>

      {/* Date + meta */}
      <div className="tcard-meta">
        <span>{date.toLocaleDateString('fr-FR')} · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{ticket.typeJeu} · {ticket.formule}</span>
      </div>

      {/* Numéros */}
      {nums.length > 0 && nums.length <= 20 && (
        <div className="tcard-numbers">
          {nums.map((n, i) => <span key={i} className="tcard-ball">{n}</span>)}
        </div>
      )}

      {/* Mise / Gains */}
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
    </div>
  );
};

const Tickets = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.uniqueUserId || !token) { setError("Connectez-vous pour voir vos tickets"); setLoading(false); return; }
      try {
        const response = await ticketService.getUserTickets(user.uniqueUserId, token);
        setTickets(response.tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally { setLoading(false); }
    };
    fetchTickets();
  }, [user, token]);

  if (loading) return (
    <div className="tickets-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="loading">Chargement des tickets...</div>
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
          <span className="ticket-text">Tickets</span>
          <FaTicketAlt className="ticket-icon" />
        </div>
      </div>

      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="no-tickets">Aucun ticket trouvé</div>
        ) : tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
      </div>
    </div>
  );
};

export default Tickets;
