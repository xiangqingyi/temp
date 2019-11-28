  "use strict";

function AccessToken(data){
    this.openid = data.openid;
    this.access_token  = data.access_token;
    this.expires_in = data.expires_in;
}

module.exports = AccessToken;