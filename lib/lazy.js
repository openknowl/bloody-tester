'use strict';

class Lazy {
  constructor(actorId, actorAttr) {
    this.actorId = actorId;
    this.actorAttr = actorAttr;
  }

  getFrom(scene) {
    return scene.getActor(this.actorId)[this.actorAttr];
  }
}

Lazy.createLazy = (actorId, actorAttr) => {
  // for attribute, use 'id' by default
  actorAttr = actorAttr || 'id';

  return new Lazy(actorId, actorAttr);
};

Lazy.isLazy = (attr) => {
  return attr && attr.constructor === Lazy;
};

module.exports = Lazy;
