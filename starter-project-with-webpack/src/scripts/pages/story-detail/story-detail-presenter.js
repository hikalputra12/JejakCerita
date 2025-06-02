import {
  generateLoaderAbsoluteTemplate,
  generateRemoveStoryButtonTemplate,
  generateStoryDetailErrorTemplate,
  generateStoryDetailTemplate,
  generateSaveStoryButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import StoryDetailPresenter from './story-detail-presenter';
import StoryDetailPresenter from './story-detail'; // Corrected import
import { parseActivePathname } from '../../routes/url-parser'; // Corrected import
import Map from '../../utils/map';
import * as StoryAPI from '../../data/api';

export default class StoryDetailPage {
  #presenter = null;
  #form = null;
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
      apiModel: StoryAPI, // Corrected to use imported StoryAPI
    });

    // this.#setupForm(); // Removed or implement if a form exists and needs setup

    this.#presenter.showStoryDetail();
    // this.#presenter.getCommentsList(); // Removed as getCommentsList is not in StoryDetailPresenter
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailTemplate({
      title: story.title,
      description: story.description,
      evidenceImages: story.evidenceImages,
      location :story.location,
      userName: story.user.name,
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
    // this.addNotifyMeEventListener(); // Removed as addNotifyMeEventListener is not defined
  }

  populateStoryDetailError(message) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  /*
  clearForm() {
    this.#form.reset();
  }
  */

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

  /*
  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
  */
}
