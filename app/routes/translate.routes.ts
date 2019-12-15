export default (app: any) => {
  const translates = require('../controllers/translate.controller');

  app.post('/translate', translates.translate);

  app.get('/batchTranslate', translates.batchTranslate);
}