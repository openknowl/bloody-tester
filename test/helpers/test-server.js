'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Person = require('./actors/person');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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

app.post('/headers', (req, res) => {
  res.json(req.headers);
});

app.get('/ajax', (req, res) => {
  if (req.xhr) {
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

app.get('/cookie', (req, res) => {
  let increment = req.cookies.increment;

  increment = increment ? parseInt(increment, 10) + 1 : 1;

  res.cookie('increment', increment);
  res.json({increment});
});

app.post('/person', (req, res) => {
  Person.create(req.body);
  res.json(req.body);
});

app.get('/redirect', (req, res) => {
  res.redirect(req.query.to);
});

const upload = multer({dest: path.join(__dirname, '../uploads/')});
app.post('/file', upload.single('file'), (req, res) => {
  fs.renameSync(req.file.path, path.join(req.file.destination, req.file.originalname));
  res.json(req.file);
});

module.exports = app;
