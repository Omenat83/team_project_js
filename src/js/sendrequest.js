const API_KEY = 'u59IF6VhLyuj5qt5wMVcLGGSUKapZTsn';

const mainPage = document.getElementById('main-page');

const photoUrl = 'https://via.placeholder.com/400';

export async function articleSearch(query) {
  //   e.preventDefault();
  //   const query = e.value;
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${API_KEY}`;
  try {
    return await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(resp => resp.json());
    //   .then(res => console.log(res));
  } catch (error) {
    console.error(error);
  }
}

export async function createMainPage(e) {
  e.preventDefault();
  const query = e.target.elements.search.value;
  console.log(query);
  // const photoUrl = 'https://via.placeholder.com/400';
  mainPage.replaceChildren();
  const response = await articleSearch(query);
  console.dir(response.response.docs);
  if (response.response.docs.length === 0) {
    console.log(response.response.docs.length);
    mainPage.innerHTML = `<div class="news-card">
            <img src="${photoUrl}" alt="заглушка" />
            </div>`;
  }
  const newsCards = response.response.docs.map(news => {
    const title = news.headline.main;
    const { _id, section_name, abstract, pub_date, web_url } = news;
    const isFavorite = localStorage.getItem(`favorite_${_id}`) !== null;
    return `
          <div class="news-card">
            <img src="${photoUrl}" alt="заглушка" />
            <div class="news-card__info">
              <div class="news-card__category">${section_name}</div>
              <button class="news-card__favorite-btn ${
                isFavorite ? 'active' : ''
              }" data-news-id="${_id}">
                ${isFavorite ? 'Remove from Favorite' : 'Add to Favorite'}
              </button>
              <h2 class="news-card__title">${title}</h2>
              <p class="news-card__description">${
                abstract.length > 100
                  ? abstract.substring(0, 100) + '...'
                  : abstract
              }</p>
              <div class="news-card__date-div">
              <div class="news-card__date">${new Date(
                pub_date
              ).toLocaleDateString()}</div>
              <a class="news-card__read-more" href="${web_url}" target="_blank">Read more</a>
              </div>
            </div>
          </div>
        `;
  });
  mainPage.innerHTML = newsCards.join('');
  const weatherCard = document.createElement('div');
  weatherCard.classList.add('weather-card');
  // mainPage.appendChild(weatherCard);
  weatherCard.innerHTML = `<div class="news-card">
  <img src="${photoUrl}" alt="Погода" /></div>`;
  let position = 0;
  console.log(window.innerWidth);
  if (window.innerWidth > 800 && window.innerWidth < 1206) {
    // weatherCard.style.width = '100%';
    position = 1;
  } else if (window.innerWidth > 1206) {
    position = 2;
    // weatherCard.style.width = '';
  }
  console.log(position);
  const insertBeforeElement = mainPage.children[`${position}`];
  mainPage.insertBefore(weatherCard, insertBeforeElement);
}

// docs.headline.main - название статьи
// docs.lead_paragraph - начало статьи
// docs.pub_date - дата статьи
// docs.web_url - ссылка на статью
// docs.section_name - категория

// Добавление/удаление новости из избранного
function toggleFavorite(event) {
  const button = event.target;
  const newsId = button.dataset.newsId;

  if (localStorage.getItem(`favorite_${newsId}`) !== null) {
    localStorage.removeItem(`favorite_${newsId}`);
    button.textContent = 'Add to Favorite';
    button.classList.remove('active');
  } else {
    localStorage.setItem(`favorite_${newsId}`, true);
    button.textContent = 'Remove from Favorite';
    button.classList.add('active');
  }
}

mainPage.addEventListener('click', event => {
  const button = event.target.closest('.news-card__favorite-btn');
  if (button !== null) {
    toggleFavorite(event);
  }
});
