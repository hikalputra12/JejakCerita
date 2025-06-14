import { showFormattedDate } from './utils';

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}
export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateLoaderTemplate({}) {
  return `
  <div class="loader"></div>`;
}

export function generateLoaderAbsoluteTemplate() {
  return `<div class="loader loader-absolute"></div>`;
}

export function generateMainNavigationListTemplate() {
  return `
  <li><a id="story-list-button" class="story-list-button" href="#/">Semua Cerita</a></li>
   <li><a id="story-save-button" class="story-save-button" href="#/bookmark">Cerita Favorit <i class="fas fa-star"></i></a></li>
  <li><a id="about-page-button" class="about-page-button"  href="#/about">Tentang Jejak Cerita</a></li></li>`;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
  <div class="login-register">
    <li><a id="login-button"  href="#/login">Login</a></li>
    <li><a id="register-button"  href="#/register">Register</a></li>
  </div>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
   <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/new">Buat Cerita <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h1>Tidak ada Cerita yang tersedia</h1>
      <p>Saat ini, tidak ada Cerita yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h1>Terjadi kesalahan pengambilan Semua Cerita</h1>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoriesDetailErrorTemplate(message) {
  return `
    <div id="stories-detail-error" class="stories-detail__error">
      <h1>Terjadi kesalahan pengambilan detail Cerita</h1>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  title,
  description,
  userName,
  createdAt,
  location,
  storyImages,
}) {
  const imageUrl = storyImages && storyImages.length > 0 ? storyImages[0] : 'images/placeholder-image.jpg';
  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <img class="story-item__image" src="${imageUrl}" alt="foto dari cerita ${userName}">
      <div class="story-item__body">
        <div class="story-item__main">
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
            </div>
            <div class="story-item__location">
              <i class="fas fa-map"></i> ${location.placeName || `${location.latitude}, ${location.longitude}`}
            </div>
          </div>
        </div>
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <div class="story-item__more-info">
          <div class="story-item__author">
            Dibuat oleh: ${userName}
          </div>
        </div>
        <a class="btn story-item__read-more" href="#/stories/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoryDetailTemplate({
  description,
  location,
  userName,
  createdAt,
  storyImages,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const imagesHtml = (storyImages || []).reduce(
    (accumulator, imageUrl) =>
      accumulator.concat(generateStoryDetailImageTemplate(imageUrl, userName)),
    '',
  );

  return `
    <div class="story-detail__header">
      <div class="story-detail__more-info">
      <div id="author" class="story-detail__author" >Dibuat oleh: ${userName}</div>
        <div class="story-detail__more-info__inline">
          <div id="createdat" class="story-detail__createdat" ><i class="fas fa-calendar-alt"></i> ${createdAtFormatted}</div>
          <div id="location-place-name" class="story-detail__location__place-name" ><i class="fas fa-map"></i> ${location.placeName}</div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__images__container">
        <div id="images" class="story-detail__images">${imagesHtml}</div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h1 class="story-detail__description__title">Deskripsi Cerita</h1>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="story-detail__body__map__container">
          <h2 class="story-detail__map__title">Lokasi Cerita
          </h2>
          <div class="story-detail__map__container">
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
          <div id="save-story-container" class="story-detail__save-story">
            ${generateAddFavoriteButtonTemplate()}
          </div>
      </div>

    </div>
    <div id="save-actions-container" class="story-detail__save-actions-container"></div>
  `;
}

// Menyesuaikan template tombol "Simpan Laporan" menjadi "Simpan ke Favorit"
export function generateAddFavoriteButtonTemplate() {
  return `
    <button id="add-favorite-button" class="btn">
      <i class="fas fa-heart"></i> Simpan ke Favorit
    </button>
  `;
}

// Menyesuaikan template tombol "Buang Laporan" menjadi "Hapus dari Favorit"
export function generateRemoveFavoriteButtonTemplate() {
  return `
    <button id="remove-favorite-button" class="btn btn-transparent">
      <i class="fas fa-heart-crack"></i> Hapus dari Favorit
    </button>
  `;
}