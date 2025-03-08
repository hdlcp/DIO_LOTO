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
            À seulement un clic de l'excitation, de l'aventure et de la chance, notre site est conçu
            pour les vrais passionnés de jeux à la recherche d'expériences inoubliables et d'opportunités de gagner gros.
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
