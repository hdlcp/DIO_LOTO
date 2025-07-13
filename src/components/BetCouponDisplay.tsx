import React from 'react';
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
  ticketNumber,
  date,
  gameName,
  betType,
  numbers,
  formula,
  stake,
  gains,
  prise,
  onDelete,
  onValidate,
  onAddToCart,
}) => {
  const [isValidating, setIsValidating] = React.useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      await onValidate();
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bet-coupon-overlay">
      <div className="bet-coupon-container">
        <h3>Ticket N° {ticketNumber}</h3>
        <p>Date : {date}</p>
        <p>Jeu : {gameName}</p>
        <p>Type : {betType}</p>
        <p>Numéros : {numbers.join('-')}</p>
        <p>Formule : {formula}</p>
        <p>Mise : {stake} XOF</p>
        <p>Gains potentiels : {gains} XOF</p>
        <p>Prise : {prise} XOF</p>

        <div className="bet-coupon-buttons">
          <button 
            className="delete-button" 
            onClick={onDelete}
            disabled={isValidating}
          >
            SUPPRIMER
          </button>
          <button 
            className="validate-button" 
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? 'VALIDATION EN COURS...' : 'VALIDER MON COUPON'}
          </button>
          {onAddToCart && (
            <button 
              className="add-to-cart-button"
              onClick={onAddToCart}
              disabled={isValidating}
            >
              {isValidating ? 'AJOUT EN COURS...' : 'AJOUTER AU PANIER'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetCouponDisplay; 