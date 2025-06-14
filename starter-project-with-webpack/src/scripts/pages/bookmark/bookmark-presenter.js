import { storyMapper } from '../../data/api-mapper'; // Sesuaikan dari reportMapper

export default class BookmarkPresenter {
  #view;
  #dbModel; // Sesuaikan dari #model

  constructor({ view, dbModel }) { // Sesuaikan parameter dari model menjadi dbModel
    this.#view = view;
    this.#dbModel = dbModel; // Sesuaikan dari this.#model
  }

  async initialGalleryAndMap() {
    this.#view.showStoriesListLoading(); // Sesuaikan dari showReportsListLoading

    try {
      const listOfStories = await this.#dbModel.getAllStories(); // Sesuaikan dari #model.getAllReports()
      const stories = await Promise.all(listOfStories.map(storyMapper)); // Sesuaikan dari reports dan reportMapper

      const message = 'Berhasil mendapatkan daftar cerita favorit.'; // Sesuaikan pesan
      this.#view.populateBookmarkedStories(message, stories); // Sesuaikan dari populateBookmarkedReports
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedStoriesError(error.message); // Sesuaikan dari populateBookmarkedReportsError
    } finally {
      this.#view.hideStoriesListLoading(); // Sesuaikan dari hideReportsListLoading
    }
  }
}