import { Link, useNavigate } from "react-router-dom"; // Import de React Router
import { motion } from "framer-motion"; // Animation
import "../styles/CountrySelection.css"; // Import du CSS

import Benin from "../assets/benin.png";
import Ghana from "../assets/ghana.png";
import CoteIvoire from "../assets/cote-ivoire.png";
import Togo from "../assets/togo.png";
import Niger from "../assets/niger.png";

const countries = [
  { name: "Benin", flag: Benin, path: "/choicePlay", code: "benin" },
  { name: "Ghana", flag: Ghana, path: "/choicePlay", code: "ghana" },
  { name: "Côte d'Ivoire", flag: CoteIvoire, path: "/choicePlay", code: "coteIvoire" },
  { name: "Togo", flag: Togo, path: "/choicePlay", code: "togo" },
  { name: "Niger", flag: Niger, path: "/choicePlay", code: "nigeria" },
];

const CountrySelection = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  const handleCountryClick = (countryCode: string) => {
    navigate(`/choicePlay?country=${countryCode}`);
  };

  return (
    <div className="country-selection-container">
      {/* Bouton Retour */}
      <Link to="/games" className="back-button">‹ Retour</Link>
      
      <motion.h2 
        className="title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        CHOIX DU PAYS
      </motion.h2>

      <div className="countries-grid">
        {countries.map((country, index) => (
          <motion.div
            key={index}
            className="country-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleCountryClick(country.code)}
          >
            <img 
              src={`${country.flag}`} 
              alt={country.name} 
              className="country-icon" 
            />
            <button className="country-button">{country.name}</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountrySelection;