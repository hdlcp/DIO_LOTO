import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { FaTrophy, FaCalendarAlt, FaClock, FaGlobe, FaTimes } from "react-icons/fa";
import "../styles/Results.css";
import { getResults, Result } from "../services/resultService";

const Results: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await getResults();
        setResults(response.results);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des résultats");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const parseNumbers = (numbersStr: string): string[] => {
    return numbersStr.split(/[,\s-]+/).map(n => n.trim()).filter(n => n.length > 0);
  };

  const selected = results.find(r => r.id === selectedResult);

  if (loading) {
    return (
      <div className="results-container">
        <div className="results-loading">
          <div className="results-spinner" />
          <p>Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="results-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="results-container">

      {/* Titre */}
      <div className="results-header">
        <FaTrophy size={28} color="rgb(163, 89, 160)" />
        <h2 className="results-title">Résultats des tirages</h2>
      </div>

      {/* Grille */}
      <div className="results-grid">
        {results.map((result) => (
          <div
            key={result.id}
            className="result-card"
            onClick={() => setSelectedResult(result.id)}
          >
            {/* Nom du jeu */}
            <div className="result-card-header">
              <span className="result-game-name">{result.game.nom}</span>
            </div>

            {/* Infos */}
            <div className="result-card-meta">
              <span className="result-meta-item">
                <FaGlobe size={12} style={{ marginRight: 5 }} />
                {result.game.pays}
              </span>
              <span className="result-meta-item">
                <FaCalendarAlt size={12} style={{ marginRight: 5 }} />
                {formatDate(result.createdAt)}
              </span>
              <span className="result-meta-item">
                <FaClock size={12} style={{ marginRight: 5 }} />
                {formatTime(result.createdAt)}
              </span>
            </div>

            {/* Numéros */}
            <div className="result-numbers-label">Numéros tirés</div>
            <div className="result-numbers">
              {parseNumbers(result.numbers).map((num, i) => (
                <span key={i} className="result-ball">{num}</span>
              ))}
            </div>

            {result.numbers2 && (
              <>
                <div className="result-numbers-label" style={{ color: 'rgb(65, 105, 225)' }}>Double Chance</div>
                <div className="result-numbers">
                  {parseNumbers(result.numbers2).map((num, i) => (
                    <span key={i} className="result-ball result-ball-blue">{num}</span>
                  ))}
                </div>
              </>
            )}

            <div className="result-card-footer">Voir</div>
          </div>
        ))}
      </div>

      {/* Overlay gagnants */}
      {selectedResult !== null && selected && (
        <div className="winners-overlay" onClick={() => setSelectedResult(null)}>
          <Confetti width={width} height={height} numberOfPieces={180} />
          <div className="winners-content" onClick={e => e.stopPropagation()}>

            <button className="winners-close" onClick={() => setSelectedResult(null)}>
              <FaTimes size={16} />
            </button>

            <FaTrophy size={40} color="#ffd700" style={{ marginBottom: 12 }} />
            <h3 className="winners-title">Détails du tirage</h3>

            <div className="winners-info">
              <span className="winners-info-label">Jeu</span>
              <span className="winners-info-value">{selected.game.nom}</span>
            </div>
            <div className="winners-info">
              <span className="winners-info-label">Pays</span>
              <span className="winners-info-value">{selected.game.pays}</span>
            </div>
            <div className="winners-info">
              <span className="winners-info-label">Date</span>
              <span className="winners-info-value">{formatDate(selected.createdAt)} — {formatTime(selected.createdAt)}</span>
            </div>

            <div className="winners-numbers-label">Numéros gagnants</div>
            <div className="winners-numbers">
              {parseNumbers(selected.numbers).map((num, i) => (
                <span key={i} className="result-ball result-ball-large">{num}</span>
              ))}
            </div>

            {selected.numbers2 && (
              <>
                <div className="winners-numbers-label" style={{ color: 'rgb(65, 105, 225)' }}>Double Chance</div>
                <div className="winners-numbers">
                  {parseNumbers(selected.numbers2).map((num, i) => (
                    <span key={i} className="result-ball result-ball-blue result-ball-large">{num}</span>
                  ))}
                </div>
              </>
            )}

            <button className="winners-btn" onClick={() => setSelectedResult(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
