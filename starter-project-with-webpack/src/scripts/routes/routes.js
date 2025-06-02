//berkas untuk menentukan jalur rute
import RegisterPage from '../pages/register/register-page';
import LoginPage from '../pages/login/login-page';
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailStoryPage from '../pages/detail-story/detail-story-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/add': () => checkAuthenticatedRoute(new AddStoryPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new DetailStoryPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  '/about': () => checkAuthenticatedRoute(new AboutPage()),
};

export default routes;
