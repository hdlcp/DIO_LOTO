import { User } from '../types/User';

const API_URL = 'https://dio-loto-api-jaz1.onrender.com/api';

interface UserRoleResponse {
  message: string;
  role: 'user' | 'reseller';
  userInfo?: User;
  resellerInfo?: User;
}

export const userService = {
  // Récupérer tous les utilisateurs
  getAllUsers: async (token: string): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
    const data = await response.json();
    return data.data;
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id: string | number, token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération de l\'utilisateur');
    const data = await response.json();
    return data.data;
  },

  // Créer un nouvel utilisateur
  createUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }
    
    return {
      user: data.data,
      token: data.token,
    };
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: string | number, userData: Partial<User>, token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
    const data = await response.json();
    return data.data;
  },

  // Supprimer un utilisateur
  deleteUser: async (id: string | number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression de l\'utilisateur');
  },

  // Connexion utilisateur
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Si l'API renvoie un message d'erreur, on le propage
      if (data.message) {
        throw new Error(data.message);
      }
      // Sinon, on utilise un message d'erreur par défaut
      throw new Error('Erreur lors de la connexion');
    }
    
    return {
      user: data.data,
      token: data.token,
    };
  },

  // Vérifier le rôle de l'utilisateur
  checkUserRole: async (email: string, token: string): Promise<UserRoleResponse> => {
    const response = await fetch(`${API_URL}/auth/check-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la vérification du rôle');
    }
    
    return data as UserRoleResponse;
  },

  // Mot de passe oublié — étape 1 : envoi de l'email
  forgotPassword: async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'envoi. Réessayez.');
    }
  },

  // Mot de passe oublié — étape 2 : vérification du code OTP
  verifyOtp: async (email: string, otp: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Code invalide ou expiré.');
    }
    return data.reset_token as string;
  },

  // Mot de passe oublié — étape 3 : réinitialisation du mot de passe
  resetPassword: async (reset_token: string, new_password: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reset_token, new_password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Session expirée. Recommencez la procédure.');
    }
  },

  // Mise à jour du mot de passe
  updatePassword: async (
    userId: string | number,
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${userId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la mise à jour du mot de passe');
    }
  },
}; 