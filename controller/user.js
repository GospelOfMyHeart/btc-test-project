const userValidator = require("../utils/userValidators.js");
const { BaseResponse } = require("../utils/baseResponse.js");
const { UserDb } = require("../utils/userDb.js");
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
    
    var userDb = new UserDb();

    //check if such user exist
    if(userDb.isUserExistInDatabase(email)) {
        var userExistError = new BaseError();
        userExistError.msg = "User already exist";
        response.errors.push(userExistError);

        return res.status(400).json(response);
    } else 
    {
        // if everything okay – save user to database
        userDb.saveUserWithCredentials(email, password);

        response.isSuccess = true;

        return res.status(200).json(response);
    }
}
exports.loginUser = function(req,res) {
    res.send("Login user");
}

class UserCreateResponse extends BaseResponse {
    validationErrors = [];
}