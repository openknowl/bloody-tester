'use strict';

const bloodyTester = require('../');
const test = require('ava');
const testServer = require('./helpers/test-server');

let server;
test.before.cb(t => {
  server = testServer.listen(1234, t.end);
});

test.after.cb(t => {
  server.close(t.end);
});

test('send GET request', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.get('/');

  t.is(res.data, 'hello, get');
});

test('send POST request', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.post('/');

  t.is(res.data, 'hello, post');
});

test('send PUT request', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.put('/');

  t.is(res.data, 'hello, put');
});

test('send DELETE request', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.delete('/');

  t.is(res.data, 'hello, delete');
});

test('send request with query string', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.get('/query?a=10&b=20');

  t.same(res.data, {a: '10', b: '20'});
});

test('send request with query object', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.get('/query', {a: '10', b: '20'});

  t.same(res.data, {a: '10', b: '20'});
});

test('send request with body', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.post('/body', {a: 10, b: 20});

  t.same(res.data, {a: 10, b: 20});
});

test('send request with full path', async t => {
  let tester = bloodyTester.createTester(1234);
  const res = await tester.get('http://localhost:1234');
  t.same(res.data, 'hello, get');
});

test('send AJAX request', async t => {
  let tester = bloodyTester.createTester(1234);
  const res1 = await tester.get('/ajax');
  t.same(res1.status, 403);

  let ajaxTester = bloodyTester.createTester(1234).withAJAX();
  const res2 = await ajaxTester.get('/ajax');
  t.same(res2.status, 200);
});

test('preserve cookies', async t => {
  let tester = bloodyTester.createTester(1234);
  let res = await tester.get('/cookie');
  t.same(res.data.increment, 1);

  res = await tester.get('/cookie');
  t.same(res.data.increment, 2);
  res = await tester.get('/cookie');
  t.same(res.data.increment, 3);
});
