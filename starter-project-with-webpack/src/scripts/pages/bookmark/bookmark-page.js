import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate, // Sesuaikan dari generateReportItemTemplate
  generateStoriesListEmptyTemplate, // Sesuaikan dari generateReportsListEmptyTemplate
  generateStoriesListErrorTemplate, // Sesuaikan dari generateReportsListErrorTemplate
} from '../../template'; // Sesuaikan dari ../../templates
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
export default class BookmarkPage {
  #presenter = null; // Menambahkan ini agar bisa diinisialisasi di afterRender

  async render() {
    return `
      <section>
        <div class="stories-list__map__container"> 
          <div id="map" class="stories-list__map"></div> 
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar Cerita Favorit</h1> 

        <div class="stories-list__container"> 
          <div id="stories-list"></div> 
          <div id="stories-list-loading-container"></div> 
        </div>
      </section>
    `;
  }

  async afterRender() {
       this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  populateBookmarkedStories(message, stories) { // Sesuaikan dari populateBookmarkedReports, reports menjadi stories
    if (stories.length <= 0) {
      this.populateBookmarkedStoriesListEmpty(); // Sesuaikan dari populateBookmarkedReportsListEmpty
      return;
    }

    const html = stories.reduce((accumulator, story) => { // Sesuaikan dari report menjadi story
      return accumulator.concat(
        generateStoryItemTemplate({ // Sesuaikan dari generateReportItemTemplate
          ...story,
          // Sesuaikan dengan properti story Anda, misal:
          userName: story.user.name, // Sesuaikan dari reporterName, placeNameLocation
        }),
      );
    }, '');

    document.getElementById('stories-list').innerHTML = ` // Sesuaikan dari reports-list
      <div class="stories-list">${html}</div> // Sesuaikan dari reports-list
    `;
  }

  populateBookmarkedStoriesListEmpty() { // Sesuaikan dari populateBookmarkedReportsListEmpty
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate(); // Sesuaikan dari reports-list, generateReportsListEmptyTemplate
  }

  populateBookmarkedStoriesError(message) { // Sesuaikan dari populateBookmarkedReportsError
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message); // Sesuaikan dari reports-list, generateReportsListErrorTemplate
  }

  showStoriesListLoading() { // Sesuaikan dari showReportsListLoading
    document.getElementById('stories-list-loading-container').innerHTML = // Sesuaikan dari reports-list-loading-container
      generateLoaderAbsoluteTemplate();
  }

  hideStoriesListLoading() { // Sesuaikan dari hideReportsListLoading
    document.getElementById('stories-list-loading-container').innerHTML = ''; // Sesuaikan dari reports-list-loading-container
  }
}