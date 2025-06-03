import {
  generateLoaderAbsoluteTemplate,
  generateRemoveStoryButtonTemplate,
  generateStoriesDetailErrorTemplate, // Corrected from generateStoryDetailErrorTemplate
  generateStoryDetailTemplate,
  generateSaveStoryButtonTemplate,
} from '../../template'; // Corrected import path from '../../templates' to '../../../template'
import { createCarousel } from '../../utils'; // Assuming createCarousel is in utils/index.js
import StoryDetailPresenter from './story-detail'; // Corrected import, assuming this imports the actual presenter
import { parseActivePathname } from '../../routes/url-parser'; //
import Map from '../../utils/map'; //
import * as StoryAPI from '../../data/api'; //

export default class StoryDetailPage { // Renamed from StoryDetailPresenter in original file
  #presenter = null;
  #form = null; // Unused, can be removed if not needed later.
  #map = null; // kita insisialisasikan ulang variabel map karena hanya bisa di gunakan di kelas ini

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StoryAPI,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailTemplate({
      // Assuming story.name from the original API data is used as the title/identifier
      title: story.name,
      description: story.description,
      storyImages: story.storyImages, // Use the mapped storyImages array
      location: story.location, // Use the mapped location object
      userName: story.user.name, // Use the mapped user's name
      createdAt: story.createdAt,
    });

    // Carousel images
    // Ensure an element with id="images" is part of generateStoryDetailTemplate's output
    const carouselElement = document.getElementById('images');
    if (carouselElement) {
      createCarousel(carouselElement);
    } else {
      console.warn('Carousel element with ID "images" not found. Ensure it is in generateStoryDetailTemplate.');
    }

  // Map agar di munculkan di detail ketika kita ingin membuat laporan kejadian  
  await this.#presenter.showStoryDetailMap();
  if (this.#map) {
    const storyCoordinate = [story.location.latitude, story.location.longitude];
    // Use story.name (title/identifier) or description for map marker
    const markerOptions = { alt: story.name || 'Story Location' };
    const popupOptions = { content: story.name || story.description.substring(0, 30) };
    this.#map.changeCamera(storyCoordinate);
    this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
  }
    // Actions buttons
    // This call chain leads to the error if 'save-actions-container' is not in the DOM.
    // The primary fix is to ensure generateStoryDetailTemplate includes <div id="save-actions-container"></div>.
    this.#presenter.showSaveButton();
  }

  populateStoryDetailError(message) {
    const storyDetailElement = document.getElementById('story-detail');
    if (storyDetailElement) {
      storyDetailElement.innerHTML = generateStoriesDetailErrorTemplate(message); // Corrected template name
    } else {
      console.error("Element with ID 'story-detail' not found to populate error.");
    }
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    const container = document.getElementById('save-actions-container');
    if (container) {
      container.innerHTML = generateSaveStoryButtonTemplate();
    } else {
      console.error("CRITICAL: Element with ID 'save-actions-container' not found. Please ensure it's in generateStoryDetailTemplate.");
    }
  }

  renderRemoveButton() {
    const container = document.getElementById('save-actions-container');
    if (container) {
      container.innerHTML = generateRemoveStoryButtonTemplate();
    } else {
      console.error("CRITICAL: Element with ID 'save-actions-container' not found. Please ensure it's in generateStoryDetailTemplate.");
    }
  }




  showStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById('story-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}