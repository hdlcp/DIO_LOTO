import { API_URL } from '../config';

interface RechargeResellerUserParams {
  uniqueResellerId: string;
  email: string;
  montant: number;
}

interface RechargeUserToUserParams {
  uniqueUserId: string;
  montant: number;
}

interface TransactionResponse {
  message: string;
  transaction?: {
    uniqueTransacId: string;
    id: number;
    sender: string;
    receiver: string;
    money: number;
    date: string;
    status: string;
    type: string;
    updatedAt: string;
    created: string;
  };
}

export const transactionService = {
  // Recharger un utilisateur par un revendeur
  rechargeUserByReseller: async (params: RechargeResellerUserParams, token: string): Promise<TransactionResponse> => {
    try {
      const response = await fetch(`${API_URL}/transactions/recharge-reseller-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la recharge de l\'utilisateur');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in rechargeUserByReseller:', error);
      throw error;
    }
  },

  // Recharger un utilisateur avec ses gains
  rechargeUserWithGains: async (params: RechargeUserToUserParams, token: string): Promise<TransactionResponse> => {
    try {
      const response = await fetch(`${API_URL}/transactions/recharge-user-to-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la recharge avec les gains');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in rechargeUserWithGains:', error);
      throw error;
    }
  }
}; 