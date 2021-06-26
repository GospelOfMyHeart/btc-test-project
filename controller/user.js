const userValidator = require("../utils/userValidators.js");
const { BaseResponse } = require("../utils/baseResponse.js");
const { User } = require("../model/user.js");
const { BaseError } = require("../utils/error.js");
exports.createUser = function(req,res) {
    var response = new UserCreateResponse();

    var validationResult = userValidator.validateRegistartionCreds(req);

    //validating user input
    if( validationResult.length > 0) {
        response.validationErrors = validationResult;
        return res.status(400).json(response);
    }

    //taking user data
    const email = req.body.email;
    const password = req.body.password;

    //opening connection to "database"
    
    var user = new User();

    //check if such user exist
    if(user.isUserExistInDatabase(email)) {
        var userExistError = new BaseError();
        userExistError.msg = "User already exist";
        response.errors.push(userExistError);

        return res.status(400).json(response);
    } else 
    {
        // if everything okay – save user to database
        user.saveUserWithCredentials(email, password);

        response.isSuccess = true;

        return res.status(201).json(response);
    }
}
exports.loginUser = function(req,res) {    
    var response = new UserCreateResponse();

    var validationResult = userValidator.validateLoginCreds(req);

    if( validationResult.length > 0) {
        response.validationErrors = validationResult;
        return res.status(400).json(response);
    }

    //taking user data
    const email = req.body.email;
    const password = req.body.password;

    //check if user credentials are in "database"

    var user = new User();

    var userData = user.findUserWithCredentials(email, password);
    if(userData) {
        //userdata from "database" 
        //recreating user model with non-hashed email
        //retrieve code to save it to cookies
        var authCode = user.authUser({
            email:email,
            password:password
        });

        //saving auth code to cookie
        res.cookie("auth",authCode, {maxAge:1000*60*24});
        res.cookie("userId",email, {maxAge: 1000*60*24});
        //sending response with success 
        response.isSuccess = true;
        res.status(200).json(response);
        
    } else {
        var loginError = new BaseError();
        loginError.msg = "User does not exist";
        response.errors.push(loginError);
        res.status(400).json(response);
    }
}

class UserCreateResponse extends BaseResponse {
    validationErrors = [];
}
class UserLoginResponse extends BaseResponse {

}