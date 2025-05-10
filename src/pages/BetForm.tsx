import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/BetForm.css"; // Fichier CSS

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

const BetForm = () => {
  // Récupération des paramètres d'URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const country = queryParams.get("country") || "benin";
  const gameTime = queryParams.get("time") || "";
  const hasDoubleChance = queryParams.get("doubleChance") === "true";

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
    const countryKey = country as keyof typeof countryNames;
    setCountryName(countryNames[countryKey] || country);
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
        minNums = maxNums = 1;
        break;
      case "DoubleNumber":
        options = ["PermDoubleNumber"];
        minNums = 0;
        maxNums = 0;
        break;
      case "Annagrammesimple":
        options = ["Directe"];
        minNums = 0;
        maxNums = 0;
        break;
    }

    setFormulaOptions(options);
    setMinNumbersRequired(minNums);
    setMaxNumbersAllowed(maxNums);
    setFormula(options.length > 0 ? options[0] : "Directe");
    setNumbers([]);
  }, [betType]);

  // Fonction pour calculer les gains
  const calculateGains = () => {
    const amount = parseFloat(stake);
    if (isNaN(amount) || amount < 10 || amount > 5000) return "";

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
        
        calculatedGain = 
          permType === "Permde7à20boules" 
            ? permTypeObj[maxKey] // Gain fixe pour perm 7-20
            : amount * permTypeObj[maxKey]; // Multiplicateur pour perm 3-6
        break;
      }
      case "DoubleChance": {
        // Double chance divise le gain: 60% Win, 40% Machine
        const baseMultiplier = 14; // Utilise le multiplicateur de base FirstouonBK Directe
        calculatedGain = amount * baseMultiplier * gameMultipliers.DoubleChance[formula as keyof typeof gameMultipliers.DoubleChance];
        break;
      }
      case "DoubleNumber":
        // Utilise les mêmes règles que les permutations pour 8 boules
        calculatedGain = amount * gameMultipliers.DoubleNumber.PermDoubleNumber;
        break;
      case "Annagrammesimple":
        calculatedGain = amount * gameMultipliers.Annagrammesimple.Directe;
        break;
    }

    return calculatedGain.toFixed(2);
  };

  // Gestion du changement de mise
  const handleStakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || (Number(value) >= 10 && Number(value) <= 5000)) {
      setStake(value);
      if (numbers.length >= minNumbersRequired || betType === "DoubleNumber" || betType === "Annagrammesimple") {
        const calculatedGains = calculateGains();
        setGains(calculatedGains);
      }
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
    
    if (numbers.length >= maxNumbersAllowed) {
      alert(`Vous ne pouvez pas sélectionner plus de ${maxNumbersAllowed} numéros pour cette formule.`);
      return;
    }
    
    const newNumbers = [...numbers, num];
    setNumbers(newNumbers);
    setCurrentNumber("");
    
    // Recalculer les gains si la mise est déjà saisie
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
      setNumbers([11, 22, 33, 44, 55, 66, 77, 88]);
      if (stake !== "") {
        const calculatedGains = calculateGains();
        setGains(calculatedGains);
      }
      return;
    }
    
    if (betType === "Annagrammesimple") {
      // Pour Annagramme simple, on simule les 37 anagrammes
      alert("Les 37 anagrammes seront automatiquement joués.");
      if (stake !== "") {
        const calculatedGains = calculateGains();
        setGains(calculatedGains);
      }
      return;
    }
    
    // Générer aléatoirement le nombre requis de numéros
    const autoNumbers: number[] = [];
    while (autoNumbers.length < minNumbersRequired) {
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
    if (betType === "DoubleNumber" || betType === "Annagrammesimple") {
      return stake !== "" && parseFloat(stake) >= 10 && parseFloat(stake) <= 5000;
    }
    
    return numbers.length >= minNumbersRequired && 
           stake !== "" && 
           parseFloat(stake) >= 10 && 
           parseFloat(stake) <= 5000;
  };

  return (
    <div className="bet-form-container">
      {/* Bouton Retour */}
      <Link to="/choicePlay" className="back-button">‹ Retour</Link>
      
      <h2 className="title"> Formulaire de pari - {countryName} {gameTime}H</h2>
      
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
        {hasDoubleChance && <option value="DoubleChance">La double chance</option>}
        <option value="DoubleNumber">Double Number</option>
        <option value="Annagrammesimple">Annagramme simple</option>
      </select>
      
      <div className="bet-section">
        <p><b>{betType}</b></p>
        
        {/* Sélection des numéros */}
        {betType !== "DoubleNumber" && betType !== "Annagrammesimple" && (
          <>
            <label>
              Entrez {minNumbersRequired === maxNumbersAllowed 
                ? minNumbersRequired === 1 
                  ? "un nombre" 
                  : `${minNumbersRequired} nombres` 
                : `entre ${minNumbersRequired} et ${maxNumbersAllowed} nombres`} entre 1 et 90
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
                disabled={currentNumber === "" || parseInt(currentNumber) < 1 || parseInt(currentNumber) > 90}
              >
                Ajouter
              </button>
              <button className="generate-numbers-btn" onClick={generateAutoNumbers}>
                Auto
              </button>
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
        <label>Formule</label>
        <select 
          className="formula-select"
          value={formula} 
          onChange={(e) => {
            setFormula(e.target.value);
            // Mettre à jour les gains si applicable
            if (numbers.length >= minNumbersRequired && stake !== "") {
              const calculatedGains = calculateGains();
              setGains(calculatedGains);
            }
          }}
        >
          {formulaOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        
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
        <Link to="/dashboard" className={!isCouponValid() ? "disabled-link" : ""}>
          <button 
            className={`bet-button ${!isCouponValid() ? "disabled" : ""}`}
            disabled={!isCouponValid()}
          >
            AJOUTER LE COUPON AU PARI
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BetForm;