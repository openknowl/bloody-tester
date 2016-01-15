'use strict';

let axios = require('axios');

const httpVerbs = ['get', 'post', 'put', 'delete', 'head', 'patch'];
const httpVerbsNoData = ['get', 'delete', 'head'];

function createClient() {
  let createRequester = (type) => {
    /**
     * function requester
     * ------
     * Send an HTTP request for the provided method type
     * @param string url request URL
     * @param object [data] query or body params
     * @param object [headers] headers
     **/
    return function requester(url, data, headers) {
      let config = {};
      config.headers = headers || {};

      if (httpVerbsNoData.indexOf(type) >= 0) {
        // The second argument to axios(data) will be config.
        // The third argument should not exist.
        config.params = data;
        data = config;
        config = undefined;
      }

      let handleRes = (res) => {
        // Parse JSON iff it's valid json string.
        try {
          res.data = JSON.parse(res.data);
        } catch (error) {
          if (error.name !== 'SyntaxError') {
            throw error;
          }
        }
        return res;
      };

      return axios[type](url, data, config)
        .then(handleRes)
        .catch(handleRes);
    };
  };

  let client = httpVerbs.reduce((methods, verb) => {
    methods[verb] = createRequester(verb);
    return methods;
  }, {});

  return client;
}

module.exports = createClient();
