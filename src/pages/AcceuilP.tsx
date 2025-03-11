import { Button } from "@mui/material"; // Boutons Material UI
import { motion } from "framer-motion"; // Animation Framer Motion
import "../styles/Games.css"; // Import du fichier CSS
import retirer from "../assets/retirer.png";
import recharger from "../assets/recharger.png";
import rejouer from "../assets/rejouer.png";
import { Link } from "react-router-dom";

const AcceuilP = () => {
  return (
    <div className="games-container">
     
      <motion.div 
        className="games-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Rejoignez des milliers d'autres joueurs dans la course et démarquez-vous ! !</h2>
        <Link to="" className="click-link"><p>Confirmez votre compte ici</p></Link>
        
      </motion.div>

      <div className="games-grid">
        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={recharger} alt="Loto" className="game-icon" />
          <h3><b>Recharger votre compte</b></h3>
          <Link to="/commerciaux" className="">
            <Button variant="contained" className="play-button">
              RECHARGER
            </Button>
          </Link>
        </motion.div>

        {/* Carte Loto */}
        <motion.div 
          className="game-card"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <img src={rejouer} alt="Loto" className="game-icon" />
          <h3><b>Rejouer une partie</b></h3>
          <Link to="/games" className="">
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
          <img src={retirer} alt="Loto" className="game-icon" />
          <h3><b>Retirer mon argent</b></h3>
          <Link to="/withdrawal" className="">
            <Button variant="contained" className="play-button">
              RETIRER
            </Button>
          </Link>
        </motion.div>

      
      </div>
    </div>
  );
};

export default AcceuilP ;
