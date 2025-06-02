// CSS imports
import '../styles/styles.css';
import '../styles/responsives.css'; // Added this line back for completeness, create the file if it doesn't exist
import 'tiny-slider/dist/tiny-slider.css'; // This dependency needs to be installed: npm install tiny-slider
import 'leaflet/dist/leaflet.css'; //menerapkan leaflet css ke index.js

// Components
import App from './pages/app';
import Camera from './utils/camera';
import { setupSkipToContent, transitionHelper } from './utils'; // Added imports for setupSkipToContent and transitionHelper

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    // Stop all active media
    Camera.stopAllStreams();
  });
});