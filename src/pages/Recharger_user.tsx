import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { transactionService } from "../services/transactionService";
import "../styles/Recharge.css"; // ✅ Import du CSS

const Recharger_user: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [montant, setMontant] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!user?.uniqueResellerId || !token) {
        throw new Error("Vous devez être connecté en tant que revendeur");
      }

      const montantNum = parseInt(montant);
      if (isNaN(montantNum) || montantNum < 500 || montantNum > 500000) {
        throw new Error("Le montant doit être compris entre 500 et 500000");
      }

      const response = await transactionService.rechargeUserByReseller({
        uniqueResellerId: user.uniqueResellerId,
        email,
        montant: montantNum
      }, token);

      setSuccess(response.message);
      setEmail("");
      setMontant("");

      // Rediriger vers le dashboard revendeur après 2 secondes
      setTimeout(() => {
        navigate("/dashbordRevendeur");
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdrawal-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="withdrawal-box">
        <h2 className="withdrawal-title">RECHARGER UN UTILISATEUR</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
        <label>Email</label>
          <input 
            type="email" 
            placeholder="L'adresse mail du destinataire"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        <label>Montant</label>
          <input 
            type="number" 
            placeholder="Montant (500 - 500000)"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            min="500"
            max="500000"
          />

          <button 
            className="withdraw-button" 
            type="submit"
            disabled={loading}
          >
            {loading ? "RECHARGEMENT..." : "RECHARGER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recharger_user;
