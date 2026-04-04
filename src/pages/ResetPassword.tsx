import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "../styles/Auth.css";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const reset_token = (location.state as { reset_token?: string })?.reset_token ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setAuthError('Le mot de passe est requis');
      return;
    }

    if (password.length < 6) {
      setAuthError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!reset_token) {
      setAuthError('Session expirée. Recommencez la procédure.');
      navigate('/forgetPassword');
      return;
    }

    setLoading(true);
    setAuthError('');
    try {
      await userService.resetPassword(reset_token, password);
      navigate('/login', { state: { message: 'Mot de passe mis à jour avec succès. Connectez-vous.' } });
    } catch (error: any) {
      const msg = error.message || 'Une erreur est survenue.';
      setAuthError(msg);
      if (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('expiré')) {
        setTimeout(() => navigate('/forgetPassword'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Nouveau mot de passe</h2>
        <form onSubmit={handleSubmit}>
          {authError && (
            <div className="error-message" role="alert">
              <span>{authError}</span>
            </div>
          )}
          <p className="auth-text">Choisissez un nouveau mot de passe pour votre compte.</p>

          <div className="input-group">
            <label htmlFor="password">Nouveau mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authError ? 'error' : ''}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={authError ? 'error' : ''}
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
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

export default ResetPassword;
