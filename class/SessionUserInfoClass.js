"use strict";

var userInfo = function(data){
    this._id = data.id;
    this.account = data.account;
    this.password = data.password;
    this.userName = data.userName;
    this.status = data.status;
    this.roleArray = data.roleArray;
    this.privilegeArray = data.privilegeArray;
    this.createDateTime = data.createDateTime;
    this.createUserId = data.createUserId;
    this.objectId = data.objectId;
};

module.exports = userInfo;