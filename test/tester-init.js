'use strict';

const bloodyTester = require('../');
const test = require('ava');

test('init without host', t => {
  let tester = bloodyTester.createTester();
  t.notOk(tester.host);
});

test('init with full host', t => {
  let tester = bloodyTester.createTester('https://localhost:1234');
  t.is(tester.host, 'https://localhost:1234');
});

test('init without protocol', t => {
  let tester = bloodyTester.createTester('localhost:1234');
  t.is(tester.host, 'http://localhost:1234');
});

test('init with port', t => {
  let tester = bloodyTester.createTester(1234);
  t.is(tester.host, 'http://localhost:1234');
});
