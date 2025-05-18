import { Button } from "@mui/material"; // Boutons Material UI
import { motion } from "framer-motion"; // Animation Framer Motion
import "../styles/Games.css"; // Import du fichier CSS
import lotoImage from "../assets/loto.png";
import { Link } from "react-router-dom";

const Games = () => {
  return (
    <div className="games-container">
      {/* Bouton retour avec animation */}
        <Link to="/dashboard" className="back-link">
          ‹ Retour
        </Link>
     

      <motion.div 
        className="games-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>NOS JEUX</h2>
        <p>Pariez et gagnez jusqu'à <b>99% de Bonus</b> avec <b>DIO LOTO</b> !</p>
      </motion.div>

      <div className="games-grid">
        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={lotoImage} alt="Loto" className="game-icon" />
          <h3>LOTO</h3>
          <p>Le jeu de Boule est un jeu de société où l'objectif est de remplir sa grille de nombres en premier.</p>
          <Link to="/country" className="">
            <Button variant="contained" className="play-button">
              JOUER
            </Button>
          </Link>
        </motion.div>

        {/* Carte Casino 
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src="casino.png" alt="Casino" className="game-icon" />
          <h3>CASINO</h3>
          <p>Les jeux de CASINO sont une source infinie de divertissement, offrant une variété de possibilités.</p>
          <Button variant="contained" className="play-button">
            JOUER
          </Button>
        </motion.div>
        */}
      </div>
    </div>
  );
};

export default Games;
