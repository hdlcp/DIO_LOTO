import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { userService } from "../services/userService";
import "../styles/profile.css"; // 🔹 Importation du CSS

const Profil: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // États pour les informations du profil
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // États pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Pré-remplir les informations au chargement
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user || !token) throw new Error("Non authentifié");

      const updatedUser = await userService.updateUser(user.id, {
        firstName,
        lastName,
        email,
      }, token);

      setSuccess("Profil mis à jour avec succès");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      if (!user || !token) throw new Error("Non authentifié");

      await userService.updatePassword(
        user.id,
        currentPassword,
        newPassword,
        token
      );
      
      setSuccess("Mot de passe mis à jour avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!user || !token) throw new Error("Non authentifié");

      await userService.deleteUser(user.id, token);
      logout();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression du compte");
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="profil-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* 🔹 Informations du profil */}
      <div className="profil-section">
        <h2>Informations du Profil</h2>
        <p>Mettez à jour vos informations personnelles et votre adresse e-mail.</p>
        <form onSubmit={handleUpdateProfile}>
          <div className="input-group">
            <label>Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? "ENREGISTREMENT..." : "ENREGISTRER"}
          </button>
        </form>
      </div>

      {/* 🔹 Mise à jour du mot de passe */}
      <div className="profil-section">
        <h2>Modifier le Mot de Passe</h2>
        <p>Utilisez un mot de passe long et sécurisé pour protéger votre compte.</p>
        <form onSubmit={handleUpdatePassword}>
          <div className="input-group">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            {loading ? "ENREGISTREMENT..." : "ENREGISTRER"}
          </button>
        </form>
      </div>

      {/* 🔹 Suppression du compte */}
      <div className="delete-section">
        <h2>Supprimer le Compte</h2>
        <p>
          Une fois votre compte supprimé, toutes vos données seront définitivement perdues.  
          Veuillez télécharger toutes les informations que vous souhaitez conserver avant de procéder.
        </p>
        <button 
          className="delete-btn"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "SUPPRESSION..." : "SUPPRIMER LE COMPTE"}
        </button>
      </div>
    </div>
  );
};

export default Profil;
