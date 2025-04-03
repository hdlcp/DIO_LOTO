import { Link } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Inscrivez-vous</h2>

        <form>
          <div className="input-group">
            <label>Nom</label>
            <input type="text" placeholder="Votre nom" />
          </div>

          <div className="input-group">
            <label>email</label>
            <input type="email" placeholder="Votre email" />
          </div>
            <label>mot de passe</label>
            <input type="password" placeholder="Votre mot de passe" />
          <div className="input-group">
            
          </div>
          <Link to="/login">
            <button className="auth-button" >Suivant</button>
          </Link>
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
