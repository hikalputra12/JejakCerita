// src/scripts/data/story-db.js
import { openDB } from 'idb';

const DATABASE_NAME = 'jejakcerita-db'; // Nama database yang disesuaikan
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories'; // Nama object store yang disesuaikan

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        database.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: 'id', // Menggunakan 'id' sebagai kunci unik untuk setiap cerita
        });
      }
    },
  });

const Database = {
  async putStory(story) {
    if (!Object.hasOwn(story, 'id')) {
      throw new Error('`id` is required to save.');
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async getStory(id) { // Tambahkan fungsi ini
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
    async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
    async removeReport(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

};
export default Database;