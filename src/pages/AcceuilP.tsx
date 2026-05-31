import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaPlay, FaWallet, FaArrowDown } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import "../styles/AcceuilP.css";

const actions = [
  {
    icon: <FaPlay size={28} />,
    title: "Jouer",
    desc: "Choisissez un jeu et tentez votre chance",
    label: "Jouer maintenant",
    to: "/country",
    variant: "primary",
  },
  {
    icon: <FaWallet size={28} />,
    title: "Recharger",
    desc: "Rechargez votre compte via un revendeur",
    label: "Recharger",
    to: "/commerciaux",
    variant: "secondary",
  },
  {
    icon: <FaArrowDown size={28} />,
    title: "Retirer",
    desc: "Retirez vos gains sur votre mobile money",
    label: "Retirer",
    to: "/withdrawal",
    variant: "secondary",
  },
];

const AcceuilP = () => {
  const { user } = useAuth();

  return (
    <div className="accueil-page">

      {/* Bienvenue */}
      <motion.div
        className="accueil-welcome"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="accueil-welcome-title">
          Bienvenue{user?.firstName ? `, ${user.firstName}` : ""} 👋
        </h2>
        <p className="accueil-welcome-sub">Que souhaitez-vous faire aujourd'hui ?</p>
      </motion.div>

      {/* Actions */}
      <div className="accueil-actions">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            className={`accueil-card accueil-card--${action.variant}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="accueil-card-icon">{action.icon}</div>
            <div className="accueil-card-body">
              <h3 className="accueil-card-title">{action.title}</h3>
              <p className="accueil-card-desc">{action.desc}</p>
            </div>
            <Link to={action.to} className={`accueil-card-btn accueil-card-btn--${action.variant}`}>
              {action.label}
            </Link>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default AcceuilP;
