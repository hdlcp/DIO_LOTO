import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../AuthContext";
// Icons pour afficher/masquer le mot de passe
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Appel de la fonction login du contexte d'authentification qui retourne maintenant un boolean
      const loginSuccess = await login(email, password);
      
      if (loginSuccess) {
        // Connexion réussie, rediriger vers la page sauvegardée ou dashboard par défaut
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        sessionStorage.removeItem('redirectAfterLogin'); // Nettoyer après utilisation
        navigate(redirectPath);
      } else {
        // La connexion a échoué, pas de redirection
        console.log("Échec de connexion, pas de redirection");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      // Ne pas rediriger
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Connexion</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Votre email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ flex: "1" }}
              />
              <div 
                onClick={togglePasswordVisibility} 
                style={{ 
                  position: "absolute", 
                  right: "10px", 
                  cursor: "pointer" 
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </div>
            </div>
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Mot de passe oublié ?
          </Link>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Connexion"}
          </button>
        </form>

        <p className="auth-text">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="auth-link">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;