import React, { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "../styles/Results.css"; // Ajoute les styles ici
import rejouer from "../assets/loto.png";

// Exemple de données (à remplacer par une API si nécessaire)
const results = [
  { id: 1, date: "2025-03-11", time: "23:00", country: "🇧🇯", numbers: "01-21-17-33-34" },
  { id: 2, date: "2025-03-10", time: "21:00", country: "🇳🇬", numbers: "39-51-70-32-79" },
  { id: 3, date: "2025-03-10", time: "21:00", country: "🇧🇯", numbers: "02-83-72-47-90", mac: "50-57-80-38-31" },
  { id: 4, date: "2025-03-10", time: "18:00", country: "🇹🇬", numbers: "11-23-45-67-89" },
];

const Results: React.FC = () => {
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const { width, height } = useWindowSize(); // Pour s'assurer que les confettis couvrent tout l'écran

  const handleClick = (id: number) => {
    setSelectedResult(id);
  };

  return (
    <div className="results-container">
      <h2 className="results-title">🎱 Résultats</h2>

      {/* Affichage des résultats sous forme de grille */}
      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="result-card" onClick={() => handleClick(result.id)}>
            <img src={rejouer} alt="Ball" className="ball-icon" />
            <p>📅 {result.date}</p>
            <p>⏰ {result.time}</p>
            <p>{result.country}</p>
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
            </p>
            {results.find((r) => r.id === selectedResult)?.mac && (
              <p>
                <strong>Mac :</strong> {results.find((r) => r.id === selectedResult)?.mac}
              </p>
            )}
            <button onClick={() => setSelectedResult(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
