import { storyMapper } from '../../data/api-mapper';

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStoriesListError(response.message);
        return;
      }

      const mappedStories = await Promise.all(
        response.listStory.map(async (singleStory) => await storyMapper(singleStory)),
      );
      console.log(mappedStories);

      this.#view.populateStoriesList(response.message, mappedStories);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}