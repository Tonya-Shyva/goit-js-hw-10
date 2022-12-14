import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import countriesTpl from './templates/countriesTpl.hbs';
import countryTpl from './templates/countryTpl.hbs';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const weatherContainer = document.querySelector('.weather-container');
const DEBOUNCE_DELAY = 100;

const renderCountriesList = countries => {
  weatherCleanMarkUp();
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
      // console.log(foundData);
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        renderCountriesList(foundData);
        weatherCleanMarkUp();
        // document.body.style.background = 'linear-gradient(blue, yellow)';
      } else if (foundData.length === 1) {
        // // при використанні шаблонізатора вирішуємо питання з виведенням мов.Офіційних мов може бути
        //  в країні декілька, тому це об'єкт, з якого дістаємо масив властивостей за допомогою Object.values. Це ми робимо, якщо хочемо в шаблоні на рядку для languages написати просто{{languages}} без each,unless------
        // foundData[0].languages = Object.values(foundData[0].languages);
        // // console.log(foundData[0]);
        renderSearchCountry(foundData);
        refs.countryList.innerHTML = '';
        if (foundData[0].name.common === 'Ukraine') {
          foundData[0].capital = 'Kiev';
        }
        fetchWeather(foundData);
        // document.body.style.background = 'linear-gradient(blue, yellow)';
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
// ----------------------weather-----------------------------

function fetchWeather(evt) {
  // console.log(evt);
  const base_url = '//api.weatherapi.com/v1';
  const KEY = 'b6c72740a18f4b68b2c131121230801';

  const weatherPromise = fetch(
    `${base_url}/current.json?key=${KEY}&q=${evt[0].capital}`
  );
  // console.log(weatherPromise);
  weatherPromise
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(data => {
      // console.log(data);
      if (evt.length === 1) {
        const markup = createMarkup(data);
        weatherContainer.innerHTML = markup;
      } else {
        weatherCleanMarkUp();
      }
    })
    .catch(err => console.log(err));
}

function createMarkup(arr) {
  return `<div class='weather-card'>
    <h2 class="weather-location">Weather in ${arr.location.name} <br> ${arr.current.last_updated}</h2>
    <img src="${arr.current.condition.icon}" alt="${arr.current.condition.text}">
    <p>${arr.current.condition.text}</p>
    <h3>Temprature: ${arr.current.temp_c} °С</h3>
    </div>`;
}

function weatherCleanMarkUp() {
  weatherContainer.innerHTML = '';
}
