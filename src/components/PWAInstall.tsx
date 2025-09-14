import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstall: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Empêche le navigateur d'afficher automatiquement la popup d'installation
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Vérifier si l'app est déjà installée
    const handleAppInstalled = () => {
      console.log('PWA installée');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Afficher la popup d'installation
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Utilisateur a accepté l\'installation');
    } else {
      console.log('Utilisateur a refusé l\'installation');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#a359a0',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(163, 89, 160, 0.3)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  };

  const iconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
  };

  if (!showInstallButton) return null;

  return (
    <button 
      onClick={handleInstallClick} 
      style={buttonStyle}
      onMouseOver={(e) => {
        const target = e.currentTarget;
        target.style.transform = 'scale(1.05)';
        target.style.backgroundColor = '#8a4d87';
      }}
      onMouseOut={(e) => {
        const target = e.currentTarget;
        target.style.transform = 'scale(1)';
        target.style.backgroundColor = '#a359a0';
      }}
    >
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      Installer l'app
    </button>
  );
};

export default PWAInstall;