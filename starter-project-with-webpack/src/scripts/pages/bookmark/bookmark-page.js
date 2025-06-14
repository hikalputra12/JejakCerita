import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate, // Sesuaikan dari generateReportItemTemplate
  generateStoriesListEmptyTemplate, // Sesuaikan dari generateReportsListEmptyTemplate
  generateStoriesListErrorTemplate, // Sesuaikan dari generateReportsListErrorTemplate
} from '../../template'; // Sesuaikan dari ../../templates
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';

export default class BookmarkPage {
  #presenter = null; // Menambahkan ini agar bisa diinisialisasi di afterRender
  #map = null;
  async render() {
    return `
      <section>
        <div class="stories-list__map__container"> 
          <div id="map" class="stories-list__map"></div> 
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Cerita Favorit</h1> 

        <div class="stories-list__container"> 
          <div id="stories-list"></div> 
          <div id="stories-list-loading-container"></div> 
        </div>
      </section>
    `;
  }

  async afterRender() {
       this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  populateBookmarkedStories(message, stories) { // Sesuaikan dari populateBookmarkedReports, reports menjadi stories
    if (stories.length <= 0) {
      this.populateBookmarkedStoriesListEmpty(); // Sesuaikan dari populateBookmarkedReportsListEmpty
      return;
    }

    const html = stories.reduce((accumulator, story) => { // Sesuaikan dari report menjadi story
      if (this.#map) {
        const coordinate = [story.location.latitude, story.location.longitude];
        const markerOptions = { alt: story.title };
        const popupOptions = { content: story.title };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }
      
      return accumulator.concat(
        generateStoryItemTemplate({ // Sesuaikan dari generateReportItemTemplate
          ...story,
          // Sesuaikan dengan properti story Anda, misal:
          userName: story.user.name, // Sesuaikan dari reporterName, placeNameLocation
        }),
      );
    }, '');

    document.getElementById('stories-list').innerHTML = ` 
      <div class="stories-list">${html}</div> 
    `;
  }

  populateBookmarkedStoriesListEmpty() { // Sesuaikan dari populateBookmarkedReportsListEmpty
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate(); // Sesuaikan dari reports-list, generateReportsListEmptyTemplate
  }

  populateBookmarkedStoriesError(message) { // Sesuaikan dari populateBookmarkedReportsError
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message); // Sesuaikan dari reports-list, generateReportsListErrorTemplate
  }

  showStoriesListLoading() { // Sesuaikan dari showReportsListLoading
    document.getElementById('stories-list-loading-container').innerHTML = // Sesuaikan dari reports-list-loading-container
      generateLoaderAbsoluteTemplate();
  }

  hideStoriesListLoading() { // Sesuaikan dari hideReportsListLoading
    document.getElementById('stories-list-loading-container').innerHTML = ''; // Sesuaikan dari reports-list-loading-container
  }
  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }
  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }
  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}