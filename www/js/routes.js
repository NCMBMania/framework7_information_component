const routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/list/entries/:objectId',
    componentUrl: './pages/detail.html',
  },
  {
    path: '/list/:objectId',
    componentUrl: './pages/list.html',
  },
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
