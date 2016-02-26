'use strict';

let request = require('request');

const httpVerbs = ['get', 'post', 'put', 'delete', 'head', 'patch'];
const httpVerbsNoData = ['get', 'delete', 'head'];

function getContentType(headers) {
  return headers['Content-Type'] || headers['content-type'];
}

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
      data = data || {};
      headers = headers || {};

      let options = {
        url,
        headers,
        method: type.toUpperCase(),
        followRedirect: false
      };

      let contentType = getContentType(headers);

      if (httpVerbsNoData.indexOf(type) < 0) {
        if (contentType === 'application/x-www-form-urlencoded') {
          options.form = data;
        } else if (contentType === 'multipart/form-data') {
          options.formData = data;
        } else {
          headers['Content-Type'] = 'application/json';
          options.body = JSON.stringify(data);
        }
      } else {
        options.qs = data;
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
        res.status = res.statusCode;
        return res;
      };

      return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
          if (err) {
            reject(err);
            return;
          }

          res.data = body;
          res.status = res.statusCode;
          resolve(handleRes(res));
        });
      });
    };
  };

  let client = httpVerbs.reduce((methods, verb) => {
    methods[verb] = createRequester(verb);
    return methods;
  }, {});

  return client;
}

module.exports = createClient();
