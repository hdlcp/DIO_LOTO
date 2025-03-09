
import "../styles/Tickets.css"; // Importation du fichier CSS
import { FaTicketAlt } from "react-icons/fa"; // Icône pour tickets
import { Link } from "react-router-dom";

const Tickets = () => {
  return (
    <div className="tickets-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="tickets-card">
        <div className="tickets-info">
          <span className="ticket-number">0</span>
          <span className="ticket-text">Tickets</span>
          <FaTicketAlt className="ticket-icon" />
        </div>
      </div>
    </div>
  );
};

export default Tickets;
