import { Link, useNavigate } from "react-router-dom"; // Import de React Router
import { motion } from "framer-motion"; // Animation
import "../styles/CountrySelection.css"; // Import du CSS
import Benin from "../assets/benin.png";
import Ghana from "../assets/ghana.png";
import Nigeria from "../assets/nigeria.png";
import Burkina from "../assets/burkina.png";
import CoteIvoire from "../assets/cote-ivoire.png";
import Togo from "../assets/togo.png";


const countries = [
  { name: "Benin", flag: Benin, path: "/choicePlay" },
  { name: "Ghana", flag: Ghana, path: "/choicePlay" },
  { name: "Côte d'Ivoire", flag: CoteIvoire, path: "/choicePlay" },
  { name: "Nigeria", flag: Nigeria, path: "/choicePlay" },
  { name: "Burkina Faso", flag: Burkina, path: "/choicePlay" },
  { name: "Togo", flag: Togo, path: "/choicePlay" },
];

const CountrySelection = () => {
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

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
            onClick={() => navigate(country.path)}
          >
            <img src={`${country.flag}`} alt={country.name} className="country-icon" />
            <button className="country-button">{country.name}</button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CountrySelection;
