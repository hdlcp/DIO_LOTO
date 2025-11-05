import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from './types/User';
import { userService } from './services/userService';

// Interface utilisateur basée sur la réponse réelle de l'API
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>; // Ajout du paramètre rememberMe
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>; // Retourne true si register réussi
  logout: () => void;
  getUserInfo: (userId: string | number) => Promise<User>;
  refreshUserData: () => Promise<User | null>; // Nouvelle fonction pour rafraîchir les données utilisateur
  isAuthenticated: () => boolean; // Nouvelle fonction qui vérifie si l'utilisateur est authentifié
  isRevendeur: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // On lit d'abord dans sessionStorage, puis dans localStorage
  const getInitialToken = () => sessionStorage.getItem('token') || localStorage.getItem('token');
  // On ne stocke plus les données utilisateur, seulement le token
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getInitialToken());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifie si un token existe au chargement et récupère les données utilisateur
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = sessionStorage.getItem('token') || localStorage.getItem('token');

      if (storedToken) {
        setToken(storedToken);

        // Pour les anciens utilisateurs, essayer de récupérer depuis localStorage d'abord
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('Données utilisateur chargées depuis localStorage');
            return; // On arrête ici si on a les données
          } catch (parseError) {
            console.warn('Erreur parsing localStorage:', parseError);
          }
        }

        // Pour les nouveaux utilisateurs ou si localStorage vide, récupérer depuis API
        try {
          const freshData = await refreshUserData();
          if (!freshData) {
            console.warn('Impossible de récupérer les données utilisateur');
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        }
      }
    };

    checkToken();
  }, []);

  // Nouvelle fonction pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = (): boolean => {
    return !!(user && token);
  };

  const isRevendeur = (): boolean => {
    return !!user?.isRevendeur;
  };

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: userData, token: newToken } = await userService.login(email, password);
      
      // Vérifier le rôle de l'utilisateur et obtenir toutes les infos
      const roleCheckResponse = await userService.checkUserRole(userData.email, newToken);
      
      // Mettre à jour l'objet utilisateur stocké avec les informations complètes
      let updatedUser = { ...userData, isRevendeur: roleCheckResponse.role === 'reseller' };

      if (roleCheckResponse.role === 'reseller' && roleCheckResponse.resellerInfo) {
        // Ajouter les informations spécifiques au revendeur
        updatedUser = {
          ...updatedUser,
          ...roleCheckResponse.resellerInfo
        };
      } else if (roleCheckResponse.role === 'user' && roleCheckResponse.userInfo) {
        // Ajouter les informations spécifiques à l'utilisateur simple (si différentes)
        updatedUser = {
          ...updatedUser,
          ...roleCheckResponse.userInfo
        };
      }
      
      // Stockage selon rememberMe - seulement le token
      if (rememberMe) {
        localStorage.setItem('token', newToken);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', newToken);
        localStorage.removeItem('token');
      }
      setToken(newToken);
      setUser(updatedUser);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user: userData, token: newToken } = await userService.createUser({
        firstName,
        lastName,
        email,
        password,
      });
      
      // Vérifier le rôle de l'utilisateur et obtenir toutes les infos
      const roleCheckResponse = await userService.checkUserRole(userData.email, newToken);
      
      // Mettre à jour l'objet utilisateur stocké avec les informations complètes
      let updatedUser = { ...userData, isRevendeur: roleCheckResponse.role === 'reseller' };

      if (roleCheckResponse.role === 'reseller' && roleCheckResponse.resellerInfo) {
        // Ajouter les informations spécifiques au revendeur
        updatedUser = {
          ...updatedUser,
          ...roleCheckResponse.resellerInfo
        };
      } else if (roleCheckResponse.role === 'user' && roleCheckResponse.userInfo) {
        // Ajouter les informations spécifiques à l'utilisateur simple (si différentes)
        updatedUser = {
          ...updatedUser,
          ...roleCheckResponse.userInfo
        };
      }
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setToken(newToken);
      setUser(updatedUser);
        return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getUserInfo = async (userId: string | number): Promise<User> => {
    if (!token) throw new Error('Token manquant');
    return userService.getUserById(userId, token);
  };

  // Nouvelle fonction pour rafraîchir les données utilisateur depuis l'API
  const refreshUserData = async (): Promise<User | null> => {
    if (!token) return null;

    try {
      // Essayer de récupérer l'ID utilisateur depuis les données stockées temporairement
      let userId = null;
      const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.id || parsedUser.uniqueUserId;
      }

      // Si pas d'ID stocké, essayer de décoder le token JWT pour récupérer l'ID
      if (!userId) {
        try {
          // Décoder le token JWT pour récupérer l'ID utilisateur
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id || payload.userId || payload.uniqueUserId;
          console.log('ID récupéré depuis le token JWT:', userId);
        } catch (tokenError) {
          console.warn('Impossible de décoder le token JWT:', tokenError);
          return null;
        }
      }

      if (!userId) {
        console.warn('Aucun ID utilisateur trouvé pour rafraîchir les données');
        return null;
      }

      const freshUserData = await userService.getUserById(userId, token);

      // Mettre à jour le rôle
      const roleCheckResponse = await userService.checkUserRole(freshUserData.email, token);
      const updatedUser = {
        ...freshUserData,
        isRevendeur: roleCheckResponse.role === 'reseller'
      };

      // Mettre à jour l'état local
      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données utilisateur:', error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    getUserInfo,
    refreshUserData,
    isAuthenticated,
    isRevendeur,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;