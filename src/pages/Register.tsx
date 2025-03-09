import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate(); 

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
            <label>Prénom</label>
            <input type="text" placeholder="Votre prénom" />
          </div>

          <div className="input-group">
            <label>Devise</label>
            <select>
              <option>Euro (€)</option>
              <option>Dollars ($)</option>
              <option>Franc CFA (FCFA)</option>
            </select>
          </div>

          <button className="auth-button" onClick={() => navigate("/login")}>Suivant</button>
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
