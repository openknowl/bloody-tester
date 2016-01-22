'use strict';

let list = exports.list = [];

exports.create = (obj) => {
  list.push(obj);
  return Promise.resolve(obj);
};

exports.destroy = (obj) => {
  let idx = list.findIndex(person => {
    return person.id !== obj.id;
  });
  list.splice(idx, 1);
  return Promise.resolve();
};
