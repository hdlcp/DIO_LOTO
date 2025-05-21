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
  const [error, setError] = useState<string | null>(null);
  const { login, loading, isRevendeur } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const success = await login(email, password);
      if (success) {
        // Vérifier le rôle et rediriger
        if (isRevendeur()) {
          navigate('/dashbordRevendeur');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Connexion à votre compte</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
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
              onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
              <div 
                onClick={togglePasswordVisibility} 
                style={{ 
                  position: "absolute", 
                  right: "10px", 
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer" 
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;