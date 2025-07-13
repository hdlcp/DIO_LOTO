import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "../styles/Results.css"; // Ajoute les styles ici
import rejouer from "../assets/loto.png";
import { getResults, Result } from "../services/resultService";

const Results: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowSize(); // Pour s'assurer que les confettis couvrent tout l'écran

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await getResults();
        setResults(response.results);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des résultats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleClick = (id: number) => {
    setSelectedResult(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Chargement des résultats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <h2 className="results-title">🎱 Résultats</h2>

      {/* Affichage des résultats sous forme de grille */}
      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="result-card" onClick={() => handleClick(result.id)}>
            <img src={rejouer} alt="Ball" className="ball-icon" />
            <p>📅 {formatDate(result.createdAt)}</p>
            <p>⏰ {formatTime(result.createdAt)}</p>
            <p>🏳️ {result.game.pays}</p>
            <p>🎮 {result.game.nom}</p>
            <p>
              <strong>Numéros :</strong> {result.numbers}
              {result.numbers2 && (
                <>
                  <br />
                  <strong>Double Chance :</strong> {result.numbers2}
                </>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Si un résultat est sélectionné, afficher les gagnants */}
      {selectedResult !== null && (
        <div className="winners-overlay">
          <Confetti width={width} height={height} />
          <div className="winners-content">
            <img src={rejouer} alt="Winner" className="winner-image" />
            <h3>Félicitations aux heureux gagnants ! 🎉</h3>
            <p>
              <strong>Numéros gagnants :</strong> {results.find((r) => r.id === selectedResult)?.numbers}
              {results.find((r) => r.id === selectedResult)?.numbers2 && (
                <>
                  <br />
                  <strong>Numéros gagnants (Double Chance) :</strong> {results.find((r) => r.id === selectedResult)?.numbers2}
                </>
              )}
            </p>
            <p>
              <strong>Jeu :</strong> {results.find((r) => r.id === selectedResult)?.game.nom}
              </p>
            <p>
              <strong>Pays :</strong> {results.find((r) => r.id === selectedResult)?.game.pays}
            </p>
            <button onClick={() => setSelectedResult(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
