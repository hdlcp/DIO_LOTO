import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Guide from "./pages/Guide";
import Dashboard from "./pages/Dashboard";
import Commerciaux from "./pages/Commerciaux";
import Header from "./components/Header";
{/*import Footer from "./components/Footer";*/}
import Withdrawal from "./pages/Withdrawal";
import Tickets from "./pages/Tickets";
import Cart from "./pages/Cart";
import ChoicePlay from "./pages/ChoicePlay";
import Games from "./pages/Games";
import BetForm from "./pages/BetForm";
import AcceuilP from "./pages/AcceuilP";
import Profile from "./pages/Profile";
import DashboardRevendeur from "./pages/DashboardRevendeur";
import Recharger from "./pages/Recharger";
import ProtectedRoute from "./components/ProtectedRoute";
import CountrySelection from "./pages/CountrySelection";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/acceuil" element={<AcceuilP />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/results" element={<Results />} />
        <Route path="/commerciaux" element={<Commerciaux />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Routes protégées pour utilisateurs normaux */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/withdrawal" element={
          <ProtectedRoute>
            <Withdrawal />
          </ProtectedRoute>
        } />
        <Route path="/tickets" element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/choicePlay" element={
          <ProtectedRoute>
            <ChoicePlay />
          </ProtectedRoute>
        } />
        <Route path="/games" element={
          <ProtectedRoute>
            <Games />
          </ProtectedRoute>
        } />
        <Route path="/loto/bet" element={
          <ProtectedRoute>
            <BetForm />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/recharger" element={
          <ProtectedRoute>
            <Recharger />
          </ProtectedRoute>
        } />
        <Route path="/country" element={
          <ProtectedRoute>
            <CountrySelection />
          </ProtectedRoute>
        } />

        {/* Routes protégées pour revendeurs */}
        <Route path="/dashbordRevendeur" element={
          <ProtectedRoute requireRevendeur>
            <DashboardRevendeur />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
};

export default App;