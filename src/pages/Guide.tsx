import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import "../styles/Guide.css";

const Guide = () => {
  

// On précise que openSection est soit une `string`, soit `null`
  const [openSection, setOpenSection] = useState<string | null>(null);

// Fonction avec un paramètre `section` de type `string`
  const toggleSection = (section: string) => {
  setOpenSection(openSection === section ? null : section);
};

  return (
    <div className="guide-container">
      {/* Bouton Retour */}
      <Link to="/" className="back-button">‹ Retour</Link>

      <h2 className="guide-title"><FaBookOpen size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />Guide</h2>

      {/* Section: Informations */}
      <div className="guide-section">
        <button className="accordion" onClick={() => toggleSection("info")}>
          {openSection === "info" ? "➖" : "➕"} Informations
        </button>
        {openSection === "info" && (
          <div className="panel">
            <p>
              Pour participer aux jeux sur l'application mobile "DIO LOTO", vous avez 02 options : 
              <br />
              👉 Si vous n'avez pas de compte, cliquez sur "JOUER" puis "Connexion" pour vous inscrire.
              <br />
              👉 Si vous avez déjà un compte, connectez-vous directement.
            </p>
            <p>
              Une fois connecté, rechargez votre compte, choisissez un jeu et pariez en respectant l'heure de clôture.
            </p>
          </div>
        )}
      </div>

      {/* Section: Type de pari */}
      <div className="guide-section">
        <button className="accordion" onClick={() => toggleSection("betType")}>
          {openSection === "betType" ? "➖" : "➕"} Type de pari
        </button>
        {openSection === "betType" && (
          <div className="panel">
            <p><b>First ou One BK :</b> Parier sur un seul numéro. Si le numéro est tiré, le client gagne.</p>
            <p><b>Two Sure :</b> Parier sur deux numéros qui doivent obligatoirement sortir.</p>
            <p><b>Permutation :</b> Trouver au moins un numéro parmi une liste de plusieurs.</p>
            <p><b>Nap(3,4,5) :</b> Trouver plusieurs numéros exacts, indépendamment de l'ordre.</p>
          </div>
        )}
      </div>

      {/* Section: Formule de jeu */}
      <div className="guide-section">
        <button className="accordion" onClick={() => toggleSection("formula")}>
          {openSection === "formula" ? "➖" : "➕"} Formule de jeu
        </button>
        {openSection === "formula" && (
          <div className="panel">
            <p><b>Turbo 2 :</b> Parier sur 2 numéros dans les 22 premiers tirés.</p>
            <p><b>Turbo 3 :</b> parier sur les trois premiers numéros tirés ; soit en win ou machine.</p>
            <p><b>Turbo 4 :</b> parier sur 4 premiers numéro tirés soit en win ou en machine.</p>
            <p><b>Base :</b> Un numéro doit impérativement sortir avec un autre placé en dessous.</p>
          </div>
        )}
      </div>

      {/* Section: Important */}
      <div className="guide-section">
        <button className="accordion" onClick={() => toggleSection("important")}>
          {openSection === "important" ? "➖" : "➕"} Important
        </button>
        {openSection === "important" && (
          <div className="panel">
            <p>
              ⚠️ Il est recommandé <b>d'éviter de jouer plusieurs jeux différents</b> sur le même ticket.
              <br />
              ❌ Ne pas répéter les mêmes numéros simultanément.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;
