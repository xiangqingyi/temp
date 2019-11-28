  "use strict";

function SidebarMenu(){
    this.dashboard_active = '';
    this.index1_active  = '';
    this.index2_active = '';

    this.management_active = '';
    this.account_active = '';
    this.options_active = '';
    this.privilege_active = '';
    this.role_active = '';
    this.pagemanger_active = '';
    this.log_active = '';

    this.team_active = ''; //團隊
    this.member_active = '';//成員管理
    this.month_score_active = '';//成員排名
    this.month_score_list_active = '';//成員排名列表
    this.month_score_summary_active = '';//當月排名彙總
    this.month_score_qa_active = '';//排名反饋
    this.month_score_qa_feedback = '';//成員回覆
    this.weighting_active = '';//分數加權
    this.month_active = '';//分數加權

    this.project_active = ''; //專案
    this.project_manager_active = ''; //專案管理
    this.project_score_active = ''; //專案評分

    this.year_active = ''; //年度
    
    this.report_active = ''; //報表
}

// var SidebarMenu = {
//     dashboard_active : '',
//     index1_active  : '',
//     index2_active : '',
//     management_active : '',
//     admin_active : ''
// }

module.exports = SidebarMenu;