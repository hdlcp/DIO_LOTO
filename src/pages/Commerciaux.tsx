import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAuth } from "../AuthContext";
import { resellerService, Reseller } from "../services/resellerService";
import "../styles/Commerciaux.css"; // 🔹 Import du CSS

const Commerciaux: React.FC = () => {
  const { token } = useAuth();
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResellers = async () => {
      try {
        if (!token) throw new Error("Non authentifié");
        const data = await resellerService.getAllResellers(token);
        setResellers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des revendeurs");
      } finally {
        setLoading(false);
      }
    };

    fetchResellers();
  }, [token]);

  // Fonction pour gérer l'ouverture de WhatsApp
  const handleWhatsAppClick = (whatsappNumber: string) => {
    const cleanNumber = whatsappNumber.replace(/\s/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    
    // Pour les applications mobiles, on utilise window.location.href
    window.location.href = whatsappUrl;
  };

  // Grouper les revendeurs par pays
  const resellersByCountry = resellers.reduce((acc, reseller) => {
    if (!acc[reseller.pays]) {
      acc[reseller.pays] = [];
    }
    acc[reseller.pays].push(reseller);
    return acc;
  }, {} as { [key: string]: Reseller[] });

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="container">
      <motion.div
        className="title"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <p>Contactez un commercial pour recharger votre compte via WhatsApp 📲</p>
      </motion.div>

      {Object.entries(resellersByCountry).map(([country, countryResellers], index) => (
        <motion.div
          key={country}
          className="region-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <h3 className="region-title">{country}</h3>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead className="table-head">
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Revendeur</TableCell>
                  <TableCell>Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {countryResellers.map((reseller, idx) => (
                  <TableRow key={reseller.id} className="table-row">
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{`${reseller.user.firstName} ${reseller.user.lastName}`}</TableCell>
                    <TableCell>
                      <div
                        onClick={() => handleWhatsAppClick(reseller.whatsapp)}
                        className="contact-link"
                        style={{ cursor: 'pointer' }}
                      >
                        <WhatsAppIcon className="whatsapp-icon" /> {reseller.whatsapp}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      ))}
    </div>
  );
};

export default Commerciaux;