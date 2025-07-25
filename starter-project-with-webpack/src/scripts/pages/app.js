// File: src/scripts/pages/app.js

import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnauthenticatedNavigationListTemplate,
  generateUnsubscribeButtonTemplate,
} from '../template';
import { setupSkipToContent, transitionHelper,isServiceWorkerAvailable } from '../utils/index';
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification-helper';

import { getAccessToken, getLogout } from '../utils/auth';

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    this.#drawerNavigation.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && this.#drawerNavigation.contains(link)) {
        this.#drawerNavigation.classList.remove('open');
      }
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);
      const isDrawerOpen = this.#drawerNavigation.classList.contains('open');

      if (isDrawerOpen && !isTargetInsideDrawer && !isTargetInsideButton) {
        this.#drawerNavigation.classList.remove('open');
      }
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#drawerNavigation.querySelector('.navigation-drawer__navlist-main');
    const navList = this.#drawerNavigation.querySelector('.navigation-drawer__navlist');

    if (!isLogin || !navListMain || !navList) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (confirm('Apakah Anda yakin ingin keluar?')) {
          getLogout();

          location.hash = '/login';
        }
      });
    }
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');

    if (!pushNotificationTools) {
      console.warn("Elemen dengan ID 'push-notification-tools' tidak ditemukan. Melewati pengaturan notifikasi push.");
      return;
    }

    if (isServiceWorkerAvailable()) {
      try {
        await navigator.serviceWorker.ready; 
        const isSubscribed = await isCurrentPushSubscriptionAvailable();
        if (isSubscribed) {
          pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
          document.getElementById('unsubscribe-button').addEventListener('click', () => {
            unsubscribe().finally(() => {
              this.#setupPushNotification();
            });
          });
        } else {
          pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
          document.getElementById('subscribe-button').addEventListener('click', () => {
            subscribe().finally(() => {
              this.#setupPushNotification();
            });
          });
        }
      } catch (error) {
        console.error('Error during push notification setup:', error);
        pushNotificationTools.innerHTML = ''; 
      }
    } else {
      console.log('Service Worker API unsupported or not available.');
      pushNotificationTools.innerHTML = ''; 
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const routeHandler = routes[url];

    if (!routeHandler) {
      console.error(`No route found for URL: ${url}`);
      this.#content.innerHTML = '<h1>404 - Page Not Found</h1><p>Sorry, the page you are looking for does not exist.</p>';
      this.#setupNavigationList();
      scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const page = routeHandler();
    if (!page) {
      return;
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        if (page.afterRender) {
          page.afterRender();
        }
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();
      this.#setupPushNotification();
    });
  }
}