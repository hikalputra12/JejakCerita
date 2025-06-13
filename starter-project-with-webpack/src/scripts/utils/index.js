export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Dummy implementations for missing functions (replace with actual logic if available)
export function setupSkipToContent(skipLinkButton, contentElement) {
    if (skipLinkButton && contentElement) {
        skipLinkButton.addEventListener('click', (event) => {
            event.preventDefault();
            contentElement.focus();
        });
    }
}

export function transitionHelper({ updateDOM }) {
    let resolveTransition;
    const transitionPromise = new Promise(resolve => {
        resolveTransition = resolve;
    });

    const updateCallbackDone = updateDOM();

    Promise.resolve(updateCallbackDone).then(() => {
        resolveTransition();
    });

    return {
        ready: transitionPromise,
        updateCallbackDone: Promise.resolve(updateCallbackDone),
    };
}

// Assuming createCarousel and convertBase64ToBlob are also utility functions
// Ensure tiny-slider is properly initialized and available globally or imported specifically where createCarousel is used.
export function createCarousel(element) {
  if (element && typeof tns !== 'undefined') { // Assuming tns is globally available from tiny-slider
    tns({
      container: element,
      items: 1,
      slideBy: 'page',
      autoplay: true,
      autoplayButtonOutput: false,
      nav: true,
      controls: true,
    });
  } else {
    console.warn('Carousel element or tiny-slider not found for createCarousel. Make sure tiny-slider is installed and loaded.');
  }
}

export function convertBase64ToBlob(base64, mimeType) {
  return new Promise((resolve, reject) => {
    try {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}
export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}
 
export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log('Service Worker API unsupported');
    return;
  }
 
  try {
    const registration = await navigator.serviceWorker.register('/sw.bundle.js');
    console.log('Service worker telah terpasang', registration);
  } catch (error) {
    console.log('Failed to install service worker:', error);
  }
}
export function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}