'use strict';

const Tester = require('./lib/tester');

exports.createTester = (host) => new Tester(host);
