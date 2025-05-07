import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Enregistrer l'emplacement actuel pour redirection après connexion
    if (!isAuthenticated()) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Chargement...</p>
    </div>;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est connecté, rendre les enfants (la page protégée)
  return <>{children}</>;
};

export default ProtectedRoute;