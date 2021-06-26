
class BaseError {
    msg = "";
}

class ValidationError extends BaseError {
    fieldName = "";
}

module.exports = {    
    BaseError: BaseError,
    ValidationError: ValidationError
}