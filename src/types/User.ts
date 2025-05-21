export interface User {
  id: number;
  uniqueUserId: string;
  lastName: string;
  firstName: string;
  email: string;
  solde: number;
  gain: number;
  created: string;
  updatedAt: string;
  isRevendeur?: boolean; // Optionnel car déterminé après la vérification du rôle
  // Champs spécifiques aux revendeurs (optionnels)
  uniqueResellerId?: string;
  soldeRevendeur?: number;
  whatsapp?: string;
  pays?: string;
  status?: string;
} 