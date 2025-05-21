import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, loading, isRevendeur } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const success = await register(firstName, lastName, email, password);
      if (success) {
        // Vérifier le rôle et rediriger
        if (isRevendeur()) {
          navigate('/dashbordRevendeur');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
            </div>
          )}
          <div className="input-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>

          <div className="auth-text">
            <Link to="/login" className="auth-link">
              Déjà un compte ? Connectez-vous
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;