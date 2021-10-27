import React, { useContext, useState } from 'react';
import StarWarsContext from '../context/StarWarsContext';

// feito olhando com o base o repositorio: https://github.com/tryber/sd-013-b-revisao-music-table/blob/master/src/components/Table.jsx
// https://www.youtube.com/watch?v=zypbcG3ZVnc&list=PLC3y8-rFHvwgWTSrDiwmUsl4ZvipOw9Cz&index=6
// https://www.youtube.com/watch?v=taVHzPDNHDU&list=PLC3y8-rFHvwgWTSrDiwmUsl4ZvipOw9Cz&index=7
function Table() {
  const { planets, setPlanets, filter, setFilter, setSortAscOrDesc,
    setSortColumn, sortColumn, sortAscOrDesc } = useContext(StarWarsContext);
  const [filterName, setFilterName] = useState('');
  const [column, setColumn] = useState('population');
  const [comparison, setComparison] = useState('maior que');
  const [value, setValue] = useState('0');
  const [newOptions, setNewOptions] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);

  function removeFilter() {
    setFilter({
      filters: {
        ...filter.filters,
        filterByNumericValues: [],
      },
    });
    setNewOptions(['population', 'orbital_period',
      'diameter', 'rotation_period', 'surface_water']);
    setValue('0');
    setComparison('maior que');
    setColumn('orbital_period');
  }

  function createNewColumn(oldColumn) {
    const newColumn = [...newOptions];
    newColumn.splice(newColumn.indexOf(oldColumn), 1);
    setNewOptions(newColumn);
  }
  // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // Feito com a ajuda do Lucas Caribé
  function sortFilter(table, type) {
    const sortedColumn = [...planets]
      .sort((planetA, planetB) => {
        if (type === 'ASC') {
          return planetA[table].localeCompare(planetB[table], 'en', { numeric: true });
        }
        return planetB[table].localeCompare(planetA[table], 'en', { numeric: true });
      });
    setPlanets(sortedColumn);
  }

  function handleClick() {
    setFilter({
      filters: {
        ...filter.filters,
        filterByNumericValues: [
          {
            column,
            comparison,
            value,
          },
        ],
      },
    });
    createNewColumn(column);
  }

  return (
    <>
      <select
        onChange={ ({ target }) => setSortColumn(target.value) }
        data-testid="column-sort"
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>
      <label htmlFor="asc-radio">
        ASC
        <input
          data-testid="column-sort-input-asc"
          name="sort-radios"
          id="asc-radio"
          type="radio"
          value="ASC"
          onClick={ () => setSortAscOrDesc('ASC') }
        />
      </label>
      <label htmlFor="desc-radio">
        DESC
        <input
          data-testid="column-sort-input-desc"
          name="sort-radios"
          id="desc-radio"
          type="radio"
          value="DESC"
          onClick={ () => setSortAscOrDesc('DESC') }
        />
      </label>
      <button
        onClick={ () => sortFilter(sortColumn, sortAscOrDesc) }
        data-testid="column-sort-button"
        type="button"
      >
        Filtrar
      </button>
      <input
        type="text"
        data-testid="name-filter"
        onChange={ (event) => setFilterName(event.target.value) }
      />
      <select
        data-testid="column-filter"
        onChange={ (event) => setColumn(event.target.value) }
      >
        { newOptions.map((option) => (
          <option key={ option } value={ option }>{ option }</option>
        )) }
      </select>
      <select
        data-testid="comparison-filter"
        onChange={ (event) => setComparison(event.target.value) }
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>
      <input
        type="number"
        data-testid="value-filter"
        onChange={ (event) => setValue(event.target.value) }
      />
      <button
        type="button"
        data-testid="button-filter"
        onClick={ handleClick }
      >
        Filtrar
      </button>
      <div data-testid="filter">
        <button type="button" onClick={ removeFilter }> X </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>Url</th>
          </tr>
        </thead>
        <tbody>
          { planets
            .filter((planet) => {
              const values = filter.filters.filterByNumericValues[0];
              let filteredResult = [];
              // Feito com a ajuda da Paulinha na monitoria individual
              if (values) {
                if (values.comparison === 'maior que') {
                  filteredResult = Number(planet[values.column]) > Number(values.value);
                } else if (values.comparison === 'menor que') {
                  filteredResult = Number(planet[values.column]) < Number(values.value);
                } else if (values.comparison === 'igual a') {
                  filteredResult = Number(planet[values.column]) === Number(values.value);
                } return filteredResult;
              }
              return planets;
            })
            .filter((planet) => planet.name.toLowerCase().includes(
              filterName.toLowerCase(),
            ))
            .map((planet) => (
              <tr key={ planet.name }>
                <td data-testid="planet-name">{ planet.name }</td>
                <td>{ planet.rotation_period }</td>
                <td>{ planet.orbital_period }</td>
                <td>{ planet.diameter }</td>
                <td>{ planet.climate }</td>
                <td>{ planet.gravity }</td>
                <td>{ planet.terrain }</td>
                <td>{ planet.surface_water }</td>
                <td>{ planet.population }</td>
                <td>{ planet.films }</td>
                <td>{ planet.created }</td>
                <td>{ planet.edited }</td>
                <td>{ planet.url }</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default Table;
