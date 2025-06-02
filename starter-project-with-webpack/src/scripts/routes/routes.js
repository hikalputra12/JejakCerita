//berkas untuk menentukan jalur rute
import RegisterPage from '../pages/auth/register/register-page'; // Corrected path
import LoginPage from '../pages/auth/login/login-page'; // Corrected path
import HomePage from '../pages/home/home-page'; //
import AboutPage from '../pages/about/about-page'; // Assuming this is the correct about page path
import AddStoryPage from '../pages/new-story/new-story-page'; // Corrected path and name
import DetailStoryPage from '../pages/story-detail/story-detail-presenter'; // Assuming this is the DetailStoryPage view
import BookmarkPage from '../pages/bookmark/bookmark-page'; // Assuming this is the correct bookmark page path
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth'; //

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new': () => checkAuthenticatedRoute(new AddStoryPage()), // Changed to /new based on common practice for new entries
  '/stories/:id': () => checkAuthenticatedRoute(new DetailStoryPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  '/about': () => checkAuthenticatedRoute(new AboutPage()),
};

export default routes;