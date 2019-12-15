import axios from 'axios';

import config from '../config';

exports.status = (req: any, res: any) => {
  axios.get(`${config.weglotApiUrl}/public/status`)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
};

exports.languages = (req: any, res: any) => {
  axios.get(`${config.weglotApiUrl}/public/languages`)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
};

exports.isSupported = (req: any, res: any) => {
  axios.get(`${config.weglotApiUrl}/public/languages/is-supported?languageFrom=${req.query.languageFrom}&languageTo=${req.query.languageTo}`)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
};