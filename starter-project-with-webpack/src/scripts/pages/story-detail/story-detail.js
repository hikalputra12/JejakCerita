import {
  generateLoaderAbsoluteTemplate,
  generateStoriesDetailErrorTemplate,
  generateStoryDetailTemplate,
  generateAddFavoriteButtonTemplate,
  generateRemoveFavoriteButtonTemplate,
} from '../../template';
import { createCarousel } from '../../utils';
import StoryDetailPresenter from './story-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import * as StoryAPI from '../../data/api';
import Database from '../../data/database';

export default class StoryDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

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
      dbModel: Database,
    });

    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById('story-detail').innerHTML = generateStoryDetailTemplate({
      title: story.name,
      description: story.description,
      storyImages: story.storyImages,
      location: story.location,
      userName: story.user.name,
      createdAt: story.createdAt,
    });

    const carouselElement = document.getElementById('images');
    if (carouselElement) {
      createCarousel(carouselElement);
    } else {
      console.warn('Carousel element with ID "images" not found. Ensure it is in generateStoryDetailTemplate.');
    }

    await this.#presenter.showStoryDetailMap();
    if (this.#map) {
      const storyCoordinate = [story.location.latitude, story.location.longitude];
      const markerOptions = { alt: story.name || 'Story Location' };
      const popupOptions = { content: story.name + ' - ' + story.location.placeName };
      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    await this.#presenter.showSaveButton();
  }

  populateStoryDetailError(message) {
    const storyDetailElement = document.getElementById('story-detail');
    if (storyDetailElement) {
      storyDetailElement.innerHTML = generateStoriesDetailErrorTemplate(message);
    } else {
      console.error("Element with ID 'story-detail' not found to populate error.");
    }
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
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

  renderSaveButton() {
    document.getElementById('save-story-container').innerHTML =
      generateAddFavoriteButtonTemplate();

    document.getElementById('add-favorite-button').addEventListener('click', async () => {
      await this.#presenter.saveStory();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-story-container').innerHTML =
      generateRemoveFavoriteButtonTemplate();

    document.getElementById('remove-favorite-button').addEventListener('click', async () => {
      await this.#presenter.removeStory();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }

  removeFromBookmarkFailed(message) {
    alert(message);
  }
}