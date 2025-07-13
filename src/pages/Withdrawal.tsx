import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import withdrawalService from "../services/withdrawalService";
import "../styles/Withdrawal.css"; // ✅ Import du CSS

// Définition des types
type Country = {
  name: string;
  networks: string[];
};

// Configuration des pays et leurs réseaux
const COUNTRIES: Country[] = [
  {
    name: "Benin",
    networks: ["Moov Benin", "MTN Benin", "Celtice Benin"]
  },
  {
    name: "Togo",
    networks: ["Mixx by yas", "Flooz"]
  },
  {
    name: "Ghana",
    networks: ["MTN"]
  },
  {
    name: "Côte d'Ivoire",
    networks: ["MTN", "Moov", "Orange"]
  },
  {
    name: "Niger",
    networks: ["MTN", "Moov", "Orange"]
  }
];

const Withdrawal: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Gérer le changement de pays
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedNetwork(""); // Réinitialiser le réseau sélectionné
  };

  // Gérer le changement de réseau
  const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNetwork(event.target.value);
  };

  // Obtenir les réseaux disponibles pour le pays sélectionné
  const getAvailableNetworks = (): string[] => {
    const country = COUNTRIES.find(c => c.name === selectedCountry);
    return country ? country.networks : [];
  };

  // Vérifier si le formulaire est valide
  const isFormValid = (): boolean => {
    return (
      fullName.trim() !== "" &&
      selectedCountry !== "" &&
      selectedNetwork !== "" &&
      phone.trim() !== "" &&
      amount.trim() !== "" &&
      !isNaN(Number(amount)) &&
      Number(amount) >= 2000 &&
      Number(amount) <= 200000
    );
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.uniqueUserId || !token) {
      setError("Vous devez être connecté pour effectuer un retrait");
      return;
    }

    if (!isFormValid()) {
      setError("Veuillez remplir tous les champs correctement");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await withdrawalService.createWithdrawal({
        uniqueUserId: user.uniqueUserId,
        fullName: fullName.trim(),
        pays: selectedCountry,
        reseauMobile: selectedNetwork,
        phoneNumber: phone.trim(),
        montant: Number(amount)
      }, token);

      setSuccess(response.message);
      
      // Rediriger vers l'historique des retraits après 2 secondes
      setTimeout(() => {
        navigate('/historyWithdrawal');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors du retrait");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdrawal-container">
      <Link to="/dashboard" className="back-link">‹ Retour</Link>
      <div className="withdrawal-box">
        <h2 className="withdrawal-title">RETRAIT</h2>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Pays</label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              required
              disabled={loading}
            >
              <option value="">Sélectionnez un pays</option>
              {COUNTRIES.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Réseau</label>
            <select
              value={selectedNetwork}
              onChange={handleNetworkChange}
              required
              disabled={loading || !selectedCountry || getAvailableNetworks().length === 0}
            >
              <option value="">Sélectionnez un réseau</option>
              {getAvailableNetworks().map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
            {selectedCountry && getAvailableNetworks().length === 0 && (
              <p className="error-message">Aucun réseau disponible pour ce pays</p>
            )}
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Montant</label>
            <input
              type="number"
              placeholder="Montant (2000 - 200000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="2000"
              max="200000"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="withdraw-button"
            disabled={!isFormValid() || loading}
          >
            {loading ? 'TRAITEMENT EN COURS...' : 'RETRAIT'}
          </button>

          <p className="info-text">
            Si vous avez des retraits en attente, veuillez attendre la confirmation avant d'en refaire un.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Withdrawal;
