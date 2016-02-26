'use strict';

const bloodyTester = require('../');
const Person = require('./helpers/actors/person');
const test = require('ava');

const lazy = bloodyTester.lazy;

let tester = bloodyTester.createTester(1234);
test.afterEach(async () => {
  await tester.cleanup();
});

test('use an actor\'s id attribute lazily', async t => {
  let scene = tester.createScene();
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum', parent: null});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling', parent: lazy('guido')});
  t.same(scene.getActor('james'), {id: 12341235, name: 'James Gosling', parent: 12341234});
});

test('use an actor\'s any attribute lazily', async t => {
  let scene = tester.createScene();
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum', parentName: null});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling', parentName: lazy('guido', 'name')});
  t.same(scene.getActor('james'), {id: 12341235, name: 'James Gosling', parentName: 'Guido van Rossum'});
});

test('with multiple load', async t => {
  let scene = tester.createScene();
  await scene.loadActors([
    {id: 'guido', type: Person, instance: {id: 12341234, name: 'Guido van Rossum', parent: null}},
    {id: 'james', type: Person, instance: {id: 12341235, name: 'James Gosling', parent: lazy('guido')}}
  ]);
  t.same(scene.getActor('james'), {id: 12341235, name: 'James Gosling', parent: 12341234});
});
