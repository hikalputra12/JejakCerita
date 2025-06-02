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
      title: story.title,
      description: story.description,
      storyImages: story.photo, // Changed from evidenceImages, assuming API returns 'photo' for images
      location :story.location,
      userName: story.name, // Assuming API returns 'name' for user name
      createdAt: story.createdAt,
    });

    // Carousel images
    createCarousel(document.getElementById('images'));

  // Map agar di munculkan di detail ketika kita ingin membuat laporan kejadian  
  await this.#presenter.showStoryDetailMap();
  if (this.#map) {
    const storyCoordinate = [story.location.latitude, story.location.longitude];
    const markerOptions = { alt: story.title };
    const popupOptions = { content: story.title };
    this.#map.changeCamera(storyCoordinate);
    this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
  }
    // Actions buttons
    this.#presenter.showSaveButton();
  }

  populateStoryDetailError(message) {
    document.getElementById('story-detail').innerHTML = generateStoriesDetailErrorTemplate(message); // Corrected template name
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveStoryButtonTemplate();
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveStoryButtonTemplate();
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