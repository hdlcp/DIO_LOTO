import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import "../styles/Auth.css";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(90);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setAuthError('L\'email est requis');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      await userService.forgotPassword(email.trim());
      startCountdown();
      navigate('/entrerCode', { state: { email: email.trim() } });
    } catch (error: any) {
      setAuthError(error.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || countdown > 0;

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
              onChange={(e) => setEmail(e.target.value)}
              className={authError ? 'error' : ''}
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="auth-button"
          >
            {loading
              ? 'Envoi en cours...'
              : countdown > 0
              ? `Renvoyer un code (${countdown}s)`
              : 'Envoyer le code'}
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
