import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { transactionService } from "../services/transactionService";
import "../styles/Recharge.css"; // ✅ Import du CSS

const RechargerWithGain: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
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
      if (!user?.uniqueUserId || !token) {
        throw new Error("Vous devez être connecté");
      }

      const montantNum = parseInt(montant);
      if (isNaN(montantNum) || montantNum <= 0) {
        throw new Error("Le montant doit être un nombre positif");
      }

      if (montantNum > user.gain) {
        throw new Error("Le montant ne peut pas être supérieur à vos gains");
      }

      const response = await transactionService.rechargeUserWithGains({
        uniqueUserId: user.uniqueUserId,
        montant: montantNum
      }, token);

      setSuccess(response.message);
      setMontant("");

      // Rediriger vers le bon dashboard après 2 secondes
      setTimeout(() => {
        // Si c'est un revendeur, rediriger vers le dashboard revendeur
        if (user.isRevendeur) {
          navigate("/dashbordRevendeur");
        } else {
          // Sinon, rediriger vers le dashboard normal
          navigate("/dashboard");
        }
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
        <h2 className="withdrawal-title">RECHARGER AVEC MES GAINS</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
        <label>Montant</label>
          <input
            type="number"
            placeholder="Montant à recharger"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            min="1"
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

export default RechargerWithGain;
