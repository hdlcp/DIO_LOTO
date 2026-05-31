import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserCircle, FaWhatsapp, FaEye, FaEyeSlash, FaTimes, FaCopy, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { resellerService, Reseller } from "../services/resellerService";
import "../styles/Commerciaux.css";

const countryFlags: { [key: string]: string } = {
  "Benin": "🇧🇯",
  "Bénin": "🇧🇯",
  "Togo": "🇹🇬",
  "Ghana": "🇬🇭",
  "Côte d'Ivoire": "🇨🇮",
  "Cote d'Ivoire": "🇨🇮",
  "France": "🇫🇷",
};

const getFlag = (pays: string) =>
  countryFlags[pays] || countryFlags[Object.keys(countryFlags).find(k => pays.toLowerCase().includes(k.toLowerCase())) || ""] || "🌍";

const Commerciaux: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shownNumber, setShownNumber] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (number: string, id: number) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ""));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const fetchResellers = async () => {
      try {
        if (!token) throw new Error("Non authentifié");
        const data = await resellerService.getAllResellers(token);
        setResellers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchResellers();
  }, [token]);

  const resellersByCountry = resellers.reduce((acc, reseller) => {
    if (!acc[reseller.pays]) acc[reseller.pays] = [];
    acc[reseller.pays].push(reseller);
    return acc;
  }, {} as { [key: string]: Reseller[] });

  if (!token) {
    return (
      <div className="commerciaux-page">
        <div className="commerciaux-auth-card">
          <FaLock size={36} color="rgb(163, 89, 160)" style={{ marginBottom: 14 }} />
          <h2 className="commerciaux-auth-title">Accès réservé</h2>
          <p className="commerciaux-auth-text">Connectez-vous pour consulter nos revendeurs.</p>
          <button className="commerciaux-auth-btn" onClick={() => navigate("/login")}>
            <FaUserCircle size={15} style={{ marginRight: 7 }} />
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="commerciaux-page">
        <div className="commerciaux-loading">
          <div className="commerciaux-spinner" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commerciaux-page">
        <div className="commerciaux-auth-card">
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="commerciaux-page">

      <motion.div className="commerciaux-header"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="commerciaux-title">Nos Revendeurs</h2>
        <p className="commerciaux-subtitle">Contactez un revendeur pour recharger votre compte</p>
      </motion.div>

      <div className="commerciaux-content">
        {Object.entries(resellersByCountry).map(([country, list], index) => (
          <motion.div key={country} className="commerciaux-country-section"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}>

            <div className="commerciaux-country-title">
              <span>{getFlag(country)}</span>
              <span>{country}</span>
              <span className="commerciaux-country-count">{list.length}</span>
            </div>

            <div className="commerciaux-list">
              {list.map((reseller) => (
                <div key={reseller.id} className="reseller-row">
                  <span className="reseller-name">{reseller.pseudo}</span>

                  <div className="reseller-actions">
                    <button
                      className="reseller-wa-btn"
                      onClick={() => window.location.href = `https://wa.me/${reseller.whatsapp.replace(/\s/g, "")}`}
                    >
                      <FaWhatsapp size={15} />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      className="reseller-num-btn"
                      onClick={() => setShownNumber(shownNumber === reseller.id ? null : reseller.id)}
                      title="Voir le numéro"
                    >
                      {shownNumber === reseller.id ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>

                  {shownNumber === reseller.id && (
                    <div className="reseller-number-popup">
                      <span className="reseller-number-text">{reseller.whatsapp}</span>
                      <div className="reseller-popup-actions">
                        <button
                          className="reseller-popup-btn reseller-popup-copy"
                          onClick={() => handleCopy(reseller.whatsapp, reseller.id)}
                          title="Copier"
                        >
                          {copiedId === reseller.id ? <FaCheck size={12} /> : <FaCopy size={12} />}
                        </button>
                        <button
                          className="reseller-popup-btn reseller-popup-link"
                          onClick={() => window.location.href = `https://wa.me/${reseller.whatsapp.replace(/\s/g, "")}`}
                          title="Ouvrir WhatsApp"
                        >
                          <FaExternalLinkAlt size={11} />
                        </button>
                        <button
                          className="reseller-popup-btn reseller-popup-close"
                          onClick={() => setShownNumber(null)}
                          title="Fermer"
                        >
                          <FaTimes size={11} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Commerciaux;
