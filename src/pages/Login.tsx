import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css"; 

const Login = () => {
  const navigate = useNavigate(); 

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Connexion</h2>

        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Votre email" />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" />
          </div>

          <Link to="/forgot-password" className="forgot-password">
            Mot de passe oublié ?
          </Link>

          
          <Link to="/dashboard">
          <button className="auth-button" >Connexion</button>
  </Link>
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
