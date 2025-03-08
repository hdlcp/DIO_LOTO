import React from "react";
import "../styles/Home.css"; // Assurez-vous d'ajouter ce fichier pour le style

const Home: React.FC = () => {
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
            <button className="btn play-btn">Jouer</button>
            <button className="btn install-btn">
              Installer Maintenant <span>📥</span>
            </button>
          </div>
        </div>
      </section>
<br></br>
<br></br>
<br></br>

      {/* SECTION NEWSLETTER 
    /  <section className="newsletter">
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
