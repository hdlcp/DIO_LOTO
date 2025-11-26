import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { gameService } from "../services/gameService";
import { Game } from "../types/Game";
import "../styles/Games.css";

// Import des images des drapeaux
import Benin from "../assets/benin.png";
import Ghana from "../assets/ghana.png";
import France from "../assets/france.png";
import CoteIvoire from "../assets/cote-ivoire.png";
import Togo from "../assets/togo.png";

// Import de l'image de loto
import lotoImage from "../assets/loto.png";

const flagMap: { [key: string]: string } = {
  benin: Benin,
  ghana: Ghana,
  france: France,
  "Côte d'Ivoire": CoteIvoire,
  togo: Togo
};

const countryNames: { [key: string]: string } = {
  benin: "Bénin",
  ghana: "Ghana",
  france: "France",
  "Côte d'Ivoire": "Côte d'Ivoire",
  togo: "Togo"
};

const ChoicePlay = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country") || "benin";
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableGames = async () => {
      setLoading(true);
      try {
        console.log('Fetching available games for country:', country);
        const games = await gameService.getAvailableGames(country);
        console.log('Received available games:', games);
        setAvailableGames(games);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError("Erreur lors de la récupération des jeux");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableGames();
  }, [country]);

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour obtenir le jour actuel en français
  const getCurrentDay = (): string => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[currentTime.getDay()];
  };

  // Fonction pour extraire l'heure du nom du jeu
  const getGameTime = (gameName: string): string => {
    const timeMatch = gameName.match(/\d+/);
    return timeMatch ? `${timeMatch[0]}:00` : "00:00";
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">Chargement des jeux en cours...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="loading-spinner"></div>
        <div className="loading-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="games-container">
      <Link to="/country" className="back-link">
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
      
      <div className="current-date">
        <p>{getCurrentDay()} - {currentTime.toLocaleDateString()}</p>
      </div>
      
      <div className="mobile-friendly-container">
        <div className="selected-country">
          <img 
            src={flagMap[country]} 
            alt={countryNames[country]} 
            className="country-flag"
          />
          <h3>{countryNames[country]}</h3>
        </div>
        
        <h3 className="games-title">
          {`Jeux disponibles pour ${countryNames[country]}`}
        </h3>
        
        <div className="games-list">
          {availableGames && availableGames.length > 0 ? (
            availableGames.map((game, index) => (
              <motion.div
                key={index}
                className="game-item"
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={lotoImage} 
                  alt="Loto" 
                  className="game-icon"
                />
                <div className="game-info">
                  <p className="game-name">{game.nom}</p>
                  <p className="game-description">{game.description}</p>
                  <h3 className="game-time">{getGameTime(game.nom)} H</h3>
                </div>
                <Link 
                  to={`/loto/bet?country=${country}&time=${getGameTime(game.nom)}&gameName=${game.nom}`}
                  className="play-link"
                >
                  <Button 
                    variant="contained" 
                    className="play-button"
                  >
                    JOUER
                  </Button>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="no-games-message">
              <p>Aucun jeu disponible pour le moment.</p>
              <p>Veuillez réessayer plus tard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoicePlay;