import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "../styles/Commerciaux.css"; // 🔹 Import du CSS

const commerciauxData = [
  { region: "ABIDJAN", data: [{ id: 1, name: "Leo Zio", contact: "+225 07 12 34 56" }, { id: 2, name: "Mr Eddy", contact: "+225 05 98 76 54" }] },
  { region: "BOUAKE", data: [{ id: 1, name: "Mr Yao", contact: "+225 01 23 45 67" }, { id: 2, name: "Joseph Konan", contact: "+225 07 89 01 23" }, { id: 3, name: "Mr Kone", contact: "+225 05 67 89 45" }] },
  { region: "YAMOUSSOUKRO", data: [{ id: 1, name: "Mr BOUAKE", contact: "+225 07 12 45 78" }, { id: 2, name: "Mr GOHI", contact: "+225 01 98 76 54" }, { id: 3, name: "Luc Coulibaly", contact: "+225 05 43 21 09" }] },
  { region: "DALOA", data: [{ id: 1, name: "Mr DROH", contact: "+225 01 22 33 44" }, { id: 2, name: "Leo Konan", contact: "+225 07 99 88 77" }] },
  { region: "SAN PEDRO", data: [{ id: 1, name: "Mr Seraphin", contact: "+225 05 66 77 88" }, { id: 2, name: "Tony Yao", contact: "+225 01 44 55 66" }] },
];

const Commerciaux: React.FC = () => {
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

      {commerciauxData.map((region, index) => (
        <motion.div
          key={index}
          className="region-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <h3 className="region-title">{region.region}</h3>
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
                {region.data.map((com, idx) => (
                  <TableRow key={idx} className="table-row">
                    <TableCell>{com.id}</TableCell>
                    <TableCell>{com.name}</TableCell>
                    <TableCell>
                      <a
                        href={`https://wa.me/${com.contact.replace(/\s/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-link"
                      >
                        <WhatsAppIcon className="whatsapp-icon" /> {com.contact}
                      </a>
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
