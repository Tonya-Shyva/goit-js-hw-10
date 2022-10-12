import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import countriesTpl from './templates/countriesTpl.hbs';
import countryTpl from './templates/countryTpl.hbs';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

const renderCountriesList = countries => {
  const countriesMarkup = countriesTpl(countries);
  refs.countryList.innerHTML = countriesMarkup;

  // -----нижче, якщо без шаблонізатора------------------------------
  // const countriesMarkup = countries
  //   .map(country => {
  //     return `<li><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width = "30" height = "20"><b> ${country.name.official}</b></li>`;
  //   })
  //   .join('');
  // refs.countryList.insertAdjacentHTML('beforeend', countriesMarkup);
};

const renderSearchCountry = country => {
  const countryMarkup = countryTpl(country);
  refs.countryInfo.innerHTML = countryMarkup;

  // -----нижче, якщо без шаблонізатора------------------------------
  // const countryMarkup = countries
  //   .map(country => {
  //     return `<li>
  //     <img src="${country.flags.svg}" alt="Flag of ${
  //       country.name.official
  //     }" width="50" hight="30">
  //        <b class ="country-name">${country.name.official}</b>
  //        <p><b>Capital</b>: ${country.capital}</p>
  //        <p><b>Population</b>: ${country.population}</p>
  //        <p><b>Languages</b>: ${Object.values(country.languages)}</p>
  //        </li>`;
  //   })
  //   .join('');
  // refs.countryList.insertAdjacentHTML('beforeend', countryMarkup);
};

refs.searchInput.addEventListener(
  'input',
  debounce(handlerInput, DEBOUNCE_DELAY)
);

function handlerInput(evt) {
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
        // // при використанні шаблонізатора вирішуємо питання з виведенням мов.Офіційних мов може бути
        //  в країні декілька, тому це об'єкт, з якого дістаємо масив властивостей за допомогою Object.values. Це ми робимо, якщо хочемо в шаблоні на рядку для languages написати просто{{languages}} без each,unless------
        // foundData[0].languages = Object.values(foundData[0].languages);
        // // console.log(foundData[0]);
        refs.countryList.innerHTML = '';
        renderSearchCountry(foundData);
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
  }
}

function cleanHtml() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
