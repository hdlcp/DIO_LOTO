import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { userService } from "../services/userService";
import "../styles/profile.css"; // 🔹 Importation du CSS
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profil: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 4000);
  };

  // États pour les informations du profil
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // États pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    try {
      if (!user || !token) throw new Error("Non authentifié");

      await userService.updateUser(user.id, {
        firstName,
        lastName,
        email,
      }, token);

      showSnackbar("Profil mis à jour avec succès", "success");
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Erreur lors de la mise à jour du profil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      showSnackbar("Les mots de passe ne correspondent pas", "error");
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

      showSnackbar("Mot de passe mis à jour avec succès", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Erreur lors de la mise à jour du mot de passe", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    setLoading(true);

    try {
      if (!user || !token) throw new Error("Non authentifié");

      await userService.deleteUser(user.id, token);
      logout();
      navigate("/");
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : "Erreur lors de la suppression du compte", "error");
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="profil-container">
      {snackbar.open && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          background: "rgba(0,0,0,0.5)",
        }}>
          <div style={{
            background: snackbar.severity === "success" ? "#00c864" : "#e74c3c",
            color: "white",
            padding: "30px 40px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            textAlign: "center",
            maxWidth: "360px",
            width: "90%",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>
              {snackbar.severity === "success" ? "✅" : "❌"}
            </div>
            {snackbar.message}
          </div>
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
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <div onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "white" }}>
                {showCurrentPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>
          </div>
          <div className="input-group">
            <label>Nouveau mot de passe</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "white" }}>
                {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>
          </div>
          <div className="input-group">
            <label>Confirmer le mot de passe</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "white" }}>
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </div>
            </div>
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
