'use strict';

exports.promisify = (func) => new Promise((resolve, reject) => {
  func((err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});
