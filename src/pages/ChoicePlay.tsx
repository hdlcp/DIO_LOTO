import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import "../styles/Games.css";

// Import des images des drapeaux
import Benin from "../assets/benin.png";
import Ghana from "../assets/ghana.png";
import Niger from "../assets/niger.png";
import CoteIvoire from "../assets/cote-ivoire.png";
import Togo from "../assets/togo.png";

// Import de l'image de loto
import lotoImage from "../assets/loto.png";

// Définition des types
interface GameItem {
  time: string;
  name: string;
}

interface CountryGame {
  name: string;
  flag: string;
  games: GameItem[];
  weekendGames?: GameItem[];
  hasDoubleChance: boolean;
}

interface CountryGamesType {
  [key: string]: CountryGame;
}

const ChoicePlay = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country") || "benin";
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Configuration des pays et leurs jeux
  const countryGames: CountryGamesType = {
    benin: {
      name: "Bénin",
      flag: Benin,
      games: [
        { time: "11:00", name: "benin11" },
        { time: "14:00", name: "benin14" },
        { time: "18:00", name: "benin18" },
        { time: "21:00", name: "benin21" },
        { time: "00:00", name: "benin00" }
      ],
      hasDoubleChance: false
    },
    ghana: {
      name: "Ghana",
      flag: Ghana,
      games: [
        { time: "20:00", name: "ghana20" }
      ],
      hasDoubleChance: false
    },
    coteIvoire: {
      name: "Côte d'Ivoire",
      flag: CoteIvoire,
      games: [
        { time: "07:00", name: "coteivoire7" },
        { time: "10:00", name: "coteivoire10" },
        { time: "13:00", name: "coteivoire13" },
        { time: "16:00", name: "coteivoire16" },
        { time: "21:00", name: "coteivoire21" },
        { time: "23:00", name: "coteivoire23" }
      ],
      weekendGames: [
        { time: "01:00", name: "coteivoire1" },
        { time: "03:00", name: "coteivoire3" }
      ],
      hasDoubleChance: true
    },
    nigeria: { 
      name: "Niger",
      flag: Niger,
      games: [
        { time: "15:00", name: "niger15" }
      ],
      hasDoubleChance: false
    },
    togo: {
      name: "Togo",
      flag: Togo,
      games: [
        { time: "08:00", name: "togo8" },
        { time: "13:00", name: "togo13" },
        { time: "18:00", name: "togo18" }
      ],
      hasDoubleChance: true
    }
  };

  // Vérifie si le jour actuel est un weekend
  const isWeekend = (): boolean => {
    const day = currentTime.getDay();
    return day === 0 || day === 6; // 0 est dimanche, 6 est samedi
  };

  // Fonction pour obtenir le jour actuel en français
  const getCurrentDay = (): string => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return days[currentTime.getDay()];
  };

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  // Obtenir les jeux du pays sélectionné
  const getGamesForCountry = (): GameItem[] => {
    const countryData = countryGames[country];
    if (!countryData) return [];

    let games = [...countryData.games];
    
    // Ajouter les jeux du weekend pour la Côte d'Ivoire si c'est le weekend
    if (country === "coteIvoire" && isWeekend() && countryData.weekendGames) {
      games = [...games, ...countryData.weekendGames];
    }
    
    // Trier les jeux par heure
    games.sort((a, b) => {
      const timeA = a.time.split(":").map(Number);
      const timeB = b.time.split(":").map(Number);
      
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      }
      return timeA[1] - timeB[1];
    });
    
    return games;
  };

  const games = getGamesForCountry();
  const selectedCountryData = countryGames[country] || {
    name: "Pays inconnu",
    flag: "",
    games: [],
    hasDoubleChance: false
  };

  return (
    <div className="games-container">
      {/* Bouton retour avec animation */}
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
      
      {/* Affichage de la date actuelle */}
      <div className="current-date" style={{ 
        color: "white", 
        marginBottom: "15px", 
        zIndex: 2,
        textAlign: "center",
        width: "100%"
      }}>
        <p>{getCurrentDay()} - {currentTime.toLocaleDateString()}</p>
      </div>
      
      {/* Section principale - optimisée pour mobile */}
      <div className="mobile-friendly-container" style={{ 
        width: "100%", 
        maxWidth: "600px", 
        margin: "0 auto",
        padding: "0 10px",
        zIndex: 2
      }}>
        {/* Affichage du pays sélectionné */}
        <div 
          className="selected-country"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px"
          }}
        >
          <img 
            src={selectedCountryData.flag} 
            alt={selectedCountryData.name} 
            style={{ 
              width: "30px", 
              height: "30px", 
              borderRadius: "50%",
              objectFit: "cover"
            }} 
          />
          <h3 style={{ 
            color: "white", 
            margin: 0,
            fontSize: "20px" 
          }}>
            {selectedCountryData.name}
          </h3>
        </div>
        
        {/* Information Double Chance */}
        {selectedCountryData.hasDoubleChance && (
          <div className="double-chance-info" style={{ 
            color: "white", 
            backgroundColor: "rgba(0, 128, 0, 0.6)", 
            padding: "8px 12px", 
            borderRadius: "8px", 
            marginTop: "10px",
            marginBottom: "15px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "bold"
          }}>
            <p style={{ margin: 0 }}>✓ Double chance disponible</p>
          </div>
        )}
        
        {/* Titre de la section des jeux */}
        <h3 style={{ 
          color: "white", 
          textAlign: "center", 
          marginBottom: "15px",
          fontSize: "18px" 
        }}>
          {`Jeux disponibles pour ${selectedCountryData.name}`}
        </h3>
        
        {/* Affichage des jeux disponibles - optimisé pour mobile */}
        <div className="games-list" style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "15px",
          width: "100%" 
        }}>
          {games.length > 0 ? (
            games.map((game, index) => (
              <motion.div
                key={index}
                className="game-item"
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "rgba(163, 89, 160, 0.7)",
                  padding: "12px",
                  borderRadius: "10px",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)"
                }}
              >
                <img 
                  src={lotoImage} 
                  alt="Loto" 
                  style={{ 
                    width: "50px", 
                    height: "50px",
                    marginRight: "15px" 
                  }} 
                />
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: "white", 
                    margin: "0 0 5px 0",
                    fontSize: "14px" 
                  }}>
                    {game.name}
                  </p>
                  <h3 style={{ 
                    color: "white", 
                    margin: 0,
                    fontSize: "18px" 
                  }}>
                    {game.time} H
                  </h3>
                </div>
                <Link 
                  to={`/loto/bet?country=${country}&time=${game.time}&doubleChance=${selectedCountryData.hasDoubleChance}&gameName=${game.name}`}
                  style={{ 
                    textDecoration: "none",
                    marginLeft: "auto" 
                  }}
                >
                  <Button 
                    variant="contained" 
                    className="play-button"
                    style={{
                      backgroundColor: "gold",
                      color: "black",
                      fontWeight: "bold",
                      padding: "6px 16px"
                    }}
                  >
                    JOUER
                  </Button>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="no-games-message" style={{ 
              color: "white", 
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              fontSize: "15px"
            }}>
              <p style={{ margin: "0 0 10px 0" }}>Aucun jeu disponible pour ce pays.</p>
              <p style={{ margin: 0 }}>Veuillez sélectionner un autre pays.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoicePlay;