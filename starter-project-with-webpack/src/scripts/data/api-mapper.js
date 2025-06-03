import Map from '../utils/map';

export async function storyMapper(story) {
  let mappedLatitude = 0;
  let mappedLongitude = 0;
  let placeName = '';

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

  let finalUserId = 'unknown';
  let finalUserName = 'Pengguna Tidak Diketahui';

  if (story.user && typeof story.user === 'object') {
    finalUserId = story.user.id || story.userId || 'unknown';
    finalUserName = (typeof story.user.name === 'string' && story.user.name.trim() !== '')
      ? story.user.name
      : 'Pengguna Tidak Diketahui';
  } else {
    finalUserId = story.userId || 'unknown';
    if (typeof story.name === 'string' && story.name.trim() !== '') {
      finalUserName = story.name;
    }
  }

  const finalUser = {
    id: finalUserId,
    name: finalUserName,
  };

  let storyImages = [];
  if (story.photoUrl && typeof story.photoUrl === 'string') {
    storyImages = [story.photoUrl];
  } else if (Array.isArray(story.photo)) {
    storyImages = story.photo;
  }

  return {
    ...story,
    location: locationData,
    user: finalUser,
    storyImages: storyImages,
  };
}