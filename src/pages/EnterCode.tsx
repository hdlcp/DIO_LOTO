import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import "../styles/Auth.css";

const EnterCode: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [authError, setAuthError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? '';

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startCooldown = () => {
    setCooldown(60);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    setAuthError('');
    try {
      await userService.forgotPassword(email);
      startCooldown();
    } catch (error: any) {
      setAuthError(error.message || 'Erreur lors du renvoi du code.');
    } finally {
      setResending(false);
    }
  };

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
            {cooldown > 0 ? (
              <span style={{ color: '#666', cursor: 'not-allowed' }}>
                Renvoyer le code ({cooldown}s)
              </span>
            ) : (
              <span
                onClick={handleResend}
                className="auth-link"
                style={{ cursor: resending ? 'not-allowed' : 'pointer', opacity: resending ? 0.6 : 1 }}
              >
                {resending ? 'Envoi...' : 'Renvoyer le code'}
              </span>
            )}
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
