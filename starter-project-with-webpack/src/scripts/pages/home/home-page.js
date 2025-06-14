import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../template';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as JejakCeritaAPI from '../../data/api';


export default class HomePage {
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
    console.log('populateStoriesList called. Map instance:', this.#map); 
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      console.log('Attempting to add marker for story:', story);
      if (this.#map) {
        const coordinate = [story.location.latitude, story.location.longitude];
        if (coordinate[0] !== undefined && coordinate[1] !== undefined) {
          const markerOptions = { alt: story.name  };
          const popupOptions = { content: story.name + ' - ' + story.location.placeName };
          this.#map.addMarker(coordinate, markerOptions, popupOptions);
        } else {
          console.warn('Skipping marker for story due to missing coordinates:', story.title, story.location);
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

  populateStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    try {
      this.#map = await Map.build('#map', {
        zoom: 13,
        locate: true,
      });
      if (!this.#map) {
        console.error('HomePage.initialMap: Map.build did not return a valid map object.');
      } else {
        console.log('HomePage.initialMap: Map initialized successfully:', this.#map);
      }
    } catch (error) {
      console.error('HomePage.initialMap: Error during Map.build:', error);
      this.#map = null;
      throw error; 
    }
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }
}