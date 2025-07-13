import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import ticketService, { Ticket } from "../services/ticketService";
import { formatGainsForDisplay } from "../utils/formatUtils";
import "../styles/Tickets.css";

const Panier = () => {
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
        const response = await ticketService.getUserCartTickets(user.uniqueUserId, token);
        setTickets(response.tickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, token]);

  // Nouvelle fonction pour valider un ticket
  const handleValidate = async (ticketId: number) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await ticketService.validateTicket(ticketId, token);
      // Recharger la liste après validation
      if (user?.uniqueUserId) {
        const response = await ticketService.getUserCartTickets(user.uniqueUserId, token);
        setTickets(response.tickets);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la validation du ticket");
    } finally {
      setLoading(false);
    }
  };

  // Nouvelle fonction pour supprimer un ticket
  const handleDelete = async (ticketId: number) => {
    if (!token) return;
    // Confirmation avant suppression
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce ticket du panier ?");
    if (!confirmDelete) return;
    setLoading(true);
    setError(null);
    try {
      await ticketService.deleteTicket(ticketId, token);
      // Recharger la liste après suppression
      if (user?.uniqueUserId) {
        const response = await ticketService.getUserCartTickets(user.uniqueUserId, token);
        setTickets(response.tickets);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression du ticket");
    } finally {
      setLoading(false);
    }
  };

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
          <span className="ticket-text">Panier</span>
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
                  <span className="label">Statut:</span>
                  <span className={`value status-${ticket.statut.replace(/\s+/g, '-').toLowerCase()}`}>
                    {ticket.statut}
                  </span>
                </div>
                {/* Boutons dynamiques pour tickets non validés */}
                {ticket.statut !== "validé" && (
                  <div className="ticket-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      className="validate-button"
                      onClick={() => handleValidate(ticket.id)}
                    >
                      Valider
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Panier;
