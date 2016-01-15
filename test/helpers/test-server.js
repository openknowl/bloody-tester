'use strict';

const bodyParser = require('body-parser');
const express = require('express');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.end('hello, get');
});

app.post('/', (req, res) => {
  res.end('hello, post');
});

app.put('/', (req, res) => {
  res.end('hello, put');
});

app.delete('/', (req, res) => {
  res.end('hello, delete');
});

app.get('/query', (req, res) => {
  res.json(req.query);
});

app.post('/body', (req, res) => {
  res.json(req.body);
});

module.exports = app;
