import './sass/index.scss';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = `https://pixabay.com/api/`;
const KEY = `34510815-700dd665fa248476b1f313f8a`;
let page = 1;
let namePhoto = ' ';

const input = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

input.addEventListener('submit', onSubmitPhoto);
loadMoreBtn.addEventListener('click', onLoadMore);


async function searchPhoto(namePhoto, page = 1, perPage = 40) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: KEY,
      q: namePhoto,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: perPage,
      page: page
    }
  });
  return response;
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

async function onSubmitPhoto(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  namePhoto = e.target.elements.searchQuery.value.trim();
  if (!namePhoto) {
    return Notiflix.Notify.failure(
      'Sorry, the search field cannot be empty. Please enter information to search.' );
  }
  const { data } = await searchPhoto(namePhoto);
    
  cardPhoto(data); 
  messageInfo(data); 
  stopSearch(data.hits.length); 
  e.target.reset(); 
}  

async function onLoadMore() {
    page += 1;
    const { data } = await searchPhoto(namePhoto, page);
    cardPhoto(data);
    stopSearch(data.hits.length);
}

function cardPhoto(arr) {
  const markUp = arr.hits
    .map(el => {
      return `
    <div class="photo-card">
    <a class="gallery-link" href="${el.largeImageURL}">
    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" class="img"/>
    </a>
    <div class="info">
    <p class="info-item"><b>Likes: </b>${el.likes}
    </p>
    <p class="info-item"><b>Views: </b>${el.views}
    </p>
    <p class="info-item"><b>Comments: </b>${el.comments}
    </p>
    <p class="info-item"><b>Downloads: </b>${el.downloads}
    </p>
    </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markUp);
  lightbox.refresh();
}


function messageInfo(arr) {
  if (arr.hits.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (arr.totalHits !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${arr.totalHits} images.`);
  }
}
function stopSearch(length) {
  if (length < 40 && length > 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  if (length === 40) {
    loadMoreBtn.style.display = 'block';
  }
}


// function onWindowScroll() {
//   if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
//     onLoadMore();
//   }
// }

// window.addEventListener("scroll", onWindowScroll);