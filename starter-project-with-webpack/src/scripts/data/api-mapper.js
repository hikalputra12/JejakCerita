//fungsi baru unutk menampung mapping data dan akan di implementasikan di berkas story detail presenter
import Map from '../utils/map'; //
 
export async function storyMapper(story) {
  let locationData = story.location;
  let placeName = '';

  // Memastikan locationData ada dan memiliki latitude serta longitude
  if (locationData && typeof locationData.latitude === 'number' && typeof locationData.longitude === 'number') {
    placeName = await Map.getPlaceNameByCoordinate(locationData.latitude, locationData.longitude); //
  } else {
    // Jika data lokasi tidak ada atau tidak valid, berikan nilai default
    locationData = {
      latitude: 0,
      longitude: 0,
      placeName: 'Lokasi Tidak Diketahui',
    };
    placeName = locationData.placeName;
  }

  // **PERBAIKAN YANG LEBIH ROBUST UNTUK DATA PENGGUNA**
  let finalUser = {
    id: story.userId || 'unknown', // Selalu berikan ID default atau dari story.userId
    name: 'Pengguna Tidak Diketahui', // Selalu berikan nama default
  };

  if (story.user && typeof story.user === 'object') {
    // Jika story.user ada dan merupakan objek, gabungkan propertinya
    // dan pastikan 'name' adalah string yang valid.
    finalUser = {
      ...story.user, // Gabungkan properti user yang sudah ada
      name: typeof story.user.name === 'string' ? story.user.name : 'Pengguna Tidak Diketahui',
    };
  }

  // Memastikan storyImages selalu berupa array, bahkan jika story.photo tidak ada atau bukan array.
  const storyImages = Array.isArray(story.photo) ? story.photo : [];

  return {
    ...story, // Pertahankan properti story asli lainnya
    location: {
      ...locationData,
      placeName: placeName,
    },
    user: finalUser, // Tetapkan objek user yang sudah difinalisasi
    storyImages: storyImages,
  };
}