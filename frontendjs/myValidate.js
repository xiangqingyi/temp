/**
 * 需要載入元件：
 * jQuery
 * validate
 * @param Options 
 * @param SubmitFunction 
 */
(function($){
    $.fn.myValidate = function(){
        var validateOptions = arguments[0];
        var validateSubmitFn = arguments[1];
        if (typeof validateOptions !== 'object') {
            console.log('參數不正確！');
            return false;
        }
        if(typeof validateSubmitFn !== 'function'){
            validateSubmitFn = function(form){
                form.submit();
            };
        }
        //預設參數
        var defaults = {
            errorElement: "em",
            errorPlacement: function ( error, element ) {
                // Add the `help-block` class to the error element
                error.addClass( "help-block" );

                if (element.prop( "type" ) === "text" && element.parent("div").hasClass("input-group date")) {
                    //for datepicker
                    error.insertAfter( element.parent( "div" ) );
                } else if ( element.prop( "type" ) === "checkbox" ) {
                    //for checkbox
                    error.insertAfter( element.parent( "label" ) );
                } else {
                    error.insertAfter( element );
                }
            },
            highlight: function ( element, errorClass, validClass ) {
                $( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
            },
            unhighlight: function (element, errorClass, validClass) {
                $( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
            },
            submitHandler:function(form) {
	    	    validateSubmitFn(form);
	        }

        };

        //載入預設參數
        validateOptions = $.extend(true,defaults,validateOptions);
        
        $(this).validate(validateOptions);

        return this;
    };
})(jQuery);