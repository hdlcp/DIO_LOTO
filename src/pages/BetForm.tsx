import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/BetForm.css"; // Fichier CSS
import BetCouponDisplay from '../components/BetCouponDisplay';

// Définitions des types TypeScript
type BetType = "FirstouonBK" | "NAP" | "Twosûrs" | "Permutations" | "DoubleChance" | "DoubleNumber" | "Annagrammesimple";

// Définition du type FormulaOption (manquant dans le code d'origine)
type FormulaOption = string;

// Types pour les objets de multiplicateurs
type GameMultipliers = {
  FirstouonBK: { [key: string]: number };
  NAP: { [key: string]: number };
  Twosûrs: { [key: string]: number };
  Permutations: {
    [key: string]: { [key: string]: number }
  };
  DoubleChance: { [key: string]: number };
  DoubleNumber: { [key: string]: number };
  Annagrammesimple: { [key: string]: number };
}

// Type pour le mapping des pays
type CountryNames = {
  [key: string]: string;
}

// Liste des jeux qui ont l'option Double Chance
const doubleChanceGames: string[] = [
  "togo8",
  "coteivoire7",
  "coteivoire10",
  "coteivoire13",
  "coteivoire16",
  "coteivoire21",
  "coteivoire23",
  "coteivoire1",
  "coteivoire3",
];

