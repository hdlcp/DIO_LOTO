import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRevendeur?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRevendeur = false 
}) => {
  const { isAuthenticated, isRevendeur, loading } = useAuth();
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

  // Si la route nécessite d'être revendeur et que l'utilisateur ne l'est pas
  if (requireRevendeur && !isRevendeur()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si l'utilisateur est revendeur et essaie d'accéder au dashboard normal
  if (isRevendeur() && location.pathname === '/dashboard') {
    return <Navigate to="/dashbordRevendeur" replace />;
  }

  // Si l'utilisateur est connecté, rendre les enfants (la page protégée)
  return <>{children}</>;
};

export default ProtectedRoute;