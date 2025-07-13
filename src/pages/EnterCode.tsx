import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Auth.css";
// Icons pour afficher/masquer le mot de passe
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const EnterCode: React.FC = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!code.trim()) {
      setAuthError('Le code est requis');
      return;
    }

    if (!password.trim()) {
      setAuthError('Le mot de passe est requis');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Rediriger vers la page de connexion
      navigate('/login');
    } catch (error) {
      setAuthError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Réinitialisation de mot de passe</h2>
        <form onSubmit={handleSubmit}>
          {authError && (
            <div className="error-message" role="alert">
              <span>{authError}</span>
            </div>
          )}
          <p className="auth-text">Entrez le code reçu par email pour réinitialiser votre mot de passe</p>
          <div className="input-group">
            <label htmlFor="code">Code</label>
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={authError ? 'error' : ''}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Nouveau mot de passe</label>
            <div style={{ position: "relative" }}>
            <input
              id="password"
              name="password"
                type={showPassword ? "text" : "password"}
              required
              placeholder="Nouveau mot de passe"
              value={password}
                onChange={(e) => setPassword(e.target.value)}
              className={authError ? 'error' : ''}
            />
              <div 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: "absolute", 
                  right: "10px", 
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "white"
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div style={{ position: "relative" }}>
            <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              className={authError ? 'error' : ''}
            />
              <div 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={{ 
                  position: "absolute", 
                  right: "10px", 
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "white"
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
            {loading ? 'Validation en cours...' : 'Valider'}
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

export default EnterCode;