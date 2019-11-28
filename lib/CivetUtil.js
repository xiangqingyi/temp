const requestUtil = require('./RequestUtil');

class civetUtil {
    constructor(FromUserName, Password) {
        this.FromUserName = FromUserName;
        this.Password = Password;
    }

    SendMsgToChannel(url, ToCivetNo, Content, fn) {
        const msgXml = this.getSendMsgTemplate(ToCivetNo, Content);

        //POSTUseXML TimeOut時間改為30秒
        requestUtil.POSTUseXML(url, msgXml, function (error, response, body) {
            //新增成功回傳狀態碼為200 請求成功並建立資源
            if (!error && response.statusCode == 200) {
                fn(null, body);
            } else {
                fn(error);
            }
        });
    }

    getSendMsgTemplate(ToCivetNo, Content) {
        return (
            '<xml>' +
            '<MsgType>text</MsgType>' +
            '<FromUserName>' + this.FromUserName + '</FromUserName>' +
            '<Password>' + this.Password + '</Password>' +
            '<ToCivetNo>' + ToCivetNo + '</ToCivetNo>' +
            '<Content><![CDATA[' + Content + ']]></Content>' +
            '</xml>'
        );
    }
}

module.exports = civetUtil;