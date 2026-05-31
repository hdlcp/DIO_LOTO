import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBullhorn } from "react-icons/fa";
import "../styles/Home.css";
import { gameService } from "../services/gameService";

const Home: React.FC = () => {
  const navigate = useNavigate(); // ✅ Déclare useNavigate avant de l'utiliser
  const [annonces, setAnnonces] = useState<{ id: number; titre: string; description: string; created: string; updatedAt: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setLoading(true);
        const data = await gameService.getAnnonces();
        setAnnonces(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des annonces");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnonces();
  }, []);

  return (
    <div className="home-container">
      {/* SECTION HERO */}
      <br />
      <br />
      <br />
      <br />
      <br />
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


      {/* SECTION BANDE D'ANNONCES */}
      <section className="announcements-section">
        <div className="announcements-container">
          {loading && <div>Chargement des annonces...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && annonces.length === 0 && (
            <div>Aucune annonce pour le moment.</div>
          )}
          {!loading && !error && annonces.map((annonce) => (
            <div className="announcement-item" key={annonce.id}>
              <div className="announcement-icon"><FaBullhorn size={24} color="var(--color-accent)" /></div>
              <div className="announcement-content">
                <h3>{annonce.titre}</h3>
                <p>{annonce.description}</p>
                <small style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', display: 'block', marginTop: '8px' }}>Publié le {new Date(annonce.created).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
