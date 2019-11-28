/**
 * 需要載入元件：
 * jQuery
 * DataTable
 * fancybox
 */
(function ($, DataTable, fancybox) {

    $.fn.myDataTable = function () {
        var datatableOptions = arguments[0];
        if (typeof datatableOptions !== 'object') {
            console.log('參數不正確！');
            return false;
        }

        var columnCount = datatableOptions.columns.length;
        var thCount = $(this).children('thead').children('tr').children('th').length;
        var currentTarget = -1;

        //預設參數
        var defaults = {
            "operationCol": {
                "type": 'EditDelete',
                "show": false,
                "editUrl": '',
                "delUrl": '',
                "returnUrl":location.href
            },
            "imgCol": {
                "show": false
            },
            "columnDefs": []
            ,
            "oLanguage":
                {"sProcessing":"處理中...",
                "sLengthMenu":"顯示 _MENU_ 項結果",
                "sZeroRecords":"沒有匹配結果",
                "sInfo":"顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
                "sInfoEmpty":"顯示第 0 至 0 項結果，共 0 項",
                "sInfoFiltered":"(從 _MAX_ 項結果過濾)",
                "sSearch":"搜索:",
                "oPaginate":{"sFirst":"首頁",
                    "sPrevious":"上頁",
                    "sNext":"下頁",
                    "sLast":"尾頁"}
            }
        };

        //操作欄位介面
        var getOperationCol = [];
        //查詢，修改，刪除
        getOperationCol['Normal'] = function (editUrl, delUrl, returnUrl) {
            return {
                "targets": currentTarget,
                "width": "180px",
                "data": '_id',
                "render": function (data, type, row) {
                    var id = data._id;
                    var html = "<div class='row'><div class='col-xs-12'>"
                    html += "<a class='col-xs-3 btn btn-info' style='margin:0 5px 0 15px;'> 查看</a>"
                    html += "<a href='" + editUrl + id + "' class='col-xs-3 btn btn-warning' style='margin:0 5px;'> 编辑</a>"
                    html += "<a class='col-xs-3 btn btn-danger' style='margin:0 5px;' onclick='commonFunc.dataTableDelSubmit(\"" + delUrl + id + "\",\"" + returnUrl + "\");'> 删除</a>"
                    html += "</div></div>"
                    return html;
                }
            };
        };
        //修改，刪除
        getOperationCol['EditDelete'] = function (editUrl, delUrl, returnUrl) {
            return {
                "targets": currentTarget,
                "width": "120px",
                "data": '_id',
                "render": function (data, type, row) {
                    var id = data._id;
                    var html = "<div class='row'><div class='col-xs-12'>"
                    html += "<a href='" + editUrl + id + "' class='col-xs-5 btn btn-warning' style='margin:0 5px;'> 编辑</a>"
                    html += "<a class='col-xs-5 btn btn-danger' style='margin:0 5px;' onclick='commonFunc.dataTableDelSubmit(\"" + delUrl + id + "\",\"" + returnUrl + "\");'> 删除</a>"
                    html += "</div></div>"
                    return html;
                }
            };
        };

        //Body刪除
        getOperationCol['BodyDelete'] = function (editUrl, delUrl, returnFUN) {
            return {
                "targets": currentTarget,
                "width": "60px",
                "data": '_id',
                "render": function (data, type, row) {
                    var id = data._id;
                    var html = "<div class='row'><div class='col-xs-12'>"
                    html += "<a class='TableDeleteBtn col-xs-10 btn btn-danger' style='margin:0 5px;' > 删除</a>"
                    html += "</div></div>"
                    return html;
                }
            };
        };

        //顯示圖片
        var getImgCol = function () {
            return {
                "targets": currentTarget,
                "width": "50px",
                "data": ['photo', 'name'],
                "render": function (data, type, row) {
                    var title = data.name;
                    var photo = data.photo;
                    var photoUrl = '';
                    if (typeof photo !== 'undefined') {
                        photoUrl = './uploads/' + photo.account_photo[0].filename;
                    }
                    var html = "<div class='row'><div class='col-xs-12'>";
                    if (photoUrl != '') {
                        html += "<a class='fancybox' href='" + photoUrl + "' title='" + title + "'><span class='glyphicon glyphicon-picture' style='color:green;font-size: 24px;margin-left:25px;'></span></a>"
                    } else {
                        html += "<span class='glyphicon glyphicon-picture' style='color:lightgrey;font-size: 24px;margin-left:25px;'></span>"
                    }
                    html += "</div></div>"
                    return html;
                }
            };
        };

        //載入預設參數
        datatableOptions = $.extend(true,defaults,datatableOptions);

        //處理操作按鈕
        if (datatableOptions.operationCol.show) {
            if (columnCount != thCount) {
                console.log('欄位數量不符！');
                return false;
            }
            Array.prototype.push.call(datatableOptions['columnDefs'], getOperationCol[datatableOptions.operationCol.type](datatableOptions.operationCol.editUrl, datatableOptions.operationCol.delUrl, datatableOptions.operationCol.returnUrl));
            currentTarget -= 1;
        }

        //處理顯示圖片
        if (datatableOptions.imgCol.show) {
            if (columnCount != thCount) {
                console.log('欄位數量不符！');
                return false;
            }
            Array.prototype.push.call(datatableOptions['columnDefs'], getImgCol());
            currentTarget -= 1;
        }

        //console.log(datatableOptions);

        $(this).DataTable(datatableOptions);

        // fancyBox
        $('.fancybox').fancybox();

        return this;
    };

})(jQuery, $.fn.DataTable, $.fn.fancybox);
