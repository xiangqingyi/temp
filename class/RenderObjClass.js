var pageStatus = require('./PageStatusClass');
var pageInfo = require('./PageInfoClass');
var sidebarMenu = require('./SidebarMenuClass');

  "use strict";

function RenderObj(){
    this.pagestatus = new pageStatus();
    this.pageinfo = new pageInfo();
    this.sidebarmenu = new sidebarMenu();
}

module.exports = RenderObj;