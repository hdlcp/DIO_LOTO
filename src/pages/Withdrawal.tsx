import React from "react";
import { Link } from "react-router-dom";
import "../styles/Withdrawal.css"; // ✅ Import du CSS

const Withdrawal: React.FC = () => {
  return (
    <div className="withdrawal-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="withdrawal-box">
        <h2 className="withdrawal-title">RETRAIT</h2>

        <label>Nom complet</label>
        <input type="text" placeholder="Nom complet" />

        <label>Réseaux</label>
        <select>
          <option>Réseaux</option>
          <option>Orange Money</option>
          <option>MTN Mobile Money</option>
        </select>

        <label>Pays</label>
        <select>
          <option>Pays</option>
          <option>Côte d'Ivoire</option>
          <option>Sénégal</option>
        </select>

        <label>Téléphone</label>
        <input type="text" placeholder="Téléphone" />

        <label>Montant</label>
        <input type="number" placeholder="Montant (5000 - 500000)" />

        <button className="withdraw-button">RETRAIT</button>

        <p className="info-text">
          Si vous avez des retraits en attente, veuillez attendre la confirmation avant d'en refaire un.
        </p>
      </div>
    </div>
  );
};

export default Withdrawal;
