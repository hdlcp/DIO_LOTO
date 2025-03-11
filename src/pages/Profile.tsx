import React from "react";
import "../styles/profile.css"; // 🔹 Importation du CSS

const Profil: React.FC = () => {
  return (
    <div className="profil-container">
      {/* 🔹 Informations du profil */}
      <div className="profil-section">
        <h2>Informations du Profil</h2>
        <p>Mettez à jour vos informations personnelles et votre adresse e-mail.</p>
        <div className="input-group">
          <label>Nom</label>
          <input type="text" placeholder="Entrez votre nom" />
        </div>
        <div className="input-group">
          <label>Prénom</label>
          <input type="text" placeholder="Entrez votre prénom" />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" placeholder="Entrez votre adresse email" />
        </div>
        <button className="save-btn">ENREGISTRER</button>
      </div>

      {/* 🔹 Mise à jour du mot de passe */}
      <div className="profil-section">
        <h2>Modifier le Mot de Passe</h2>
        <p>Utilisez un mot de passe long et sécurisé pour protéger votre compte.</p>
        <div className="input-group">
          <label>Mot de passe actuel</label>
          <input type="password" placeholder="Entrez votre mot de passe actuel" />
        </div>
        <div className="input-group">
          <label>Nouveau mot de passe</label>
          <input type="password" placeholder="Entrez un nouveau mot de passe" />
        </div>
        <div className="input-group">
          <label>Confirmer le mot de passe</label>
          <input type="password" placeholder="Confirmez le nouveau mot de passe" />
        </div>
        <button className="save-btn">ENREGISTRER</button>
      </div>

      {/* 🔹 Suppression du compte */}
      <div className="delete-section">
        <h2>Supprimer le Compte</h2>
        <p>
          Une fois votre compte supprimé, toutes vos données seront définitivement perdues.  
          Veuillez télécharger toutes les informations que vous souhaitez conserver avant de procéder.
        </p>
        <button className="delete-btn">SUPPRIMER LE COMPTE</button>
      </div>
    </div>
  );
};

export default Profil;
