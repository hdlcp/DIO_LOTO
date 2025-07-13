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
  const getInitialUser = () => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) return JSON.parse(sessionUser);
    const localUser = localStorage.getItem('user');
    if (localUser) return JSON.parse(localUser);
    return null;
  };
  const [user, setUser] = useState<User | null>(getInitialUser());
  const [token, setToken] = useState<string | null>(getInitialToken());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifie si un token existe au chargement et vérifie le rôle
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = sessionStorage.getItem('token') || localStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Vérifier le rôle de l'utilisateur et obtenir toutes les infos
          const roleCheckResponse = await userService.checkUserRole(parsedUser.email, storedToken);
          
          // Mettre à jour l'objet utilisateur stocké avec les informations complètes
          let updatedUser = { ...parsedUser, isRevendeur: roleCheckResponse.role === 'reseller' };

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
          
          // On met à jour dans le storage où on a trouvé le token
          if (sessionStorage.getItem('token')) {
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          setToken(storedToken);
          setUser(updatedUser);
        } catch (err) {
          logout();
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
      
      // Stockage selon rememberMe
      if (rememberMe) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const getUserInfo = async (userId: string | number): Promise<User> => {
    if (!token) throw new Error('Token manquant');
    return userService.getUserById(userId, token);
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
    isAuthenticated,
    isRevendeur,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;