'use strict';

const bloodyTester = require('../');
const test = require('ava');

test('init with full host', t => {
  let tester = bloodyTester.createTester();
  tester.setHost('https://localhost:1234');
  t.is(tester.host, 'https://localhost:1234');
});

test('init without protocol', t => {
  let tester = bloodyTester.createTester();
  tester.setHost('localhost:1234');
  t.is(tester.host, 'http://localhost:1234');
});

test('init with port', t => {
  let tester = bloodyTester.createTester();
  tester.setHost(1234);
  t.is(tester.host, 'http://localhost:1234');
});
