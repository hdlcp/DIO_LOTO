import { Button } from "@mui/material"; // Boutons Material UI
import { motion } from "framer-motion"; // Animation Framer Motion
import "../styles/Games.css"; // Import du fichier CSS
import lotoImage from "../assets/loto.png";
import { Link } from "react-router-dom";

const ChoicePlay = () => {
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
        <h2>JOUEZ ET TENTEZ VOTRE CHANCE</h2>
      </motion.div>

      <div className="games-grid">
        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={lotoImage} alt="Loto" className="game-icon" />
          <h4>Monday</h4>
          <br></br>
          <h3>
          10:00 H
          </h3>
          <Link to="/loto/bet" className="">
            <Button variant="contained" className="play-button">
              JOUER
            </Button>
          </Link>
        </motion.div>

        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={lotoImage} alt="Loto" className="game-icon" />
          <h4>Monday</h4>
          <br></br>
          <h3>
          14:00 H
          </h3>
          <Link to="/loto/bet" className="">
            <Button variant="contained" className="play-button">
              JOUER
            </Button>
          </Link>
        </motion.div>

        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={lotoImage} alt="Loto" className="game-icon" />
          <h4>Monday</h4>
          <br></br>
          <h3>
          15:00 H
          </h3>
          <Link to="/loto/bet" className="">
            <Button variant="contained" className="play-button">
              JOUER
            </Button>
          </Link>
        </motion.div>

        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={lotoImage} alt="Loto" className="game-icon" />
          <h4>Monday</h4>
          <br></br>
          <h3>
          18:00 H
          </h3>
          <Link to="/loto/bet" className="">
            <Button variant="contained" className="play-button">
              JOUER
            </Button>
          </Link>
        </motion.div>

      
      </div>
    </div>
  );
};

export default ChoicePlay;
