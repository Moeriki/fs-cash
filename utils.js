'use strict';

exports.identity = (arg0) => arg0;

exports.promisify = (func) => new Promise((resolve, reject) => {
  func((err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});
