import React from "react";
import { Link } from "react-router-dom";
import "../styles/Withdrawal.css"; // ✅ Import du CSS

const Recharger: React.FC = () => {
  return (
    <div className="withdrawal-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="withdrawal-box">
        <h2 className="withdrawal-title">RECHARGER</h2>


        <label>Pays</label>
        <select>
          <option>Pays</option>
          <option>Côte d'Ivoire</option>
          <option>Sénégal</option>
        </select>

        <label>Email</label>
        <input type="email" placeholder="L'addresse mail du destinataire" />

        <label>Montant</label>
        <input type="number" placeholder="Montant (5000 - 500000)" />

        <button className="withdraw-button">RECHARGER</button>

        
      </div>
    </div>
  );
};

export default Recharger;
