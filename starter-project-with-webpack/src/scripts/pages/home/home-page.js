import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../template'; // Corrected import path from '../../templates' to '../../../template'
import HomePresenter from './home-presenter';
import Map from '../../utils/map'; // untuk menampilkan peta pada halaman home page
import * as JejakCeritaAPI from '../../data/api'; //

export default class HomePage {
  #presenter = null;
  #map = null; // agar variabel private map bisa digunakan pada file ini 

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Semua Cerita</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: JejakCeritaAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateStoriesList(message, stories) {
  if (stories.length <= 0) {
    this.populateStoriesListEmpty();
    return;
  }
 
  const html = stories.reduce((accumulator, story) => {
    if (this.#map) {
      const coordinate = [story.location.latitude, story.location.longitude]; // Definisikan coordinate di sini
      const markerOptions = { alt: story.title };
      const popupOptions = { content: story.title };
      this.#map.addMarker(coordinate, markerOptions, popupOptions); // Sekarang coordinate sudah terdefinisi
    }
 
    return accumulator.concat(
      generateStoryItemTemplate({
        ...story,
        userName: story.user.name,
      }),
    );
  }, '');
 
  document.getElementById('stories-list').innerHTML = `
    <div class="stories-list">${html}</div>
  `;
  }

  populateStoriesListEmpty() { // Changed from populateReportsListEmpty for consistency
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  //memunculkan map pada home page
  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 13, //zoom yang akan di tampilkan pada peta di home-page
      locate: true, //menampilkan lokasi sekarang dari user dengan ptoperti locate bernilai true
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = // Corrected ID
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = ''; // Corrected ID
  }
}