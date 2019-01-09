'use strict';

module.exports = function () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('401 Not Authorized');
  };
};
