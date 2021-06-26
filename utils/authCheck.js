const {User} = require("../model/user.js");
class AuthCheck {
    //check passed credentials, that they are persist in database
    check(userId, authCode) {
        var user = new User();
        return user.checkUserAuth(userId, authCode);
    }
}
module.exports ={
    AuthCheck: AuthCheck
}