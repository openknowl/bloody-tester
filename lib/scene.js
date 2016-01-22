'use strict';

const _ = require('lodash');
const Lazy = require('./lazy');

class Scene {
  constructor() {
    this.actors = [];
  }

  createActor(actorId, actorType, actorObj) {
    let newInstance = _.mapValues(actorObj, attr => {
      return Lazy.isLazy(attr) ? attr.getFrom(this) : attr;
    });

    return actorType.create(newInstance)
      .then(instance => this.registerActor(actorId, actorType, instance));
  }

  destroyActor(actorId) {
    let actor = this.findActor(actorId);
    return actor.type.destroy(actor.instance)
      .then(() => this.unregisterActor(actorId));
  }

  registerActor(actorId, actorType, actor) {
    this.actors.push({
      id: actorId,
      type: actorType,
      instance: actor
    });
  }

  unregisterActor(actorId) {
    this.actors = this.actors.filter(actor => actor.id !== actorId);
  }

  findActor(actorId) {
    return this.actors.find(actor => actor.id === actorId);
  }

  getActor(actorId) {
    return this.findActor(actorId).instance;
  }

  cleanup() {
    let clean = () => {
      let actor = _.last(this.actors);

      if (_.isUndefined(actor)) {
        return Promise.resolve();
      }

      return this.destroyActor(actor.id)
        .then(() => clean());
    };

    return clean();
  }
}

module.exports = Scene;
