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