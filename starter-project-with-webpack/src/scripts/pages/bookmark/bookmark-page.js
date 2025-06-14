import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../template';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';

export default class BookmarkPage {
  #presenter = null;
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

  populateBookmarkedStories(message, stories) {
    if (stories.length <= 0) {
      this.populateBookmarkedStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      console.log('Story data for item:', story); 
      if (this.#map) {
        const coordinate = [story.location.latitude, story.location.longitude];
        if (coordinate[0] !== undefined && coordinate[1] !== undefined) {
            const markerOptions = { alt: story.name || 'Story Location' };
            let popupOptions = null;
            if (story.location.placeName && story.location.placeName !== 'Lokasi Tidak Diketahui' && story.location.placeName !== 'Gagal mengambil nama lokasi') {
                popupOptions = { content: story.name + ' - ' + story.location.placeName };
            }
            this.#map.addMarker(coordinate, markerOptions, popupOptions);
        } else {
            console.warn('Skipping marker for story due to missing coordinates:', story);
        }
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

  populateBookmarkedStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateBookmarkedStoriesError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  showStoriesListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoriesListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
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