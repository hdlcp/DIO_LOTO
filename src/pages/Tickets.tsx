import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import ticketService, { Ticket } from "../services/ticketService";
import { formatGainsForDisplay } from "../utils/formatUtils";
import "../styles/Tickets.css";

// Fonction pour mapper les statuts API vers un affichage user-friendly
const getStatusDisplay = (apiStatus: string) => {
  switch (apiStatus.toLowerCase()) {
    case 'validé':
      return { text: '🎉 GAGNÉ', className: 'status-won' };
    case 'invalidé':
      return { text: '❌ PERDU', className: 'status-lost' };
    case 'attribué':
      return { text: '💰 ATTRIBUÉ', className: 'status-attributed' };
    case 'en attente':
      return { text: '⏳ EN ATTENTE', className: 'status-pending' };
    default:
      return { text: apiStatus.toUpperCase(), className: 'status-default' };
  }
};

const Tickets = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.uniqueUserId || !token) {
        setError("Vous devez être connecté pour voir vos tickets");
        setLoading(false);
        return;
      }

      try {
        const response = await ticketService.getUserTickets(user.uniqueUserId, token);
        setTickets(response.tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, token]);

  if (loading) {
    return (
      <div className="tickets-container">
        <Link to="/dashboard" className="back-link">‹ Retour</Link>
        <div className="loading">Chargement des tickets...</div>
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
          <span className="ticket-number">{tickets.length}</span>
          <span className="ticket-text">Tickets</span>
          <FaTicketAlt className="ticket-icon" />
        </div>
      </div>

      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="no-tickets">Aucun ticket trouvé</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <span className="ticket-game">{ticket.nomJeu}</span>
                <span className="ticket-date">{new Date(ticket.created).toLocaleDateString()}</span>
              </div>
              <div className="ticket-details">
                <div className="ticket-id-row">
                  <span className="label">N° Ticket:</span>
                  <span className="value">{ticket.numeroTicket}</span>
                </div>
                <div className="ticket-type">
                  <span className="label">Type:</span>
                  <span className="value">{ticket.typeJeu}</span>
                </div>
                <div className="ticket-formula">
                  <span className="label">Formule:</span>
                  <span className="value">{ticket.formule}</span>
                </div>
                <div className="ticket-numbers">
                  <span className="label">Numéros:</span>
                  <span className="value">{ticket.numerosJoues}</span>
                </div>
                <div className="ticket-stake">
                  <span className="label">Mise:</span>
                  <span className="value">{ticket.mise} FCFA</span>
                </div>
                <div className="ticket-gain">
                  <span className="label">Gain potentiel:</span>
                  <span className="value">{formatGainsForDisplay(ticket.gains)}</span>
                </div>
                <div className="ticket-status">
                  <div className={`status-full-width ${getStatusDisplay(ticket.statut).className}`}>
                    {getStatusDisplay(ticket.statut).text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tickets;
