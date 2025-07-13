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

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      setError('Veuillez entrer votre prénom');
      return false;
    }

    if (!lastName.trim()) {
      setError('Veuillez entrer votre nom');
      return false;
    }

    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    if (!password.trim()) {
      setError('Veuillez entrer un mot de passe');
      return false;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
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
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setError(null); // Effacer l'erreur lors de la modification
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
              onChange={handleInputChange(setFirstName)}
              className={error && !firstName.trim() ? 'error' : ''}
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
              onChange={handleInputChange(setLastName)}
              className={error && !lastName.trim() ? 'error' : ''}
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
              onChange={handleInputChange(setEmail)}
              className={error && !email.trim() ? 'error' : ''}
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
                className={error && !password.trim() ? 'error' : ''}
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
                onChange={handleInputChange(setConfirmPassword)}
                className={error && password !== confirmPassword ? 'error' : ''}
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