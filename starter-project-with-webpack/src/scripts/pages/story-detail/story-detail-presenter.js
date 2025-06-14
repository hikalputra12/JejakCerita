import { storyMapper } from '../../data/api-mapper';

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;
  #storyData; // Menambahkan properti untuk menyimpan data cerita

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
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
      const response = await this.#apiModel.getDetailStory(this.#storyId);

      if (!response.ok) {
        console.error('showStoryDetailAndMap: response:', response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }
      this.#storyData = await storyMapper(response.story); // Simpan data cerita yang dipetakan
      console.log(this.#storyData);

      this.#view.populateStoryDetailAndInitialMap(response.message, this.#storyData); // Gunakan data yang disimpan
      this.showSaveButton(); // Panggil ini setelah data cerita tersedia
    } catch (error) {
      console.error('showStoryDetailAndMap: error:', error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  async saveStory() {
    try {
      if (!this.#storyData) {
        console.error('saveStory: story data is not available.');
        this.#view.saveToBookmarkFailed('Data cerita tidak tersedia untuk disimpan.');
        return;
      }
      await this.#dbModel.putStory(this.#storyData);
      this.#view.saveToBookmarkSuccessfully('Berhasil di tambahkan ke cerita favorit');
      this.showSaveButton(); // Perbarui tombol setelah menyimpan
    } catch (error) {
      console.error('saveStory: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async #isStorySaved() {
    try {
      // Coba ambil cerita dari IndexedDB
      const story = await this.#dbModel.getStory(this.#storyId);
      return !!story; // Mengembalikan true jika cerita ditemukan, false jika tidak
    } catch (error) {
      console.error('Error checking if story is saved:', error);
      return false;
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) { // Panggil dengan await
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }
  
}