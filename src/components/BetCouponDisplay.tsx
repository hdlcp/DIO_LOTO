import React from 'react';
import { FaShoppingCart, FaCheck, FaTrash, FaTrophy, FaTicketAlt } from 'react-icons/fa';
import '../styles/BetCouponDisplay.css';

interface BetCouponDisplayProps {
  ticketNumber: string;
  date: string;
  gameName: string;
  betType: string;
  numbers: number[];
  formula: string;
  stake: string;
  gains: string;
  prise: number;
  onDelete: () => void;
  onValidate: () => Promise<void>;
  onAddToCart?: () => void;
}

const BetCouponDisplay: React.FC<BetCouponDisplayProps> = ({
  ticketNumber, gameName, betType,
  numbers, formula, stake, gains, prise,
  onDelete, onValidate, onAddToCart,
}) => {
  const [isValidating, setIsValidating] = React.useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try { await onValidate(); }
    catch (e) { console.error(e); }
    finally { setIsValidating(false); }
  };

  const rows = [
    { label: 'Jeu',      value: gameName  },
    { label: 'Type',     value: betType   },
    { label: 'Formule',  value: formula   },
    { label: 'Mise',     value: `${stake} XOF` },
    { label: 'Prises',   value: prise     },
  ];

  return (
    <div className="coupon-overlay">
      <div className="coupon-modal">

        {/* Header */}
        <div className="coupon-header">
          <FaTicketAlt size={18} color="rgb(163,89,160)" />
          <span className="coupon-header-title">Votre coupon</span>
          <span className="coupon-ticket-num">#{ticketNumber !== 'En attente...' ? ticketNumber : '---'}</span>
        </div>

        {/* Infos */}
        <div className="coupon-infos">
          {rows.map(r => (
            <div key={r.label} className="coupon-info-row">
              <span className="coupon-info-label">{r.label}</span>
              <span className="coupon-info-value">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Numéros */}
        {numbers.length > 0 && (
          <div className="coupon-numbers-section">
            <span className="coupon-numbers-label">Numéros joués</span>
            <div className="coupon-numbers">
              {numbers.map((n, i) => (
                <span key={i} className="coupon-ball">{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Gains */}
        <div className="coupon-gains">
          <FaTrophy size={14} color="#ffd700" />
          <span className="coupon-gains-label">Gains potentiels</span>
          <span className="coupon-gains-value">{gains} XOF</span>
        </div>

        {/* Boutons */}
        <div className="coupon-buttons">
          <button className="coupon-btn coupon-btn--delete" onClick={onDelete} disabled={isValidating}>
            <FaTrash size={14} />
            <span>Supprimer</span>
          </button>

          {onAddToCart && (
            <button className="coupon-btn coupon-btn--cart" onClick={onAddToCart} disabled={isValidating}>
              <FaShoppingCart size={14} />
              <span>Panier</span>
            </button>
          )}

          <button className="coupon-btn coupon-btn--validate" onClick={handleValidate} disabled={isValidating}>
            <FaCheck size={14} />
            <span>{isValidating ? 'En cours...' : 'Valider'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default BetCouponDisplay;
