//fungsi baru unutk menampung mapping data dan akan di implementasikan di berkas story detail presenter
import Map from '../utils/map';
 
export async function storyMapper(story) {
  return {
    ...story,
    location: {
      ...story.location,
      placeName: await Map.getPlaceNameByCoordinate(story.location.latitude, story.location.longitude),
    },
  };
}