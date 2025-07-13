import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Auth.css";
import { useAuth } from "../AuthContext";
// Icons pour afficher/masquer le mot de passe
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, isRevendeur, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    if (!email.trim()) {
      return;
    }

    if (!password.trim()) {
      return;
    }

    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        // Vérifier le rôle et rediriger
        if (isRevendeur()) {
          navigate('/dashbordRevendeur');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte d'authentification
      setPassword(''); // Réinitialiser le mot de passe en cas d'erreur
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Connexion à votre compte</h2>
        <form onSubmit={handleSubmit}>
          {authError && (
            <div className="error-message" role="alert">
              <span>{authError}</span>
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className={authError ? 'error' : ''}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Mot de passe"
                value={password}
                onChange={handleInputChange(setPassword)}
                className={authError ? 'error' : ''}
              />
              <div 
                onClick={togglePasswordVisibility} 
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
          <div className="input-group remember-me-group">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Se souvenir de moi</label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          <div className="auth-text">
            <Link to="/register" className="auth-link">
              Pas encore de compte ? Inscrivez-vous
            </Link>
            <br />
            <Link to="/forgetPassword" className="auth-link">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;