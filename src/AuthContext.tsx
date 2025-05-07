import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Interface utilisateur basée sur la réponse réelle de l'API
interface User {
  id: number;
  uniqueUserId: string;
  lastName: string;
  firstName: string;
  email: string;
  solde: number;
  gain: number;
  created: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>; // Retourne true si login réussi
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>; // Retourne true si register réussi
  logout: () => void;
  getUserInfo: (userId: string | number) => Promise<User>;
  isAuthenticated: () => boolean; // Nouvelle fonction qui vérifie si l'utilisateur est authentifié
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifie si un token existe au chargement
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (err) {
          // En cas d'erreur de parsing du JSON
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://dio-loto-api.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Échec de la connexion');
        return false;
      }
      
      // Stockage du token et des informations utilisateur
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      setToken(data.token);
      setUser(data.data);
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
      const response = await fetch('https://dio-loto-api.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Échec de l\'inscription');
        return false;
      }
      
      // Si l'API renvoie directement un token après inscription
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        
        setToken(data.token);
        setUser(data.data);
        return true;
      }
      return false;
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
    setToken(null);
    setUser(null);
  };

  const getUserInfo = async (userId: string | number): Promise<User> => {
    setLoading(true);
    
    try {
      if (!token) {
        throw new Error('Token manquant');
      }
      
      const response = await fetch(`https://dio-loto-api.onrender.com/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Échec de récupération des informations utilisateur');
      }
      
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des informations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
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
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;