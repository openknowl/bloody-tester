'use strict';

const bloodyTester = require('../');
const Person = require('./helpers/actors/person');
const test = require('ava');
const testServer = require('./helpers/test-server');

let tester = bloodyTester.createTester(1234);

let server;
test.before.cb(t => {
  server = testServer.listen(1234, t.end);
});

test.after.cb(t => {
  server.close(t.end);
});

test.afterEach(async () => {
  tester.cleanup();
});

test('create a scene', async t => {
  let scene = await tester.createScene();
  t.ok(scene);

  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});
  t.is(Person.list.length, 2);
  t.same(scene.getActor('guido'), {id: 12341234, name: 'Guido van Rossum'});

  await scene.destroyActor('guido');
  t.is(Person.list.length, 1);
});

test('initialize a scene with instances', async t => {
  let scene = await tester.createScene([
    {id: 'guido', type: Person, instance: {id: 12341234, name: 'Guido van Rossum'}},
    {id: 'james', type: Person, instance: {id: 12341235, name: 'James Gosling'}}
  ]);

  t.is(Person.list.length, 2);
  t.same(scene.getActor('guido'), {id: 12341234, name: 'Guido van Rossum'});

  await scene.cleanup();
  t.is(Person.list.length, 0);
});

test('register after inserting with HTTP', async t => {
  let scene = await tester.createScene();
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  await tester.post('/person', {id: 12341237, name: 'Graham Coxon'})
    .then(res => scene.registerActor('graham', Person, res.data));
  t.is(Person.list.length, 3);
  t.same(scene.getActor('graham'), {id: 12341237, name: 'Graham Coxon'});

  await scene.cleanup();
  t.is(Person.list.length, 0);
});

test('destroy a scene', async t => {
  let scene1 = await tester.createScene();
  await scene1.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene1.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  let scene2 = await tester.createScene();
  await scene2.createActor('graham', Person, {id: 12341237, name: 'Graham Coxon'});

  t.is(Person.list.length, 3);

  await tester.destroyScene(scene1);
  t.is(Person.list.length, 1);

  await tester.destroyScene(scene2);
  t.is(Person.list.length, 0);
});

test('cleanup', async t => {
  let scene1 = await tester.createScene();
  await scene1.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene1.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  let scene2 = await tester.createScene();
  await scene2.createActor('graham', Person, {id: 12341237, name: 'Graham Coxon'});

  t.is(Person.list.length, 3);

  await tester.cleanup();
  t.is(Person.list.length, 0);
});
