module.exports = function(app) {
    var user = require('../controller/user.js');
    var btc = require('../controller/btc.js');

    app.route('/user/login')
      .get(user.loginUser);

    app.route('/user/create')
      .get(user.createUser);

    app.route('/btcRate')
      .get(btc.getBtcToUah);
  };