import { CONFIG } from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY_WITH_GUEST_ACCOUNT: `${CONFIG.BASE_URL}/stories/guest`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`, // Corrected to be a function that takes ID
  SUBSCRIBE_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/unsubscribe`,
};

export async function registerUser({ name, email, password }) {
  try {
    const data = JSON.stringify({ name, email, password });

    const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error('Error during registration API call:', error);
    return { error: true, message: 'Network error during registration. Please try again.' };
  }
}

export async function loginUser({ email, password }) {
  try {
    const data = JSON.stringify({ email, password });

    const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });
    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error('Error during login API call:', error);
    return { error: true, message: 'Network error during login. Please try again.' };
  }
}

// Ensure getAccessToken is imported from auth.js as it's used here.
import { getAccessToken } from '../utils/auth';

export async function addNewStory(
  description,
  storyImages, // Renamed from imagesStory for consistency
  latitude,
  longitude,
) {
  try {
    const accessToken = getAccessToken();

    const formData = new FormData();
    formData.set('description', description); // Tetap menggunakan 'description'
    formData.set('lat', latitude); // Mengubah 'latitude' menjadi 'lat'
    formData.set('lon', longitude); // Mengubah 'longitude' menjadi 'lon'
    storyImages.forEach((imageFile) => { // Renamed from evidenceImages for consistency, and added 'photo' for API field
      formData.append('photo', imageFile); // API expects 'photo' for image files
    });

    const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    const json = await fetchResponse.json();

    // Check if response is ok, otherwise return error explicitly
    if (!fetchResponse.ok) {
        return { error: true, message: json.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return {
      ...json,
      ok: fetchResponse.ok,
    };

  } catch (error) {
    console.error('Error during add new story API call:', error);
    return { error: true, message: 'Network error when adding story. Please try again.' };
  }
}

export async function addNewStoryWithGuestAccount(storyData) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY_WITH_GUEST_ACCOUNT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storyData),
    });
    const responseJson = await fetchResponse.json();
    console.log('Add New Story Guest API Response:', responseJson);

    if (!fetchResponse.ok) {
      return { error: true, message: responseJson.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return responseJson;
  } catch (error) {
    console.error('Error during add new story as guest API call:', error);
    return { error: true, message: 'Network error when adding guest story. Please try again.' };
  }
}

export async function getAllStories() { // Removed token parameter as it's fetched internally
  try {
    const accessToken = getAccessToken(); // Ensure getAccessToken is imported or defined

    const fetchResponse = await fetch(ENDPOINTS.GET_ALL_STORIES, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await fetchResponse.json();

    if (!fetchResponse.ok) {
      return { error: true, message: json.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error('Error during get all stories API call:', error);
    return { error: true, message: 'Network error when fetching stories. Please try again.' };
  }
}

export async function getDetailStory(id) {
  try {
    const accessToken = getAccessToken(); // Ensure getAccessToken is imported or defined

    const fetchResponse = await fetch(ENDPOINTS.DETAIL_STORY(id), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await fetchResponse.json();

    if (!fetchResponse.ok) {
      return { error: true, message: json.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    console.error('Error during get detail story API call:', error);
    return { error: true, message: 'Network error when fetching story detail. Please try again.' };
  }
}

export async function subscribeNotification(subscription, token) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE_NOTIFICATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });
    const responseJson = await fetchResponse.json();
    console.log('Subscribe Notification API Response:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Error during subscribe notification API call:', error);
    return { error: true, message: 'Network error during subscription. Please try again.' };
  }
}

export async function unsubscribeNotification(endpoint, token) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE_NOTIFICATION, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });
    const responseJson = await fetchResponse.json();
    console.log('Unsubscribe Notification API Response:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Error during unsubscribe notification API call:', error);
    return { error: true, message: 'Network error during unsubscription. Please try again.' };
  }
}