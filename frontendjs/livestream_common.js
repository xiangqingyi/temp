(function(window){
/**
 * 表單轉成JSON物件
 */
$.fn.serializeObject = function()    
{    
    var o = {};    
    var a = this.serializeArray();    
    $.each(a, function() {    
        if (o[this.name]) {    
            if (!o[this.name].push) {    
                o[this.name] = [o[this.name]];    
            }    
            o[this.name].push(this.value || '');    
        } else {    
            o[this.name] = this.value || '';    
        }    
    });    
    return o;    
};      

var commonFunc = {
    /**
     * DataTables列表頁刪除功能
     * @param url Ajax DELETC 接口
     * return Dialog
     */
    dataTableDelSubmit : function(url,returnUrl){
        'use strict';
        var self = this;
        
        var msgMessage = '確認刪除嗎？';
        var doneMessage = '刪除成功！';
        
        var confirmAction = function(){
            //成功後動作
            var doneAction = function(){
                $.each(BootstrapDialog.dialogs, function(id, dialog){
                dialog.close();
                });
                location.href = returnUrl;
            };
            //失敗後動作
            var failAction = function(){
                $.each(BootstrapDialog.dialogs, function(id, dialog){
                dialog.close();
                });
            };
            //Ajax處理
            $.ajax({
                type: 'DELETE',
                url: url
            }).done(function(result){
                if(result.error == 0){
                    self.msgMoalObj(null,doneMessage,false,doneAction).open();
                }else{
                    self.errMsgDialogObj(result.message,failAction).open();
                }
            }).fail(function(){
                self.errMsgDialogObj('刪除資料錯誤！',failAction).open();
            });               
        };

        self.msgMoalObj(null,msgMessage,true,confirmAction).open();        
    },

    /**
     * ajax資料送出
     * @param ajaxSubmitData ajax送出的資料
     * @param ajaxOptionsObj ajax的option
     * @param ajaxOptionsObj ajax的option
     * @param errorMSG 錯誤訊息
     * @param cb callback
     * return Dialog
     */
    ajaxDataSubmit : function(ajaxSubmitData,ajaxOptionsObj,errorMSG,cb){
        'use strict';
        var self = this;
        
        //AjaxOption
        var defaults = {
            data: ajaxSubmitData,
            dataType: 'json',
            cache:false,
        };
        
        ajaxOptionsObj = $.extend(true,defaults,ajaxOptionsObj);

        $.ajax(ajaxOptionsObj)
        .done(function(result){
            if(typeof result.error === 'undefined'){
                cb(result);
            }else{
                if(result.error == 0){
                    cb(result);
                }else{
                    commonFunc.showErrMsgDialogWithNoting(result.message);
                    console.log(result.message);
                }
            }
        }).fail(function( jqXHR, textStatus, errorThrown){
            console.log(errorThrown);
            commonFunc.showErrMsgDialogWithNoting(errorMSG);
        });             
    },

    /**
     * 設定下拉選單值
     * @param selectJqueryObj 下拉元件
     * @param ajaxUrl ajax的rul
     * @param errorMSG 錯誤訊息
     * @param cb callback
     * return Dialog
     */
    setSelectElementOption : function(selectJqueryObj,ajaxUrl,errorMSG){
        'use strict';
        var self = this;

        //AjaxOption
        var ajaxOptions = {
            type: 'GET',
            url: ajaxUrl
        };
        
        self.ajaxDataSubmit(null,ajaxOptions,errorMSG,function(result){
            var selectObjData = result.data;
            var selObj = selectJqueryObj;
            $.each(selectObjData,function(){
                var id = this._id;
                var value=this.key;  
                var text=this.name;  
                var appendValue = 
                selObj.append("<option value='"+id+","+value+"'>"+text+"</option>");                 
            });            
        });
    },

    /**
     * 顯示提示訊息，確定後不做任何動作
     * @param message 顯示訊息
     * return DialogObj
     */
    showMsgDialogWithNoting : function(message){
        'use strict';
        var self = this;
        self.showMsgDialogDoThing(message,function(){});
    },

    /**
     * 顯示提示訊息，確定後做其他事情
     * @param message 顯示訊息
     * @param fn 按下確認後處理事件
     * return DialogObj
     */
    showMsgDialogDoThing : function(message,fn){
        'use strict';
        var self = this;
        
        var confirmFn = function(){
            $.each(BootstrapDialog.dialogs, function(id, dialog){
            dialog.close();
            });
            fn();
        };        
        var msgDialog = self.msgMoalObj(null,message,false,confirmFn);
        
        msgDialog.open();
    },

    /**
     * 顯示警告確認提示訊息，確定後做其他事情
     * @param message 顯示訊息
     * @param fn 按下確認後處理事件
     * return DialogObj
     */
    showWarningMsgDialogDoThing : function(message,fn){
        'use strict';
        var self = this;
        
        var confirmFn = function(){
            $.each(BootstrapDialog.dialogs, function(id, dialog){
            dialog.close();
            });
            fn();
        };        
        var wargingDialog = self.msgMoalObj(null,message,true,confirmFn);
        wargingDialog.options.type = 'type-warning'; 

        wargingDialog.open();
    },

    /**
     * 顯示錯誤訊息，確定後不做任何動作
     * @param message 顯示訊息
     * return DialogObj
     */
    showErrMsgDialogWithNoting : function(message){
        'use strict';
        var self = this;
        
        var title = '錯誤訊息';        
        var confirmFn = function(){
            $.each(BootstrapDialog.dialogs, function(id, dialog){
            dialog.close();
            });
        };        
        var errDialog = self.msgMoalObj(title,message,false,confirmFn);
        errDialog.options.type = 'type-danger'; 
        //errDialog.options.closable = false; 

        errDialog.open();
    },

    /**
     * 顯示錯誤訊息
     * @param message 顯示訊息
     * @param confirmFn 按下確認後處理事件
     * return DialogObj
     */
    errMsgDialogObj : function(message,confirmFn){
        'use strict';
        var self = this;
        
        var title = '錯誤訊息';        
        var errDialog = self.msgMoalObj(title,message,false,confirmFn);
        errDialog.options.type = 'type-danger'; 
        //errDialog.options.closable = false; 

        return errDialog        
    },

    /**
     * 顯示錯誤訊息
     * @param title 視窗標題
     * @param message 顯示訊息
     * @param cancelBtn 是否要顯示取消按鈕
     * @param confirmFn 按下確認後處理事件
     * return DialogObj
     */
    msgMoalObj : function(title,message,cancelBtn,confirmFn){
        'use strict';

        title = title || '提示訊息';

        var btns = [];
        var tempbtn = {};

        //取消按鈕
        if(cancelBtn){
            tempbtn = {
                label: '取消',
                cssClass: 'btn-default',
                action: function(dialogItself){
                dialogItself.close();                  
                }
            };
            btns.push(tempbtn);
        };
        
        //確認按鈕
        tempbtn = {
            label: '確認',
            cssClass: 'btn-danger'
        }
        if(typeof confirmFn === 'function')
        {
            tempbtn.action = confirmFn;
        }
        btns.push(tempbtn);

        return new BootstrapDialog({
            title: title,
            message: message,
            size: BootstrapDialog.SIZE_SMALL,
            closable: false,
            buttons: btns           
        });           
    }
};

window.commonFunc = commonFunc;

})(window);