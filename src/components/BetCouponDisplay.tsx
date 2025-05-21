import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BetCouponDisplay.css'; // Nous allons créer ce fichier CSS plus tard

interface BetCouponDisplayProps {
  ticketNumber: string;
  date: string;
  gameName: string;
  betType: string;
  numbers: number[];
  formula: string;
  stake: string;
  gains: string;
  prise: number; // Assumons que 'Prise' est un nombre
  onDelete: () => void;
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
}) => {
  const navigate = useNavigate();

  const handleValidate = () => {
    // Ici, vous pourriez ajouter la logique pour réellement valider le coupon auprès d'un backend si nécessaire.
    // Pour l'instant, nous allons juste rediriger.
    console.log('Coupon validé!');
    navigate('/dashboard');
  };

  return (
    <div className="bet-coupon-overlay">
      <div className="bet-coupon-container">
        <h3>Ticket N° {ticketNumber} du {date}</h3>
        <p>nom : {gameName}</p>
        <p>Type : {betType}</p>
        <p>Numéros : {numbers.join('-')}</p>
        <p>Formule : {formula}</p>
        <p>Mise : {stake} XOF</p>
        <p>Gains : {gains} XOF</p>
        <p>Prise : {prise}</p>

        <button className="delete-button" onClick={onDelete}>SUPPRIMER</button>
        <button className="validate-button" onClick={handleValidate}>VALIDER MON COUPON</button>
      </div>
    </div>
  );
};

export default BetCouponDisplay; 