import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
};

const DEBOUNCE_DELAY = 300;

const renderCountriesList = countries => {
  const countriesMarkup = countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width = "30" height = "20"><b> ${country.name.official}</b></li>`;
    })
    .join('');
  refs.countryList.innerHTML = countriesMarkup;
};

const renderSearchCountry = countries => {
  const countryMarkup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="50" hight="30">
         <b class ="country-name">${country.name.official}</b>
         <p><b>Capital</b>: ${country.capital}</p>
         <p><b>Population</b>: ${country.population}</p>
         <p><b>Languages</b>: ${Object.values(country.languages)}</p>
         </li>`;
    })
    .join('');
  refs.countryList.innerHTML = countryMarkup;
};

refs.searchInput.addEventListener(
  'input',
  debounce(evt => {
    cleanHtml();
    const searchCountry = evt.target.value.trim();
    if (searchCountry !== '') {
      fetchCountries(searchCountry).then(foundData => {
        if (foundData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (foundData.length >= 2 && foundData.length <= 10) {
          renderCountriesList(foundData);
        } else if (foundData.length === 1) {
          renderSearchCountry(foundData);
        } else if (foundData.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function cleanHtml() {
  refs.countryList.innerHTML = '';
}
