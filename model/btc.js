const https = require('https');

const urlForRate = "https://api.cryptonator.com/api/ticker/btc-uah";

class BtcRate {
    getRateInUah(onSuccess, onError) {
        https.get(urlForRate, (resp) => {
            let data = '';

            //getting chunk of data
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                //after recieving data, return price for 1 btc to uah directrly
                onSuccess(JSON.parse(data).ticker.price);
            });

            }).on("error", (err) => {
                onError(err);
            });
    }
}
module.exports={
    BtcRate : BtcRate
}