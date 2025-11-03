import { API_URL } from '../config';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  solde: number;
  gain: number;
}

export interface Reseller {
  id: number;
  uniqueResellerId: string;
  uniqueUserId: string;
  soldeRevendeur: number;
  whatsapp: string;
  pays: string;
  status: string;
  created: string;
  updatedAt: string;
  user: User;
}

interface ResellersResponse {
  message: string;
  data: Reseller[];
}

export const resellerService = {
  // Récupérer tous les revendeurs
  getAllResellers: async (token: string): Promise<Reseller[]> => {
    try {
      const response = await fetch(`${API_URL}/resellers?status=actif`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la récupération des revendeurs');
      }

      const data: ResellersResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error in getAllResellers:', error);
      throw error;
    }
  }
}; 