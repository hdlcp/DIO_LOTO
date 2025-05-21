import { Game } from '../types/Game';

const API_URL = 'https://dio-loto-api.onrender.com/api';

export interface GameTime {
  time: string;
  name: string;
}

export interface CountryGame {
  name: string;
  flag: string;
  games: GameTime[];
  weekendGames?: GameTime[];
  hasDoubleChance: boolean;
}

// Fonction pour formater le nom du pays correctement
const formatCountryName = (country: string): string => {
  // Mapping des codes pays vers les noms corrects pour l'API
  const countryMapping: { [key: string]: string } = {
    'benin': 'Benin',
    'ghana': 'Ghana',
    'coteIvoire': 'CoteIvoire',
    'togo': 'Togo',
    'niger': 'Niger'
  };
  
  return countryMapping[country.toLowerCase()] || country;
};

export const gameService = {
  // Récupérer tous les jeux d'un pays
  getAllGames: async (country: string): Promise<Game[]> => {
    try {
      const formattedCountry = formatCountryName(country);
      console.log(`Fetching all games for ${formattedCountry}`);
      const response = await fetch(`${API_URL}/games/all/${formattedCountry}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    const data = await response.json();
    console.log('All games response:', data);
      return data;
    } catch (error) {
      console.error('Error in getAllGames:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
      }
      throw new Error('Erreur lors de la récupération des jeux');
    }
  },

  // Récupérer les jeux disponibles d'un pays
  getAvailableGames: async (country: string): Promise<Game[]> => {
    try {
      const formattedCountry = formatCountryName(country);
      console.log(`Fetching available games for ${formattedCountry}`);
      const response = await fetch(`${API_URL}/games/available/${formattedCountry}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    const data = await response.json();
    console.log('Available games response:', data);
      // Extraire le tableau de jeux de la réponse
      return data.games;
    } catch (error) {
      console.error('Error in getAvailableGames:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
      }
      throw new Error('Erreur lors de la récupération des jeux disponibles');
    }
  },

  // Récupérer les jeux d'un pays avec leurs horaires
  getCountryGames: async (country: string): Promise<CountryGame> => {
    try {
    console.log(`Fetching country games for ${country}`);
      const availableGames = await gameService.getAvailableGames(country);
      
      // Convertir les jeux disponibles en format GameTime
      const games: GameTime[] = availableGames.map(game => {
        // Extraire l'heure du nom du jeu (ex: "benin11" -> "11:00")
        const timeMatch = game.nom.match(/\d+/);
        const time = timeMatch ? `${timeMatch[0]}:00` : "00:00";
        
        return {
          time,
          name: game.nom
        };
      });

      // Trier les jeux par heure
      games.sort((a, b) => {
        const timeA = parseInt(a.time.split(":")[0]);
        const timeB = parseInt(b.time.split(":")[0]);
        return timeA - timeB;
      });

      // Déterminer si le pays a la double chance (à adapter selon vos besoins)
      const hasDoubleChance = country === "coteIvoire" || country === "togo";

      return {
        name: country.charAt(0).toUpperCase() + country.slice(1),
        flag: country,
        games,
        hasDoubleChance
      };
    } catch (error) {
      console.error('Error in getCountryGames:', error);
      throw error;
    }
  }
}; 