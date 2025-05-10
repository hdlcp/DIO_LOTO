import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/Games.css";

// Import des images des drapeaux
import Benin from "../assets/benin.png";
import Ghana from "../assets/ghana.png";
import Nigeria from "../assets/nigeria.png";
import Burkina from "../assets/burkina.png";
import CoteIvoire from "../assets/cote-ivoire.png";
import Togo from "../assets/togo.png";

// Import de l'image de loto
import lotoImage from "../assets/loto.png";

// Définition des types
interface GameItem {
  time: string;
  available: boolean;
}

interface CountryGame {
  name: string;
  flag: string;
  times: string[];
  weekendTimes?: string[];
  hasDoubleChance: boolean;
}

interface CountryGamesType {
  [key: string]: CountryGame;
}

const ChoicePlay = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("benin");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [availableGames, setAvailableGames] = useState<GameItem[]>([]);
  
  // Configuration des pays et leurs jeux
  const countryGames: CountryGamesType = {
    benin: {
      name: "Bénin",
      flag: Benin,
      times: ["11:00", "14:00", "18:00", "21:00", "00:00"],
      hasDoubleChance: false
    },
    ghana: {
      name: "Ghana",
      flag: Ghana,
      times: ["20:00"],
      hasDoubleChance: false
    },
    coteIvoire: {
      name: "Côte d'Ivoire",
      flag: CoteIvoire,
      times: ["07:00", "10:00", "13:00", "16:00", "21:00", "23:00"],
      weekendTimes: ["01:00", "03:00"],
      hasDoubleChance: true
    },
    nigeria: {
      name: "Nigeria",
      flag: Nigeria,
      times: ["12:00", "17:00"],
      hasDoubleChance: false
    },
    burkina: {
      name: "Burkina Faso",
      flag: Burkina,
      times: ["14:00", "19:00"],
      hasDoubleChance: false
    },
    togo: {
      name: "Togo",
      flag: Togo,
      times: ["08:00", "13:00", "18:00"],
      hasDoubleChance: true
    }
  };

  // Vérifie si le jour actuel est un weekend
  const isWeekend = (): boolean => {
    const day = currentTime.getDay();
    return day === 0 || day === 6; // 0 est dimanche, 6 est samedi
  };


  // Fonction pour vérifier si un jeu est encore disponible
  const isGameAvailable = (gameTime: string): boolean => {
    // Conversion de gameTime en objets Date pour comparaison
    const [hours, minutes] = gameTime.split(":").map(Number);
    
    const gameDateTime = new Date(currentTime);
    gameDateTime.setHours(hours, minutes, 0, 0);
    
    // Si l'heure du jeu est déjà passée aujourd'hui, ce n'est plus disponible
    if (gameDateTime <= currentTime) {
      return false;
    }
    
    // Vérifier si on est à moins de 5 minutes du début
    const diffInMinutes = (gameDateTime.getTime() - currentTime.getTime()) / (1000 * 60);
    return diffInMinutes > 5;
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

  // Mettre à jour les jeux disponibles quand le pays sélectionné ou l'heure change
  useEffect(() => {
    if (selectedCountry in countryGames) {
      const country = countryGames[selectedCountry];
      const games: GameItem[] = [];
      
      // Ajouter les horaires standards
      country.times.forEach((time: string) => {
        if (isGameAvailable(time)) {
          games.push({
            time: time,
            available: true
          });
        }
      });
      
      // Ajouter les horaires du weekend pour la Côte d'Ivoire
      if (selectedCountry === "coteIvoire" && isWeekend() && country.weekendTimes) {
        country.weekendTimes.forEach((time: string) => {
          if (isGameAvailable(time)) {
            games.push({
              time: time,
              available: true
            });
          }
        });
      }
      
      // Trier les jeux par heure
      games.sort((a: GameItem, b: GameItem) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);
        
        if (timeA[0] !== timeB[0]) {
          return timeA[0] - timeB[0];
        }
        return timeA[1] - timeB[1];
      });
      
      setAvailableGames(games);
    }
  }, [selectedCountry, currentTime]);

  return (
    <div className="games-container">
      {/* Bouton retour avec animation */}
      <Link to="/games" className="back-link">
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
        {/* Sélection des pays - horizontalement scrollable sur mobile */}
        <div className="country-scroll" style={{ 
          display: "flex", 
          overflowX: "auto", 
          gap: "10px",
          padding: "10px 0",
          width: "100%",
          scrollbarWidth: "none" as "none", // Firefox
          msOverflowStyle: "none" as "none", // IE/Edge
        }}>
          {Object.keys(countryGames).map((countryKey: string) => (
            <motion.div
              key={countryKey}
              className="country-pill"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCountry(countryKey)}
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: "110px", // Assure que les pilules ne sont pas trop petites
                padding: "8px 12px",
                borderRadius: "20px",
                background: selectedCountry === countryKey 
                  ? "rgba(255, 215, 0, 0.8)" // Or pour sélectionné
                  : "rgba(163, 89, 160, 0.8)", // Violet pour non sélectionné
                color: selectedCountry === countryKey ? "black" : "white",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                gap: "8px", // Espace entre l'image et le texte
                flexShrink: 0, // Empêche la réduction
              }}
            >
              <img 
                src={countryGames[countryKey].flag} 
                alt={countryGames[countryKey].name} 
                style={{ 
                  width: "20px", 
                  height: "20px", 
                  borderRadius: "50%",
                  objectFit: "cover"
                }} 
              />
              {countryGames[countryKey].name}
            </motion.div>
          ))}
        </div>
        
        {/* Style pour cacher la scrollbar sur Chrome, Safari, Opera */}
        <style>
          {`
            .country-scroll::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        
        {/* Information Double Chance */}
        {selectedCountry in countryGames && countryGames[selectedCountry].hasDoubleChance && (
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
          {selectedCountry in countryGames && `Jeux disponibles pour ${countryGames[selectedCountry].name}`}
        </h3>
        
        {/* Affichage des jeux disponibles - optimisé pour mobile */}
        <div className="games-list" style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "15px",
          width: "100%" 
        }}>
          {availableGames.length > 0 ? (
            availableGames.map((game, index) => (
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
                    {getCurrentDay()}
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
                  to={`/loto/bet?country=${selectedCountry}&time=${game.time}&doubleChance=${selectedCountry in countryGames ? countryGames[selectedCountry].hasDoubleChance : false}`}
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
              <p style={{ margin: "0 0 10px 0" }}>Aucun jeu disponible pour le moment.</p>
              <p style={{ margin: 0 }}>Veuillez revenir plus tard ou choisir un autre pays.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoicePlay;