export default (app: any) => {
  const publics = require('../controllers/public.controller');

  app.get('/public/status', publics.status);

  app.get('/public/languages', publics.languages);

  app.get('/public/languages/is-supported', publics.isSupported);
}