import axios from 'axios';

const API_URL = 'https://dio-loto-api.onrender.com/api';

export interface Withdrawal {
  id: number;
  uniqueId: string;
  fullName: string;
  pays: string;
  reseauMobile: string;
  phoneNumber: string;
  montant: number;
  statut: string;
  created: string;
}

export interface WithdrawalResponse {
  message: string;
  withdrawal: Withdrawal;
  newGain: number;
}

export interface WithdrawalsResponse {
  message: string;
  withdrawals: Withdrawal[];
}

interface ApiError {
  message: string;
  status?: number;
}

// Liste des pays valides
const VALID_COUNTRIES = ["Benin", "Togo", "Ghana", "Côte d'Ivoire", "Niger"];

// Liste des réseaux valides par pays
const VALID_NETWORKS: { [key: string]: string[] } = {
  "Benin": ["Moov Benin", "MTN Benin", "Celtice Benin"],
  "Togo": ["Mixx by yas", "Flooz"],
  "Ghana": ["MTN"],
  "Cote d'Ivoire": ["MTN", "Moov", "Orange"],
  "Niger": ["MTN", "Moov", "Orange"]
};

const withdrawalService = {
  createWithdrawal: async (withdrawalData: {
    uniqueUserId: string;
    fullName: string;
    pays: string;
    reseauMobile: string;
    phoneNumber: string;
    montant: number;
  }, token: string): Promise<WithdrawalResponse> => {
    // Validation des données
    if (!withdrawalData.uniqueUserId) {
      throw new Error("L'identifiant utilisateur est requis");
    }

    if (!withdrawalData.fullName?.trim()) {
      throw new Error("Le nom complet est requis");
    }

    // Validation du pays
    const pays = withdrawalData.pays?.trim();
    if (!pays || !VALID_COUNTRIES.includes(pays)) {
      throw new Error(`Le pays doit être l'un des suivants : ${VALID_COUNTRIES.join(", ")}`);
    }

    // Validation du réseau mobile
    const reseauMobile = withdrawalData.reseauMobile?.trim();
    if (!reseauMobile || !VALID_NETWORKS[pays].includes(reseauMobile)) {
      throw new Error(`Le réseau mobile doit être l'un des suivants pour ${pays} : ${VALID_NETWORKS[pays].join(", ")}`);
    }

    // Validation du numéro de téléphone
    const phoneNumber = withdrawalData.phoneNumber?.trim();
    if (!phoneNumber) {
      throw new Error("Le numéro de téléphone est requis");
    }

    // Validation du montant
    if (!withdrawalData.montant || withdrawalData.montant < 2000 || withdrawalData.montant > 200000) {
      throw new Error("Le montant doit être compris entre 2000 et 200000 FCFA");
    }

    try {
      // Préparation des données au format attendu par l'API
      const apiData = {
        uniqueUserId: withdrawalData.uniqueUserId,
        fullName: withdrawalData.fullName.trim(),
        pays: pays,
        reseauMobile: reseauMobile,
        phoneNumber: phoneNumber,
        montant: withdrawalData.montant
      };

      // Afficher les données qui seront envoyées
      console.log('Données de retrait à envoyer:', JSON.stringify(apiData, null, 2));

      const response = await axios.post<WithdrawalResponse>(`${API_URL}/withdrawals`, apiData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: ApiError; status?: number } };
        if (apiError.response?.status === 500) {
          throw new Error("Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer plus tard.");
        }
        throw new Error(apiError.response?.data?.message || 'Erreur lors de la création du retrait');
      }
      throw new Error("Une erreur inattendue est survenue");
    }
  },

  getUserWithdrawals: async (uniqueUserId: string, token: string): Promise<WithdrawalsResponse> => {
    if (!uniqueUserId) {
      throw new Error("L'identifiant utilisateur est requis");
    }

    try {
      const response = await axios.get<WithdrawalsResponse>(`${API_URL}/withdrawals/user/${uniqueUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: ApiError; status?: number } };
        if (apiError.response?.status === 500) {
          throw new Error("Une erreur est survenue lors de la récupération de vos retraits. Veuillez réessayer plus tard.");
        }
        throw new Error(apiError.response?.data?.message || 'Erreur lors de la récupération des retraits');
      }
      throw new Error("Une erreur inattendue est survenue");
    }
  }
};

export default withdrawalService; 