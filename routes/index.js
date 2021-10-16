module.exports = [
  {
    prefix: '/api',
    route: require('./auth'),
  },
  {
    prefix: '/api',
    route: require('./user'),
  },
  {
    prefix: '/api/category',
    route: require('./category'),
  },
];
