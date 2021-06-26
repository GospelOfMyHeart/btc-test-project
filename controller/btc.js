const {AuthCheck} = require("../utils/authCheck.js");
const {BaseResponse} = require("../utils/baseResponse.js");
const { BaseError} = require("../utils/error.js");
const { BtcRate } = require("../model/btc.js");
exports.getBtcToUah = function(req,res) {
    //util for checking authorization, better be placed in middleware
    var authCheck = new AuthCheck();

    var response = new BtcToUahResponse();
    
    if(authCheck.check(req.cookies.userId, req.cookies.auth)){
        console.log("Success auth");
        var btcRate = new BtcRate();
        btcRate.getRateInUah((rate)=> {
            console.log("Success recieved rate");
            response.isSuccess = true;
            response.rate = rate;
            res.status(200).json(response);
        },(error)=> {
            console.log("Failed recieved rate");
            var accessError = new BaseError();
            accessError.msg = "Error when accessing external API: "+error;
            response.errors.push(error);
            res.status(500).json(response);
        });
    } else {
        console.log("Failed auth");
        var authError = new BaseError();
        authError.msg = "User not authorized";
        response.errors.push(authError);
        res.status(403).json(response);
    }
}

class BtcToUahResponse extends BaseResponse{
    rate = 0.0;
}