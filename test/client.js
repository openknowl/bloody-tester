'use strict';

const client = require('../lib/client');
const fs = require('fs');
const path = require('path');
const test = require('ava');
const testServer = require('./helpers/test-server');

let server;
test.before.cb(t => {
  server = testServer.listen(1235, t.end);
});

test.after.cb(t => {
  server.close(t.end);
});

test('send GET request', async t => {
  const res = await client.get('http://localhost:1235');
  t.is(res.data, 'hello, get');
});

test('send POST request', async t => {
  const res = await client.post('http://localhost:1235');
  t.is(res.data, 'hello, post');
});

test('send PUT request', async t => {
  const res = await client.put('http://localhost:1235');
  t.is(res.data, 'hello, put');
});

test('send DELETE request', async t => {
  const res = await client.delete('http://localhost:1235');
  t.is(res.data, 'hello, delete');
});

test('send request with query string', async t => {
  const res = await client.get('http://localhost:1235/query?a=10&b=20');
  t.same(res.data, {a: '10', b: '20'});
});

test('send request with query object', async t => {
  const res = await client.get('http://localhost:1235/query', {a: '10', b: '20'});
  t.same(res.data, {a: '10', b: '20'});
});

test('send request with body', async t => {
  const res = await client.post('http://localhost:1235/body', {a: 10, b: 20});
  t.same(res.data, {a: 10, b: 20});
});

test('send request with headers', async t => {
  const res = await client.post('http://localhost:1235/headers', {}, {'custom-header': 'hello?'});
  t.is(res.data['custom-header'], 'hello?');
});

test('upload a file', async t => {
  let formData = {
    file: fs.createReadStream(path.join(__dirname, 'assets/test.txt'))
  };
  const res = await client.post('http://localhost:1235/file', formData, {'Content-Type': 'multipart/form-data'});
  t.is(res.data.originalname, 'test.txt');

  // check if an uploaded file exists
  fs.statSync(path.join(__dirname, 'uploads/test.txt'));
});
