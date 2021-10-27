import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StarWarsContext from './StarWarsContext';

function StarWarsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [sortColumn, setSortColumn] = useState('Name');
  const [sortAscOrDesc, setSortAscOrDesc] = useState('ASC');
  const [filter, setFilter] = useState({
    filters: {
      filterByName: {
        name: '',
      },
      filterByNumericValues: [],
      order: {
        column: 'Name',
        sort: 'ASC',
      },
    },
  });
  // Feito com a ajuda do Lucas Caribe
  useEffect(() => {
    async function fetchApi() {
      const response = await fetch('https://swapi.dev/api/planets/');
      const { results } = await response.json();
      results.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
      setPlanets(results);
    }
    fetchApi();
  }, []);

  return (
    <StarWarsContext.Provider
      value={ {
        planets,
        setPlanets,
        filter,
        setFilter,
        sortColumn,
        sortAscOrDesc,
        setSortAscOrDesc,
        setSortColumn,
      } }
    >
      { children }
    </StarWarsContext.Provider>
  );
}

StarWarsProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default StarWarsProvider;
