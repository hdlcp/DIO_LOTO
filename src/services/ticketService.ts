import { API_URL } from '../config';

export interface Ticket {
  id: number;
  numeroTicket: string;
  uniqueUserId: string;
  heureJeu: string | null;
  nomJeu: string;
  typeJeu: string;
  numerosJoues: string;
  formule: string;
  mise: number;
  gains: string;
  statut: string;
  created: string;
  updatedAt: string;
}

export interface CreateTicketData {
  uniqueUserId: string;
  heureJeu: string;
  nomJeu: string;
  typeJeu: string;
  numerosJoues: number[];
  formule: string;
  mise: number;
  gains: string;
  isCart: boolean;
}

export interface CreateTicketResponse {
  message: string;
  ticket: Ticket;
  warning?: string;
  ticketCreated?: boolean;
  newSolde?: number;
  newBonus?: number;
  bonusUsed?: number;
  soldeUsed?: number;
}

export interface GetTicketsResponse {
  message: string;
  tickets: Ticket[];
}

const ticketService = {
  // Créer un nouveau ticket
  createTicket: async (ticketData: CreateTicketData, token: string): Promise<CreateTicketResponse> => {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création du ticket');
    }

    return response.json();
  },

  // Récupérer les tickets d'un utilisateur
  getUserTickets: async (uniqueUserId: string, token: string): Promise<GetTicketsResponse> => {
    const response = await fetch(`${API_URL}/tickets/user/${uniqueUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des tickets');
    }

    return response.json();
  },

  // Récupérer les tickets du panier d'un utilisateur
  getUserCartTickets: async (uniqueUserId: string, token: string): Promise<GetTicketsResponse> => {
    const response = await fetch(`${API_URL}/tickets/user/${uniqueUserId}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération des tickets du panier');
    }
    return response.json();
  },

  // Valider un ticket du panier
  validateTicket: async (ticketId: number, token: string): Promise<{ message: string; ticket: Ticket }> => {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/validate`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la validation du ticket');
    }
    return response.json();
  },

  // Supprimer un ticket
  deleteTicket: async (ticketId: number, token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la suppression du ticket');
    }
    return response.json();
  }
};

export default ticketService; 