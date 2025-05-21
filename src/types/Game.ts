export interface Game {
  id?: number;
  nom: string;
  description: string;
  pays: string;
  statut: "ouvert" | "fermé";
  createdAt?: string;
  updatedAt?: string;
} 