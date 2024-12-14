import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Assure-toi d'importer ton fichier CSS ici

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const countriesPerPage = 10;

  // Récupération des pays via l'API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://restcountries.com/v2/all'); // API v2
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Filtrage des pays par région
  const filteredCountries = selectedRegion
    ? countries.filter((country) => country.region === selectedRegion)
    : countries;

  // Pagination
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Gestion du changement de région
  const handleRegionChange = (event) => setSelectedRegion(event.target.value);

  if (loading) return <h2>Chargement...</h2>;

  return (
    <div>
      <h1>WorldQuest - Liste des Pays</h1>

      {/* Liste déroulante pour le filtre par région */}
      <div>
        <label htmlFor="region-select"> </label>
        <select id="region-select" onChange={handleRegionChange} value={selectedRegion}>
          <option value="">Toutes les régions</option>
          <option value="Africa">Afrique</option>
          <option value="Americas">Amériques</option>
          <option value="Asia">Asie</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Océanie</option>
        </select>
      </div>

      {/* Liste des pays */}
      <ul>
        {currentCountries.map((country) => (
          <li key={country.alpha3Code}>
            <img
              src={country.flag || 'https://via.placeholder.com/50'}
              alt={`Flag of ${country.name}`}
              width="50"
            />
            <p>{country.name}</p>
            <p>Capitale : {country.capital || 'Non disponible'}</p>
            <p>Région : {country.region}</p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <button onClick={nextPage} disabled={indexOfLastCountry >= filteredCountries.length}>
          Suivant
        </button>
      </div>
    </div>
  );
}

export default App;
