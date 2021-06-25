const { ValidationError } = require("./error");
const emailValidator = require("email-validator");

//class for validating user input. If everything success, then return true, else array of Error
class UserValidator {

    validateRegistartionCreds(req) {

        var validationErrors = [];
        var emailValidationResult = validateEmail(req);
        if(emailValidationResult) {
            validationErrors.push(emailValidationResult);
        }    
        var passwordValidationResult = validatePassword(req);
        if(passwordValidationResult) {
            validationErrors.push(passwordValidationResult);
        }
        
        //if more validators added, better replace with loop

        return validationErrors;

    }
}

//////////////////////////////
//Validators will return nothing is everything okay
//////////////////////////////

function validateEmail(req) {    
    var emailValidationError = new ValidationError();
    emailValidationError.fieldName = "email";
    if(!emailValidator.validate(req.body.email)) {            
        emailValidationError.msg = "Email is in wrong format"
        return emailValidationError;
    }
}

function validatePassword(req) {
    
    var passwordValidationError = new ValidationError();    
    passwordValidationError.fieldName = "password";

    var password = req.body.password
    if(!password) {            
        passwordValidationError.msg = "Enter the password"
        return passwordValidationError;
    }
    if(password.length < 8 || password.length >20) {
        passwordValidationError.msg = "Password in wrong format. It must be more than 8 characters and less than 20"
        return passwordValidationError;
    }
}
module.exports = new UserValidator();
//////////////////////////////
//////////////////////////////
//////////////////////////////
