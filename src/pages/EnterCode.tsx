import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import "../styles/Auth.css";

const EnterCode: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setAuthError('Le code est requis');
      return;
    }

    if (!email) {
      setAuthError('Session expirée. Recommencez la procédure.');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      const reset_token = await userService.verifyOtp(email, code.trim());
      navigate('/resetPassword', { state: { reset_token } });
    } catch (error: any) {
      setAuthError(error.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Vérification du code</h2>
        <form onSubmit={handleSubmit}>
          {authError && (
            <div className="error-message" role="alert">
              <span>{authError}</span>
            </div>
          )}
          <p className="auth-text">
            Un code à 6 chiffres a été envoyé à{email ? ` ${email}` : ' votre adresse email'}. Entrez-le ci-dessous.
          </p>
          <div className="input-group">
            <label htmlFor="code">Code de vérification</label>
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className={authError ? 'error' : ''}
              style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Vérification...' : 'Vérifier le code'}
          </button>

          <div className="auth-text">
            <Link to="/forgetPassword" className="auth-link">
              Renvoyer un code
            </Link>
            {' · '}
            <Link to="/login" className="auth-link">
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterCode;
