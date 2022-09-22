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
  debounce(evt => {
    const searchCountry = evt.currentTarget.value.trim();
    cleanHtml();
    if (searchCountry !== '') {
      fetchCountries(searchCountry).then(foundData => {
        if (foundData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      });
    }
  }, DEBOUNCE_DELAY);
}
