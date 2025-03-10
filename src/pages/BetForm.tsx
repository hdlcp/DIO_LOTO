import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/BetForm.css"; // Fichier CSS

const BetForm = () => {
  const [betType, setBetType] = useState("First ou One BK");
  const [number, setNumber] = useState("");
  const [formula, setFormula] = useState("");
  const [stake, setStake] = useState("");
  const [gains, setGains] = useState("");

   // Fonction pour calculer les gains avec annotation explicite
   const calculateGains = (stakeAmount: string) => {
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount < 10 || amount > 5000) return "";
    return (amount * 2).toFixed(2); // Exemple : x2 la mise
  };

  // Gestion du changement de mise avec annotation
  const handleStakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 10 && Number(value) <= 5000)) {
      setStake(value);
      setGains(calculateGains(value));
    }
  };

  return (
    <div className="bet-form-container">
      {/* Bouton Retour */}
      <Link to="/countrySelection" className="back-button">‹ Retour</Link>

      <h2 className="title">📜 Formulaire de pari</h2>

      {/* Sélection du type de pari */}
      
      <label>Type de pari</label>
      <select className="bet-select" value={betType} onChange={(e) => setBetType(e.target.value)}>
        <option value="First ou One BK">First ou One BK</option>
        <option value="boulle Chance">Boulle Chance</option>
        <option value="Second Chance">Second Chance</option>
        <option value="afk games">afk games</option>


      </select>

      <div className="bet-section">
        <p><b>{betType}</b></p>
        
        {/* Nombre entre 1 et 90 */}
        <label>Entrez un nombre entre 1 et 90</label>
        <input 
          type="number" 
          min="1" 
          max="90" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          placeholder="Ex: 24"
        />

        {/* Sélection d'une formule */}
        <label>Formule</label>
        <select value={formula} onChange={(e) => setFormula(e.target.value)}>
          <option value="">Choisissez une formule</option>
          <option value="Simple">Simple</option>
          <option value="Multiplié">Multiplié</option>
        </select>

        {/* Mise entre 10 et 5000 */}
        <label>Mise (entre 10 et 5000)</label>
        <input 
          type="number" 
          min="10" 
          max="5000" 
          value={stake} 
          onChange={handleStakeChange} 
          placeholder="Ex: 100"
        />

        {/* Gains calculés automatiquement */}
        <label>Gains</label>
        <input type="text" value={gains} readOnly />

        {/* Bouton Ajouter le coupon */}

        <Link to="/dashboard" className="">
            <button className="bet-button">AJOUTER LE COUPON AU PARI</button>
        </Link>
      </div>
    </div>
  );
};

export default BetForm;
