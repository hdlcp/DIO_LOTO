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
import Panier from "./pages/Panier";
import HistoryWithdrawal from "./pages/HistoryWithdrawal";
import ChoicePlay from "./pages/ChoicePlay";
import Games from "./pages/Games";
import BetForm from "./pages/BetForm";
import AcceuilP from "./pages/AcceuilP";
import Profile from "./pages/Profile";
import DashboardRevendeur from "./pages/DashboardRevendeur";
import Recharger_user from "./pages/Recharger_user";
import ProtectedRoute from "./components/ProtectedRoute";
import CountrySelection from "./pages/CountrySelection";
import RechargerWithGain from "./pages/Recharger_with_gain";
import ForgetPassword from "./pages/ForgetPassword";
import EnterCode from "./pages/EnterCode";
import Notifications from "./pages/Notifications";

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
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/entrerCode" element={<EnterCode />} />

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
        <Route path="/panier" element={
          <ProtectedRoute>
            <Panier />
          </ProtectedRoute>
        } />
        <Route path="/historyWithdrawal" element={
          <ProtectedRoute>
            <HistoryWithdrawal />
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
        <Route path="/recharger_user" element={
          <ProtectedRoute>
            <Recharger_user />
          </ProtectedRoute>
        } />
        <Route path="/recharger-with-gain" element={
          <ProtectedRoute>
            <RechargerWithGain />
          </ProtectedRoute>
        } />
        <Route path="/country" element={
          <ProtectedRoute>
            <CountrySelection />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
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