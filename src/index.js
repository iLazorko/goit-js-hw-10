/**
 * Создай фронтенд часть приложения поиска данных о стране по её частичному или полному имени. 
 *
 * HTTP-запросы
 * 
Используй публичный API Rest Countries, а именно ресурс name, возвращающий массив объектов 
стран удовлетворивших критерий поиска. 
Добавь минимальное оформление элементов интерфейса.

Напиши функцию fetchCountries(name) которая делает HTTP-запрос на ресурс name 
и возвращает промис с массивом стран - результатом запроса. 
Вынеси её в отдельный файл fetchCountries.js и сделай именованный экспорт.

Фильтрация полей

В ответе от бэкенда возвращаются объекты, большая часть свойств которых тебе не пригодится. 
Чтобы сократить объем передаваемых данных добавь строку параметров запроса - 
так этот бэкенд реализует фильтрацию полей. Ознакомься с документацией синтаксиса фильтров.

Тебе нужны только следующие свойства:

name.official - полное имя страны
capital - столица
population - население
flags.svg - ссылка на изображение флага
languages - массив языков
Поле поиска

Название страны для поиска пользователь вводит в текстовое поле input#search-box. 
HTTP-запросы выполняются при наборе имени страны, то есть по событию input. 
Но, делать запрос при каждом нажатии клавиши нельзя, так как одновременно получится много запросов 
и они будут выполняться в непредсказуемом порядке.

Необходимо применить приём Debounce на обработчике события и делать HTTP-запрос спустя 300мс после того, 
как пользователь перестал вводить текст. Используй пакет lodash.debounce.

Выполни санитизацию введенной строки методом trim(), это решит проблему когда в поле ввода 
только пробелы или они есть в начале и в конце строки.


Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется, 
а разметка списка стран или информации о стране пропадает.



Интерфейс

Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, 
что имя должно быть более специфичным. Для уведомлений используй библиотеку notiflix 
и выводи такую строку "Too many matches found. Please enter a more specific name.".

Если бэкенд вернул от 2-х до 10-х стран, под тестовым полем отображается список найденных стран. 
Каждый элемент списка состоит из флага и имени страны.

Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: 
флаг, название, столица, население и языки.

Обработка ошибки

Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, 
а ошибку со статус кодом 404 - не найдено. Если это не обработать, то пользователь никогда не узнает о том, 
что поиск не дал результатов. 
Добавь уведомление "Oops, there is no country with that name" в случае ошибки используя библиотеку notiflix.

Не забывай о том, что fetch не считает 404 ошибкой, поэтому необходимо явно отклонить промис 
чтобы можно было словить и обработать ошибку.
 */

import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetch_countries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener(
  'input',
  debounce(evt => {
    const inputName = evt.target.value.trim().toLowerCase();

    onInputCountry(inputName);
    clearMarkUp();
  }, DEBOUNCE_DELAY)
);

function onInputCountry(countryName) {
  if (countryName === '') {
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      clearMarkUp();

      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (countries.length === 1) {
        return makeMarkupCountryInfo(countries);
      }

      return makeMarkupCountriesList(countries);
    })
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
      return;
    });
}

function makeMarkupCountryInfo(countries) {
  countryInfo.innerHTML = countries
    .map(country => {
      return `<div class="wrap"><img class="img-flag" src='${
        country.flags.svg
      }' alt='flag' width="50px"><p><b>${
        country.name.official
      }</b></p></div><p>Capital: <b>${country.capital} </b></p>
              <p>Population:<b> ${country.population}</b></p>
              <p>Languages: <b>${Object.values(country.languages).join(
                ', '
              )}</b></p>`;
    })
    .join('');

  return countryInfo;
}

function makeMarkupCountriesList(countries) {
  return (listEl.innerHTML = countries
    .map(
      country =>
        `<li class="item"> <div class="wrap"><img class="img-flag" src='${country.flags.svg}' alt='flag'><p><b>${country.name.official}</b></p></div></li>`
    )
    .join(''));
}

function clearMarkUp() {
  countryInfo.innerHTML = '';
  listEl.innerHTML = '';
}
