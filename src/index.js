import { createMainPage, createPopularNews } from './js/sendrequest';



import { startWeatherApp } from './js/weather';

import { getCategories } from './js/categories';

const inputSearch = document.getElementById('searchForm');

getCategories();

startWeatherApp();

createPopularNews();


inputSearch.addEventListener('submit', createMainPage);
