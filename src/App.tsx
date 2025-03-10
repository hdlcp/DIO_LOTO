import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Guide from "./pages/Guide";
import Dashboard from "./pages/Dashboard";
import Commerciaux from "./pages/Commerciaux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Withdrawal from "./pages/Withdrawal";
import Tickets from "./pages/Tickets";
import Cart from "./pages/Cart";
import ChoicePlay from "./pages/ChoicePlay";
import Games from "./pages/Games";
import BetForm from "./pages/BetForm";
import CountrySelection from "./pages/CountrySelection";
import AcceuilP from "./pages/AcceuilP";


const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acceuil" element={<AcceuilP />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/results" element={<Results />} />
        <Route path="/commerciaux" element={<Commerciaux />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/choicePlay" element={<ChoicePlay />} />
        <Route path="/games" element={<Games />} />
        <Route path="/countrySelection" element={<CountrySelection />} />
        <Route path="/loto/bet" element={<BetForm />} />

      </Routes>
      <Footer />
    </>
  );
};



export default App;