const BetForm = () => {
  // Récupération des paramètres d'URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country") || "benin";
  const gameTime = queryParams.get("time") || "";
  const gameName = queryParams.get("gameName") || "";

  // Vérifier si le jeu actuel a la double chance
  const currentGameHasDoubleChance = doubleChanceGames.includes(gameName);

  const [betType, setBetType] = useState<BetType>("FirstouonBK");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [formula, setFormula] = useState<FormulaOption>("Directe");
  const [stake, setStake] = useState<string>("");
  const [gains, setGains] = useState<string>("");
  const [formulaOptions, setFormulaOptions] = useState<FormulaOption[]>([]);
  const [minNumbersRequired, setMinNumbersRequired] = useState<number>(1);
  const [maxNumbersAllowed, setMaxNumbersAllowed] = useState<number>(1);
  const [currentNumber, setCurrentNumber] = useState<string>("");
  const [countryName, setCountryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCouponDisplay, setShowCouponDisplay] = useState(false);
  const [couponDetails, setCouponDetails] = useState<any>(null);

  // Mapping des codes pays vers les noms complets
  const countryNames: CountryNames = {
    benin: "Bénin",
    togo: "Togo",
    coteIvoire: "Côte d'Ivoire",
    ghana: "Ghana",
    niger: "Niger"
  };

  // Initialisation du nom du pays
  useEffect(() => {
    const initializeGame = async () => {
      setLoading(true);
      try {
        // Suppression du fetching de countryData car elle n'est pas utilisée ici
        // const countryData = await gameService.getCountryGames(country);
        
        setCountryName(countryNames[country] || country);
      } catch (error) {
        // Gérer l'erreur si l'initialisation du nom du pays échoue (peu probable mais géré)
        console.error("Erreur lors de l'initialisation du jeu:", error);
        setError("Impossible d'initialiser les informations du jeu.");
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, [country]);

  // Définition des multiplicateurs pour les différents jeux
  const gameMultipliers: GameMultipliers = {
    FirstouonBK: {
      Directe: 14,
      Position1: 60,
      Position2: 20,
      Position3: 18,
      Position4: 17,
      Position5: 16
    },
    NAP: {
      "NAP3": 3000,
      "NAP3(Perm4boules)": 750,
      "NAP3(Perm5boules)": 300,
      "NAP4": 8000,
      "NAP4(permde5boules)": 1600,
      "NAP5": 50000
    },
    Twosûrs: {
      Directe: 300,
      Turbo2: 3000,
      Turbo3: 800,
      Turbo4: 500
    },
    Permutations: {
      "Permde3boules": {
        "2boulestrouvées": 100,
        "3boulestrouvées": 300
      },
      "Permde4boules": {
        "2boulestrouvées": 50,
        "3boulestrouvées": 150,
        "4boulestrouvées": 300
      },
      "Permde5boules": {
        "2boulestrouvées": 30,
        "3boulestrouvées": 90,
        "4boulestrouvées": 180,
        "5boulestrouvées": 300
      },
      "Permde6boules": {
        "2boulestrouvées": 20,
        "3boulestrouvées": 60,
        "4boulestrouvées": 120,
        "5boulestrouvées": 200
      },
      "Permde7à20boules": {
        "2boulestrouvées": 3000,
        "3boulestrouvées": 9000,
        "4boulestrouvées": 18000,
        "5boulestrouvées": 30000
      }
    },
    DoubleChance: {
      Win: 0.6,
      Machine: 0.4
    },
    DoubleNumber: {
      "PermDoubleNumber": 20
    },
    Annagrammesimple: {
      Directe: 300
    }
  };

  // Mise à jour des options de formule en fonction du type de pari
  useEffect(() => {
    let options: FormulaOption[] = [];
    let minNums = 1;
    let maxNums = 1;

    switch (betType) {
      case "FirstouonBK":
        options = ["Directe", "Position1", "Position2", "Position3", "Position4", "Position5"];
        minNums = maxNums = 1;
        break;
      case "NAP":
        options = ["NAP3", "NAP3(Perm4boules)", "NAP3(Perm5boules)", "NAP4", "NAP4(permde5boules)", "NAP5"];
        minNums = 3;
        maxNums = 5;
        break;
      case "Twosûrs":
        options = ["Directe", "Turbo2", "Turbo3", "Turbo4"];
        minNums = maxNums = 2;
        break;
      case "Permutations":
        options = ["Permde3boules", "Permde4boules", "Permde5boules", "Permde6boules", "Permde7à20boules"];
        minNums = 3;
        maxNums = 20;
        break;
      case "DoubleChance":
        options = ["Win", "Machine"];
        minNums = maxNums = 1; // Assumer 1 numéro pour DoubleChance (à confirmer)
        break;
      case "DoubleNumber":
        options = ["PermDoubleNumber"];
        minNums = 0; // Pas de sélection de numéro individuelle, c'est un type spécial
        maxNums = 0; // Pas de sélection de numéro individuelle
        break;
      case "Annagrammesimple":
        options = ["Directe"];
        minNums = 0; // Pas de sélection de numéro individuelle
        maxNums = 0; // Pas de sélection de numéro individuelle
        break;
    }

    setFormulaOptions(options);
    setMinNumbersRequired(minNums);
    setMaxNumbersAllowed(maxNums);
    setFormula(options.length > 0 ? options[0] : "Directe");
    // Réinitialiser les numéros sélectionnés si le type de pari change et les numéros ne correspondent plus
    if (numbers.length > maxNums) {
        setNumbers([]);
    }
    // Recalculer les gains avec le nouveau type/formule
    if (stake !== "" && (numbers.length >= minNums || betType === "DoubleNumber" || betType === "Annagrammesimple")) {
       const calculatedGains = calculateGains();
       setGains(calculatedGains);
    }

  }, [betType, numbers.length]); // Ajouter numbers.length comme dépendance pour recalculer les gains si des numéros sont ajoutés/supprimés

  // Fonction pour calculer les gains
  const calculateGains = () => {
    const amount = parseFloat(stake);
    // Vérifier si la mise est valide et si les numéros requis sont sélectionnés (sauf pour types spéciaux)
    if (isNaN(amount) || amount < 10 || amount > 5000 || 
        (numbers.length < minNumbersRequired && betType !== "DoubleNumber" && betType !== "Annagrammesimple")) 
    {
      return ""; // Retourne vide si la mise ou les numéros sont invalides
    }

    let calculatedGain = 0;

    switch (betType) {
      case "FirstouonBK":
        calculatedGain = amount * gameMultipliers.FirstouonBK[formula as keyof typeof gameMultipliers.FirstouonBK];
        break;
      case "NAP":
        calculatedGain = amount * gameMultipliers.NAP[formula as keyof typeof gameMultipliers.NAP];
        break;
      case "Twosûrs":
        calculatedGain = amount * gameMultipliers.Twosûrs[formula as keyof typeof gameMultipliers.Twosûrs];
        break;
      case "Permutations": {
        // Pour les permutations, on prend le multiplicateur correspondant au nombre de boules
        const permType = formula;
        // Le multiplicateur dépend du nombre de boules trouvées, ici on montre le gain maximal possible
        const permTypeObj = gameMultipliers.Permutations[permType as keyof typeof gameMultipliers.Permutations];
        const maxKey = Object.keys(permTypeObj).slice(-1)[0];
        
        // Le gain pour Permde7à20boules semble être fixe selon votre ancien code, sinon c'est misé x multiplicateur
        calculatedGain = 
          permType === "Permde7à20boules" 
            ? permTypeObj[maxKey] 
            : amount * permTypeObj[maxKey]; 
        break;
      }
      case "DoubleChance": {
        // Double chance a des multiplicateurs spécifiques définis dans gameMultipliers.DoubleChance
        calculatedGain = amount * gameMultipliers.DoubleChance[formula as keyof typeof gameMultipliers.DoubleChance];
        break;
      }
      case "DoubleNumber":
        // Le gain pour DoubleNumber semble être misé x multiplicateur PermDoubleNumber
        calculatedGain = amount * gameMultipliers.DoubleNumber.PermDoubleNumber;
        break;
      case "Annagrammesimple":
        // Le gain pour Annagramme simple semble être misé x multiplicateur Directe
        calculatedGain = amount * gameMultipliers.Annagrammesimple.Directe;
        break;
    }

    return calculatedGain.toFixed(2);
  };

  // Gestion du changement de mise
  const handleStakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Permettre la saisie de n'importe quelle valeur, la validation se fera ailleurs (par isCouponValid)
    setStake(value);
    
    // Recalculer les gains si la mise est un nombre valide et les numéros sont suffisants ou type spécial
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 10 && amount <= 5000 && (numbers.length >= minNumbersRequired || betType === "DoubleNumber" || betType === "Annagrammesimple")) {
      const calculatedGains = calculateGains();
      setGains(calculatedGains);
    } else {
      setGains(""); // Effacer les gains si la mise est invalide ou les numéros insuffisants
    }
  };

  // Ajout d'un numéro à la sélection
  const addNumber = () => {
    const num = parseInt(currentNumber);
    if (isNaN(num) || num < 1 || num > 90) return;
    
    if (numbers.includes(num)) {
      alert("Ce numéro est déjà sélectionné.");
      return;
    }
    
    if (maxNumbersAllowed > 0 && numbers.length >= maxNumbersAllowed) {
      alert(`Vous ne pouvez pas sélectionner plus de ${maxNumbersAllowed} numéros pour cette formule.`);
      return;
    }
    
    const newNumbers = [...numbers, num];
    setNumbers(newNumbers);
    setCurrentNumber("");
    
    // Recalculer les gains si la mise est déjà saisie et les numéros sont suffisants
    if (stake !== "" && newNumbers.length >= minNumbersRequired) {
      const calculatedGains = calculateGains();
      setGains(calculatedGains);
    }
  };

  // Suppression d'un numéro de la sélection
  const removeNumber = (index: number) => {
    const newNumbers = numbers.filter((_, i) => i !== index);
    setNumbers(newNumbers);
    
    // Mise à jour des gains
    if (newNumbers.length < minNumbersRequired) {
      setGains("");
    } else if (stake !== "") {
      const calculatedGains = calculateGains();
      setGains(calculatedGains);
    }
  };

  // Fonction pour générer les numéros automatiquement selon le type de jeu
  const generateAutoNumbers = () => {
    if (betType === "DoubleNumber") {
      // Pour Double Number, on utilise les doubles (11, 22, 33, etc.)
      const doubleNums = [];
      for(let i = 1; i <= 9; i++) {
          doubleNums.push(i * 11);
      }
      setNumbers(doubleNums);
       if (stake !== "") {
        const calculatedGains = calculateGains();
        setGains(calculatedGains);
      }
      return;
    }
    
    if (betType === "Annagrammesimple") {
      // Pour Annagramme simple, on simule les 37 anagrammes
      // Cette logique est une simulation, l'implémentation réelle dépendra de l'API ou de règles spécifiques
      setNumbers([]); // Pas de numéros individuels sélectionnés pour Annagramme
      alert("Les 37 anagrammes seront automatiquement joués.");
      if (stake !== "") {
        const calculatedGains = calculateGains();
        setGains(calculatedGains);
      }
      return;
    }
    
    // Générer aléatoirement le nombre requis de numéros
    const autoNumbers: number[] = [];
    const numToGenerate = minNumbersRequired > 0 ? minNumbersRequired : 1; // Générer au moins 1 si min est 0
    while (autoNumbers.length < numToGenerate) {
      const num = Math.floor(Math.random() * 90) + 1;
      if (!autoNumbers.includes(num)) {
        autoNumbers.push(num);
      }
    }
    setNumbers(autoNumbers);
    
    // Mise à jour des gains
    if (stake !== "") {
      const calculatedGains = calculateGains();
      setGains(calculatedGains);
    }
  };

  // Déterminer si le bouton "Ajouter le coupon" doit être activé
  const isCouponValid = () => {
    const isValidStake = stake !== "" && parseFloat(stake) >= 10 && parseFloat(stake) <= 5000;
    
    if (betType === "DoubleNumber" || betType === "Annagrammesimple") {
      return isValidStake;
    }
    
    return numbers.length >= minNumbersRequired && isValidStake;
  };

  // Gérer l'ajout du coupon
  const handleAddCoupon = () => {
    if (isCouponValid()) {
      // Ici, nous allons collecter les données du coupon et les stocker
      const newCouponDetails = {
        ticketNumber: Math.floor(Math.random() * 100000000).toString(), // Générer un numéro de ticket simple pour l'exemple
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        gameName: gameName,
        betType: betType,
        numbers: numbers,
        formula: formula,
        stake: stake,
        gains: gains,
        prise: 1, // Assumons une prise de 1 pour l'exemple
      };
      setCouponDetails(newCouponDetails);
      setShowCouponDisplay(true); // Afficher l'interface du coupon
    }
  };

  // Gérer la suppression du coupon affiché
  const handleDeleteCouponDisplay = () => {
    setShowCouponDisplay(false);
    setCouponDetails(null); // Optionnel: effacer les détails stockés si nécessaire
  };

  if (loading) {
    // Utilisation de l'overlay pour le chargement initial de la page BetForm
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Chargement du formulaire de pari...</div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/choicePlay" className="back-button">Retour aux jeux</Link>
      </div>
    );
  }

  return (
    <div className="bet-form-container">
      {/* Bouton Retour */}
      <Link to={`/choicePlay?country=${country}`} className="back-button">‹ Retour</Link>
      
      <h2 className="title">{gameName} - {countryName} {gameTime}H</h2>
      
      {/* Sélection du type de pari */}
      <label>Type de pari</label>
      <select 
        className="bet-select" 
        value={betType} 
        onChange={(e) => setBetType(e.target.value as BetType)}
      >
        <option value="FirstouonBK">First ou One BK</option>
        <option value="NAP">NAP</option>
        <option value="Twosûrs">Two sûrs</option>
        <option value="Permutations">Les permutations</option>
        {/* Afficher l'option Double Chance uniquement si le jeu actuel la supporte */}
        {currentGameHasDoubleChance && <option value="DoubleChance">La double chance</option>}
        <option value="DoubleNumber">Double Number</option>
        <option value="Annagrammesimple">Annagramme simple</option>
      </select>
      
      <div className="bet-section">
        <p><b>{betType}</b></p>
        
        {/* Sélection des numéros */}
        {/* Masquer la section numéros pour DoubleNumber et Annagramme simple */}
        {betType !== 'DoubleNumber' && betType !== 'Annagrammesimple' && (minNumbersRequired > 0 || maxNumbersAllowed > 0) && (
          <>
            <label>
              Entrez {minNumbersRequired === maxNumbersAllowed 
                ? minNumbersRequired === 1 
                  ? "un nombre" 
                  : `${minNumbersRequired} nombres` 
                : maxNumbersAllowed > 0 
                  ? `entre ${minNumbersRequired} et ${maxNumbersAllowed} nombres`
                  : `${minNumbersRequired} ou plus de nombres`
                } entre 1 et 90
            </label>
            <div className="number-input-group">
              <input
                type="number"
                min="1"
                max="90"
                value={currentNumber}
                onChange={(e) => setCurrentNumber(e.target.value)}
                placeholder="Ex: 24"
              />
              <button 
                className="add-number-btn"
                onClick={addNumber}
                disabled={currentNumber === "" || parseInt(currentNumber) < 1 || parseInt(currentNumber) > 90 || (maxNumbersAllowed > 0 && numbers.length >= maxNumbersAllowed)}
              >
                Ajouter
              </button>
              {/* Le bouton Auto n'est pertinent que si des numéros sont requis */}
              {(minNumbersRequired > 0 || maxNumbersAllowed > 0) && (
                <button className="generate-numbers-btn" onClick={generateAutoNumbers}>
                  Auto
                </button>
              )}
            </div>
            
            {/* Affichage des numéros sélectionnés */}
            {numbers.length > 0 && (
              <div className="selected-numbers">
                <p>Numéros sélectionnés:</p>
                <div className="number-tags">
                  {numbers.sort((a, b) => a - b).map((num, index) => (
                    <span key={index} className="number-tag">
                      {num}
                      <button className="remove-number" onClick={() => removeNumber(index)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Boutons spéciaux pour Double Number et Annagramme */}
        {(betType === "DoubleNumber" || betType === "Annagrammesimple") && (
          <button className="generate-numbers-btn full-width" onClick={generateAutoNumbers}>
            {betType === "DoubleNumber" ? "Jouer tous les Double Numbers (11,22,33...)" : "Jouer les 37 anagrammes"}
          </button>
        )}
        
        {/* Sélection d'une formule */}
        {/* Masquer la sélection de formule pour DoubleNumber et Annagramme simple s'ils n'ont qu'une seule option */}
        {formulaOptions.length > 1 && betType !== "DoubleNumber" && betType !== "Annagrammesimple" && (
          <>
            <label>Formule</label>
            <select 
              className="formula-select"
              value={formula} 
              onChange={(e) => {
                setFormula(e.target.value);
                // Mettre à jour les gains si applicable
                const canCalculate = stake !== '' && (
                  (minNumbersRequired > 0 && numbers.length >= minNumbersRequired) ||
                  maxNumbersAllowed === 0
                );

                if (canCalculate) {
                  const calculatedGains = calculateGains();
                  setGains(calculatedGains);
                } else {
                  setGains('');
                }
              }}
            >
              {formulaOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </>
        )}
        
        {/* Mise entre 10 et 5000 */}
        <label>Mise (entre 10 et 5000)</label>
        <input
          type="number"
          min="10"
          max="5000"
          value={stake}
          onChange={handleStakeChange}
          placeholder="Ex: 100"
        />
        
        {/* Gains calculés automatiquement */}
        <label>Gains potentiels</label>
        <input type="text" value={gains} readOnly className="gains-display" />
        
        {/* Bouton Ajouter le coupon */}
        <button
          className={`bet-button ${!isCouponValid() ? "disabled" : ""}`}
          disabled={!isCouponValid()}
          onClick={handleAddCoupon}
        >
          AJOUTER LE COUPON AU PARI
        </button>
      </div>
      
      {/* Afficher l'interface du coupon si showCouponDisplay est true */}
      {showCouponDisplay && couponDetails && (
        <BetCouponDisplay 
          ticketNumber={couponDetails.ticketNumber}
          date={couponDetails.date}
          gameName={couponDetails.gameName}
          betType={couponDetails.betType}
          numbers={couponDetails.numbers}
          formula={couponDetails.formula}
          stake={couponDetails.stake}
          gains={couponDetails.gains}
          prise={couponDetails.prise}
          onDelete={handleDeleteCouponDisplay}
        />
      )}
    </div>
  );
};

export default BetForm;