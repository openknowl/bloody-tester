'use strict';

const Lazy = require('./lib/lazy');
const Tester = require('./lib/tester');

exports.createTester = (host) => new Tester(host);

exports.lazy = Lazy.createLazy;
