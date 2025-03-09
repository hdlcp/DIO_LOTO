import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Table, TableHead, TableRow, TableCell } from "@mui/material";
import "../styles/Dashboard.css"; // ✅ Import du CSS

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* ✅ Header avec animation */}
        <motion.div
          className="dashboard-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard 📁
        </motion.div>

        {/* ✅ Balance Section */}
        <div className="balance-section">
          <motion.div
            className="balance-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Solde principale</h3>
            <p>0 XOF</p>
          </motion.div>
          <motion.div
            className="balance-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3>Gains</h3>
            <p>0 XOF</p>
          </motion.div>
        </div>

        {/* ✅ Boutons avec Material UI */}

<div className="buttons-container">
  <Link to="/withdrawal">
    <Button variant="contained" className="custom-button">💰 RECHARGER AVEC GAIN</Button>
  </Link>
  <Link to="/withdrawal">
    <Button variant="contained" className="custom-button">🏦 RETRAIT</Button>
  </Link>
  <Link to="/tickets">
    <Button variant="contained" className="custom-button">🎟️ TICKETS</Button>
  </Link>
  <Link to="/cart">
    <Button variant="contained" className="custom-button">🛒 PANIER</Button>
  </Link>
  <Link to="/play">
    <Button variant="contained" className="custom-button">🎲 JOUER</Button>
  </Link>
</div>


        {/* ✅ Tableau Transactions */}
        <div className="transactions-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <p className="view-more">Voir plus...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
