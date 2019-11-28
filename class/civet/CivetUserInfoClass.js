  "use strict";

function CivetUserInfo(data){
    this.civetno = data.civetno;
    //目前無用到先註解，因有些帳號沒有返回這些欄位
    // this.sex  = data.sex;
    // this.nickname = data.nickname;
    // this.area = data.area;
    // this.sign = data.sign;
    // this.icon = data.icon;
}

module.exports = CivetUserInfo;