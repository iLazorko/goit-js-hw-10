const BASE_URL = 'https://restcountries.com/v3.1/';

export function fetchCountries(countryName) {
  return fetch(
    `${BASE_URL}name/${countryName}?fields=name,capital,population,languages,flags`
  ).then(resolve => resolve.json());
}
