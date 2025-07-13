import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Auth.css";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!email.trim()) {
      setAuthError('L\'email est requis');
      return;
    }

    setLoading(true);
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Rediriger vers la page EnterCode
      navigate('/entrerCode');
    } catch (error) {
      setAuthError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Mot de passe oublié</h2>
        <form onSubmit={handleSubmit}>
          {authError && (
            <div className="error-message" role="alert">
              <span>{authError}</span>
            </div>
          )}
          <p className="auth-text">Entrez votre email pour recevoir un code de réinitialisation de mot de passe</p>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
              className={authError ? 'error' : ''}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le code'}
          </button>

          <div className="auth-text">
            <Link to="/login" className="auth-link">
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;