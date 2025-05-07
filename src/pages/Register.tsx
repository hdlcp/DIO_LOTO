import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";


const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // On utilise la valeur retournée par register pour décider de la redirection
      const success = await register(firstName, lastName, email, password);
      
      // On redirige vers la page de connexion uniquement si l'inscription a réussi
      if (success) {
        navigate("/login");
      }
      // Si l'inscription échoue, l'utilisateur reste sur la page actuelle
      // et l'erreur sera affichée via le state "error" du contexte d'authentification
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte d'authentification
      console.error("Erreur lors de l'inscription:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Inscrivez-vous</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nom</label>
            <input 
              type="text" 
              placeholder="Votre nom" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Prénom</label>
            <input 
              type="text" 
              placeholder="Votre prénom" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

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

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>

        <p className="auth-text">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="auth-link">Connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;