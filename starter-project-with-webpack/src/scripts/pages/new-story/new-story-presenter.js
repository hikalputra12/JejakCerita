export default class NewStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, storyImages, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.addNewStory(
        description,
        storyImages,
        latitude,
        longitude,
      );

      if (!response.ok) {
        console.error('postNewStory: response:', response);
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('postNewStory: error:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}