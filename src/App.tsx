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
import Play from "./pages/Play";
import Games from "./pages/Games";
import CountrySelection from "./pages/CountrySelection";


const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/results" element={<Results />} />
        <Route path="/commerciaux" element={<Commerciaux />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/play" element={<Play />} />
        <Route path="/games" element={<Games />} />
        <Route path="/countrySelection" element={<CountrySelection />} />
      </Routes>
      <Footer />
    </>
  );
};



export default App;
