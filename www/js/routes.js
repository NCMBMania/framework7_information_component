const routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/gallery/:name',
    componentUrl: './pages/gallery.html',
  },
  {
    path: '/information',
    componentUrl: './pages/information.html',
  },
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
