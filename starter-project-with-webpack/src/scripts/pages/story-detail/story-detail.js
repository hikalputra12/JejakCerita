import {storyMapper} from '../../data/api-mapper'; //
export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;

  constructor(storyId, { view, apiModel }) {
    this.#storyId = storyId; // Corrected from reportId
    this.#view = view;
    this.#apiModel = apiModel;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      // Assuming API returns story object within a data key and storyMapper expects the story object directly.
      const response = await this.#apiModel.getDetailStory(this.#storyId); // Corrected from getStoryById

      if (!response.ok) {
        console.error('showStoryDetailAndMap: response:', response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }
      const story = await storyMapper(response.data.story); // Corrected from response.data, assuming API returns story object within a data key
      console.log(story); // for debugging purpose, remove after checking it

      this.#view.populateStoryDetailAndInitialMap(response.message, story); // Corrected from report
    } catch (error) {
      console.error('showStoryDetailAndMap: error:', error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  showSaveButton() {
    if (this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  #isStorySaved() {
    return false;
  }
}