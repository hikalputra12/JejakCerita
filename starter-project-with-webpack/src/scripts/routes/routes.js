import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page'; 
import HomePage from '../pages/home/home-page'; 
import AboutPage from '../pages/about/about-page'; 
import AddStoryPage from '../pages/new-story/new-story-page'; 
import DetailStoryPage from '../pages/story-detail/story-detail'; 
import BookmarkPage from '../pages/bookmark/bookmark-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth'; 

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new': () => checkAuthenticatedRoute(new AddStoryPage()), 
  '/stories/:id': () => checkAuthenticatedRoute(new DetailStoryPage()),
  '/about': () => checkAuthenticatedRoute(new AboutPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};

export default routes;