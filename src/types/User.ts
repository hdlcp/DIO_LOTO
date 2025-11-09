export interface User {
  id: number;
  uniqueUserId: string;
  lastName: string;
  firstName: string;
  email: string;
  solde: number;
  bonus: number; // Nouveau champ pour le solde bonus temporaire
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