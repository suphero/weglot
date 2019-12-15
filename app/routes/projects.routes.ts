export default (app: any) => {
  const projects = require('../controllers/projects.controller');

  app.get('/projects/owner', projects.owner);

  app.get('/projects/settings', projects.getSettings);

  app.post('/projects/settings', projects.postSettings);

  app.get('/projects-settings/:api_key.json', projects.getCdnSettings);
}