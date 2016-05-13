# bloody-tester

> Go do some unit tests you bloody tester!

A test toolkit to manage sessions, scenes and actors in API tests.

## Introduction

While running API tests, it's really common to initialise some instances needed
to test an API and clean them up after the test finishes. Commonly there are
many helpers for this chores in MVC frameworks like RoR or Django.

In the Node.js world, it is not very common to use these all-in-one MVC
frameworks to build a web server. Rather, we love to compose microframeworks
like Express and Mocha. Building our own stack is enjoyable, but it's hard and
somewhat annoying to implement our own initialisation and cleanup methods for
tests.

**bloody-tester** is a test toolkit to help us do API tests without any hassle.

## Example

Here is an example to see the look-and-feel of **bloody-tester**.

```js
let tester = require('bloody-tester').createTester(8080).withAJAX();

let scene = tester.createScene();

test.before(() => scene.loadActors([
  {id: 'user1', type: User, instance: {name: 'John'}},
  {id: 'user2', type: User, instance: {name: 'Smith'}},
  {id: 'user3', type: User, instance: {name: 'Parker'}}
]);
test.after(() => scene.cleanup());

test(async t => {
  // login
  await tester.post('/login', {id: 'admin'});

  // get users
  let res = await tester.get('/users');

  t.is(res.status, 200);
  t.is(res.data.length, 3);
});
```

As we can see in the example above, **bloody-tester** provides following key
features.

- Initialisation and cleanup of instances using Scene and Actor
- HTTP client with AJAX and session support

## Install

```
$ npm install --save-dev bloody-tester
```

## API Documentation

### Tester

A top-level tester to manage scenes and send HTTP requests

###### Creation

```js
let tester = require('bloody-tester').createTester(1234);
```

`createTester` gets a parameter `host`, which can be a `number` or `string`.
- If it's a number, the base URL will be `http://localhost:{host}`.
- If it's a string,
  - If it contains `://`, it becomes the base URL, `{host}`.
  - Otherwise, the base URL will be `http://{host}`

###### Methods

- **`tester.setHost(host)`**: it sets a host as same as creation does.
- **`tester.withAJAX()`**: if called, it sends the AJAX header with requests.
  - `X-Requested-With: XMLHttpRequest`
- **`tester.disableCookie()`**: it disables cookie usage, i.e. session.
- **`tester.createScene()`**: it creates a scene in itself.
  - `Scene` will be explained in the following section.
- **`tester.destroyScene(scene)`**: it destroys a scene in itself.
  - It returns `Promise<Undefined>`.
- **`tester.cleanup()`**: it destroys all the scenes in itself.
  - It returns `Promise<Undefined>`.
- **`tester.get(url, data, header)`**: it sends a GET request.
- **`tester.post(url, data, header)`**: it sends a POST request.
- **`tester.put(url, data, header)`**: it sends a PUT request.
- **`tester.delete(url, data, header)`**: it sends a DELETE request.
- **`tester.head(url, data, header)`**: it sends a HEAD request.
- **`tester.patch(url, data, header)`**: it sends a PATCH request.
  - `url` is a `string`.
    - If it starts with `/`, it will be appended at the end of the base URL
      set by `createTester(host)` or `setHost(host)`.
    - Otherwise, it will be used as it is.
  - `data` is an object for query or data.
    - For `GET`, `DELETE` and `HEAD`, it will be sent as query parameters.
    - Otherwise, it will be sent as a HTTP request body.
    - The HTTP request body is decided by `Content-Type` in `header`.
      - `application/json`: default
      - `application/x-www-form-urlencoded`
      - `multipart/form-data`
  - `header` is an object for HTTP headers.
  - It returns `Promise<Response>`.
    - `Response`: `{status: number, data: object|string, headers: object}`

### Scene

A scene instance to manage actors

###### Creation

```js
let scene = tester.createScene();
```

###### Methods

- **`scene.createActor(actorId, actorType, actorObj)`**: it creates an actor.
  - `actorId` is a `string` identifying the created actor.
  - `actorType` is an `Actor` object.
    - `Actor` will be described in the next section.
  - `actorObj` is an object to be passed to the `Actor`'s `create` method.
  - It returns `Promise<Undefined>`.
- **`scene.loadActors(actors)`**: it creates multiple actors at once.
  - `actors` is `Array<{id: string, type: Actor, instance: object}>`
  - An example is at the end of this section.
  - It returns `Promise<Undefined>`.
- **`scene.destroyActor(actor)`**: it destroys an actor.
  - `actor` is an `Actor` instance.
- **`scene.getActor(actorId)`**: it returns an actor for the provided id.
  - `actorId` is a `string` refering to a valid actor id.
  - It actually returns an object once created by the `Actor`'s `create` method.
- **`scene.cleanup()`**: it cleans up all the actors in itself.
  - It returns `Promise<Undefined>`.

###### `loadActors` example
```js
const lazy = require('bloody-tester').lazy;

scene.loadActors([
  {
    id: 'user',
    type: UserActor,
    instance: {
      username: 'noraesae',
      password: 'noraesae'
    }
  },
  {
    id: 'char1',
    type: CharacterActor,
    instance: {
      userId: lazy('user'),
      name: 'warlock1'
    }
  }
]);
```

`lazy` is used to retrieve a property of another actor which is not decided at
the moment of actor definition. For example, `id` is usually decided when an
instance is inserted into a database. When setting a property with `lazy`, it
will be replaced with the actual value of the instance having the id.

- **`lazy(actorId, propertyName)`**
  - `actorId` is a `string` and an `id` of another actor.
  - `propertyName` is a `string` refering to a property of another actor.
    It is optional with `id` as its default value.

### Actor

`Actor` is actually not a class. It is just any normal JavaScript object having
`create` and `destroy` methods. In other words, any object with valid `create`
and `destroy` can be an `Actor`. The word 'valid' means that the methods should
meet the following forms.

- **`create(instance)`**: it creates an actor.
  - `instance` is an `object`. It is actually the object passed to
    `createActor` as `actorObj` or `loadActors` as `instance`.
  - It should return `Promise<object>`. The `object` will be saved in its
    scene and can be retrieved with `getActor`.
- **`destroy(object)`**: it destroys an actor.
  - `object` is actually the object created by the `create` method above.
  - It should clear the object from a database or a store if any.
  - It should return `Promise<any>`.

## Development

To clone the repo and run tests:

```
$ git clone https://github.com/openknowl/bloody-tester.git
$ cd bloody-tester
$ npm install
$ npm test
```

## License

[MIT](LICENSE)

Copyright (c) 2016 [OPENKNOWL](https://github.com/openknowl)
