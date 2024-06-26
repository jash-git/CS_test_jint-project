//NUMBER~80mm
function Main() {
    var Result = {};//最終結果物件
    var json_obj = {};//輸入字串的JSON物件
    var ESC_Value = [];//存放記錄所有產出的列印資訊陣列
    var strbuf = '';//字串資料暫存變數

    //---
    //將輸入文字轉成JSON物件
    try {
        json_obj = JSON.parse(input);
    }
    catch (e) {
        json_obj = null;
        WriteLog(e.message);
    }
    //---將輸入文字轉成JSON物件

    //---
    //判斷記錄輸入資料是否合法
    if (json_obj == null) {
        Result.state_code = 1;
        Result.log = Log_Value;
        return JSON.stringify(Result);
    }
    else {
        Result.state_code = 0;		
		if(json_obj.order_no.length==0)//沒有訂單號就不用進行後續運算
		{
			return JSON.stringify(Result);
		}		
        ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化		
    }
    //---判斷記錄輸入資料是否合法

    GlobalVariable_Init();//解析C#傳送過來的印表參數並修改對應全域變數

    //---
    //新增列印主體內容

    //企業Logo
    if (PrinterParms.print_logo != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecLOGO);
    }
    else {
        //店名;文字至中 + 粗體+放大 + 店名 + 換行
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
    }

    //取餐號加大
    if (PrinterParms.big_callnum != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecFOUR_ON + json_obj.call_num + ecFOUR_OFF + ecFREE_LINE + ecFREE_LINE);
    }

    //列印條碼
    if (PrinterParms.print_barcode != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER);

        //---
        //BarCode
        //BarCode
        ESC_Value.push(ecGS + "H" + '\x00');//条形文字
        ESC_Value.push(ecGS + "\u0068" + "\x50");//设置条形码高度
        ESC_Value.push(ecGS + "\u0077" + "\x01");//设置条形码宽度

        //var StrBarCode =  (json_obj.invoice_data.inv_period.substr(0, 4) - 1911) + json_obj.invoice_data.inv_period.substr(4, 2) + json_obj.invoice_data.inv_no + json_obj.invoice_data.random_code;//發票期別-發票號碼-隨機嗎
        ESC_Value.push(ecBAR_CODE_HEAD + json_obj.order_no + ecBAR_CODE_END);//BarCode Code39
        //---BarCode
    }

    //開啟提示音
    if (PrinterParms.start_buzzer != "N") {
        ESC_Value.push(ecSTART_BUZZER);
    }

    //外接蜂鳴器
    if (PrinterParms.external_buzzer != "N") {
        ESC_Value.push(ecEXTERNAL_BUZZER);
    }

	//單號;文字靠左 + 放大 + 單號 + 換行
	var order_noAry = json_obj.order_no.split('-');
    strbuf = '單號(' + json_obj.order_type_name + ') :' +  order_noAry[1];//json_obj.call_num;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
    ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併

	//桌號;文字靠左 + 放大 + 桌號 + 換行
	if(json_obj.table_name.length>0)
	{
		strbuf = '桌號: ' + json_obj.table_name;
        ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
        ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併
	}

	//日期&時間;文字靠左 + 日期(時間) + 換行
    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
    strbuf = '日期: ' + year + "-" + month + "-" + day + "  時間: " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//交易序號;文字靠左 + 交易序號 + 換行
    strbuf = '交易序號: ' + json_obj.order_no;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//列印軟體版本
    strbuf = 'Version: ' + json_obj.pos_ver;
	ESC_Value.push(ecFREE_LINE + ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    //設備編號;文字靠左+ 設備編號 + 換行
    strbuf = '設備編號: ' + json_obj.terminal_sid;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	

	//列印時間
    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = pad2(now.getMinutes());
    strbuf = "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行
	
    //---新增列印主體內容

    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    Result.log = Log_Value;
    return JSON.stringify(Result);
}
