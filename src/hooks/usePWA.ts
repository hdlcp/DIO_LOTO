import { useEffect, useState } from 'react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW enregistré avec succès: ', registration.scope);
          })
          .catch((registrationError) => {
            console.log('Échec de l\'enregistrement SW: ', registrationError);
          });
      });
    }

    // Vérifier si l'app est installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkIfInstalled();

    // Écouter les changements d'état d'installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

  }, []);

  // Fonction pour demander les permissions de notification
  const requestNotificationPermission = async (): Promise<boolean> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    isInstalled,
    requestNotificationPermission
  };
};