const API_KEY = 't8X9JXlP7JTQb4JOFaZ7soveQbwr46sH';
const URL = 'https://api.nytimes.com/svc/news/v3/content/section-list.json';

const categoryBtn = document.getElementById('category-btn');
// const mainPage = document.getElementById('main-page');

// getCategories();

export async function getCategories() {
  try {
    return await fetch(`${URL}?api-key=${API_KEY}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      //   .then(cat => console.log(cat.results));
      .then(cat => {
        const arrayOfCategories = [];
        for (const arr of cat.results) {
          arrayOfCategories.push(arr.display_name);
        }
        // console.log(arrayOfCategories);
        return arrayOfCategories;
      })
      .then(arrayOfCategories => {
        // for (const arrbtn of arrayOfCategories) {
        for (let i = 0; i <= 5; i++) {
          categoryBtn.insertAdjacentHTML(
            'beforeend',
            `<button type="button" class="category_btn">${arrayOfCategories[i]}</button>`
          );
        }
        categoryBtn.insertAdjacentHTML(
          'beforeend',
          `<select name="Others" class="select_btn">
            <option value="Others" hidden>Others</option>
            </select>`
        );
        const selectBtn = document.querySelector('.select_btn');
        for (let i = 6; i < arrayOfCategories.length; i++) {
          selectBtn.insertAdjacentHTML(
            'beforeend',
            `<option value="${arrayOfCategories[i]}">${arrayOfCategories[i]}</option>`
          );
        }

        // Для кнопок

        const categoryBtns = document.querySelectorAll('.category_btn');
        categoryBtns.forEach(btn => {
          btn.addEventListener('click', async () => {
            event.preventDefault();
            const category = btn.textContent.toLowerCase();
            console.log(category);
            getNewsByCategory(category);
          });
        });

        // Для селектора

        selectBtn.addEventListener('change', async event => {
          const category = event.currentTarget.value.toLowerCase();
          event.preventDefault();
          console.log(category);
          getNewsByCategory(category);
        });
      });
  } catch (error) {
    console.error(error);
  }
}

async function getNewsByCategory(category) {
  const urlCategory = `https://api.nytimes.com/svc/news/v3/content/nyt/${category}.json?api-key=${API_KEY}`;
  try {
    const response = await fetch(urlCategory, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    const news = data.results;
    console.log(news);
    renderResult(news);
  } catch (error) {
    console.error(error);
  }
}

const listCards = document.querySelector('.list-cards');

function renderResult(news) {
  // if (news === '') {
  //   return (listCards.innerHTML = '<h1>No news</h1>');
  // }
  const markup = news
    .map(resultSearch => {
      const photo =
        resultSearch.multimedia !== null
          ? resultSearch.multimedia[2].url
          : 'https://user-images.githubusercontent.com/110947394/222411348-dc3ba506-91e5-4318-9a9e-89fcf1a764a8.jpg';
      const { section, abstract, title, url, uri, published_date } =
        resultSearch;
      const isFavorite = localStorage.getItem(`favorite_${uri}`) !== null;
      return `<div class ="news-card">
        <img src="${photo}" alt="photo"/>
        <div class="news-card__info">
        <div class="news-card__category">${section}</div>
        <button class="news-card__favorite-btn ${
          isFavorite ? 'active_btn' : ''
        }" data-news-id="${uri}">
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
                published_date
              ).toLocaleDateString()}</div>
              <a class="news-card__read-more" href="${url}" target="_blank">Read more</a>
            </div>
          </div>
          </div>`;
    })
    .join('');
  listCards.innerHTML = markup;
}

// Добавление/удаление новости из избранного
// function toggleFavorite(event) {
//   const button = event.target;
//   const newsId = button.dataset.newsId;

//   if (localStorage.getItem(`favorite_${newsId}`) !== null) {
//     localStorage.removeItem(`favorite_${newsId}`);
//     button.textContent = 'Add to Favorite';
//     button.classList.remove('active');
//   } else {
//     localStorage.setItem(`favorite_${newsId}`, true);
//     button.textContent = 'Remove from Favorite';
//     button.classList.add('active');
//   }
// }

// mainPage.addEventListener('click', event => {
//   const button = event.target.closest('.news-card__favorite-btn');
//   if (button !== null) {
//     toggleFavorite(event);
//   }
// });
