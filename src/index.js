import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  infoCountryDiv: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchInput.addEventListener('input', onSerch);

function onSerch(evt) {
  const searchQuery = evt.currentTarget.elements.query.value;
}
