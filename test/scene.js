'use strict';

const Scene = require('../lib/scene');
const Person = require('./helpers/actors/person');
const test = require('ava');

let scene;

test.beforeEach(() => {
  scene = new Scene();
});

test.afterEach(async () => {
  await scene.cleanup();
});

test('initialize a scene', t => {
  t.ok(scene);
});

test('create an actor', async t => {
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  t.is(Person.list.length, 2);
});

test('load multiple actors', async t => {
  await scene.loadActors([
    {id: 'guido', type: Person, instance: {id: 12341234, name: 'Guido van Rossum'}},
    {id: 'james', type: Person, instance: {id: 12341235, name: 'James Gosling'}}
  ]);

  t.is(Person.list.length, 2);
  t.same(scene.getActor('guido'), {id: 12341234, name: 'Guido van Rossum'});

  await scene.cleanup();
  t.is(Person.list.length, 0);
});

test('don\'t destroy original load multiple actors', async t => {
  let actors = [
    {id: 'guido', type: Person, instance: {id: 12341234, name: 'Guido van Rossum'}},
    {id: 'james', type: Person, instance: {id: 12341235, name: 'James Gosling'}}
  ];
  await scene.loadActors(actors);
  t.is(Person.list.length, 2);
  t.same(scene.getActor('guido'), {id: 12341234, name: 'Guido van Rossum'});
  await scene.cleanup();
  t.is(Person.list.length, 0);

  await scene.loadActors(actors);
  t.is(Person.list.length, 2);
  t.same(scene.getActor('guido'), {id: 12341234, name: 'Guido van Rossum'});
  await scene.cleanup();
  t.is(Person.list.length, 0);
});

test('retrieve created actors', async t => {
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  t.same(scene.getActor('guido'), {id: 12341234, name: 'Guido van Rossum'});
  t.same(scene.getActor('james'), {id: 12341235, name: 'James Gosling'});
});

test('register an actor', async t => {
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  t.is(Person.list.length, 2);

  let adhocUser = {id: 12341236, name: 'Unknown Challanger'};
  Person.list.push(adhocUser);

  t.is(Person.list.length, 3);

  scene.registerActor('challanger', Person, adhocUser);

  await scene.cleanup();

  t.is(Person.list.length, 0);
});

test('destroy an actor', async t => {
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  t.is(Person.list.length, 2);

  await scene.destroyActor('guido');
  t.is(Person.list.length, 1);
});

test('cleanup', async t => {
  await scene.createActor('guido', Person, {id: 12341234, name: 'Guido van Rossum'});
  await scene.createActor('james', Person, {id: 12341235, name: 'James Gosling'});

  t.is(Person.list.length, 2);

  await scene.cleanup();

  t.is(Person.list.length, 0);
});
