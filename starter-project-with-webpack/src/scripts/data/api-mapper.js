//fungsi baru unutk menampung mapping data dan akan di implementasikan di berkas story detail presenter
import Map from '../utils/map'; //
 
export async function storyMapper(story) {
  // Location Mapping
  // Initialize with defaults, then update if story has lat/lon
  let mappedLatitude = 0;
  let mappedLongitude = 0;
  let placeName = '';
 
  // Check for lat and lon directly on the story object
  if (typeof story.lat === 'number' && typeof story.lon === 'number') {
    mappedLatitude = story.lat;
    mappedLongitude = story.lon;
    try {
      placeName = await Map.getPlaceNameByCoordinate(mappedLatitude, mappedLongitude);
    } catch (error) {
      console.error('Error fetching place name by coordinate:', error);
      placeName = 'Gagal mengambil nama lokasi';
    }
  } else {
    placeName = 'Lokasi Tidak Diketahui';
  }
 
  const locationData = {
    latitude: mappedLatitude,
    longitude: mappedLongitude,
    placeName: placeName,
  };
 
  // User Mapping
  // Handles story.user object if present, otherwise uses root story.name and story.userId
  let finalUserId = 'unknown';
  let finalUserName = 'Pengguna Tidak Diketahui';
 
  if (story.user && typeof story.user === 'object') { // If story.user object exists
    finalUserId = story.user.id || story.userId || 'unknown'; // Prioritize ID from story.user
    finalUserName = (typeof story.user.name === 'string' && story.user.name.trim() !== '')
      ? story.user.name
      : 'Pengguna Tidak Diketahui';
  } else { // Fallback to root properties if story.user is not an object
    finalUserId = story.userId || 'unknown'; // Use story.userId from root if available
    // Use story.name (root level) as user's name if available and it's a non-empty string
    if (typeof story.name === 'string' && story.name.trim() !== '') {
      finalUserName = story.name;
    }
  }
 
  const finalUser = {
    id: finalUserId,
    name: finalUserName,
  };
 
  // Story Images Mapping
  // Prioritizes story.photoUrl, then falls back to story.photo if it's an array
  let storyImages = [];
  if (story.photoUrl && typeof story.photoUrl === 'string') {
    storyImages = [story.photoUrl];
  } else if (Array.isArray(story.photo)) {
    storyImages = story.photo;
  }
 
  return {
    ...story, // Pertahankan properti story asli lainnya
    location: locationData, // Tetapkan objek location yang sudah dimapping
    user: finalUser, // Tetapkan objek user yang sudah difinalisasi
    storyImages: storyImages,
  };
}