import axios from 'axios';

const API_URL = 'https://dio-loto-api.onrender.com/api';

export interface Game {
  id: number;
  nom: string;
  description: string;
  statut: string;
  pays: string;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: number;
  numbers: string;
  numbers2?: string;
  gameId: number;
  createdAt: string;
  game: Game;
}

export interface ResultsResponse {
  results: Result[];
}

export const getResults = async (): Promise<ResultsResponse> => {
  try {
    const response = await axios.get<ResultsResponse>(`${API_URL}/results`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    throw error;
  }
}; 