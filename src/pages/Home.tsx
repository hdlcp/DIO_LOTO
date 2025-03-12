import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Assure-toi que c'est bien importé
import "../styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate(); // ✅ Déclare useNavigate avant de l'utiliser

  return (
    <div className="home-container">
      {/* SECTION HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>DIO LOTO</h1>
          <p>
          <b>Une vie ,une passion, une richesse</b><br></br>
          Pariez sur DIO LOTO pour gagner vos jeux .nous faisons de vous des millionnaires. Avec DIO LOTO vous êtes toujours gagnant.
          </p>
          <div className="hero-buttons">
            <button className="btn play-btn" onClick={() => navigate("/login")}>Jouer</button>

            <button className="btn install-btn" onClick={() => navigate("/register")}>
              S'inscrire Maintenant <span>📥</span>
            </button>
          </div>
        </div>
      </section>

      <br />
      <br />
      <br />

      {/* SECTION NEWSLETTER */}
      {/* <section className="newsletter">
        <h2>SOUSCRIVEZ À NOTRE NEWSLETTER</h2>
        <p>Renseignez votre mail</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Votre email" />
          <button className="subscribe-btn">S'ABONNER</button>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
