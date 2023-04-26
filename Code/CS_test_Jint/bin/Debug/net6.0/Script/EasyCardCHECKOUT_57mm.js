//EasyCardBILL_57mm
function Main() {
    //JSON資料顯示格式轉換: https://jsonformatter.org/
    /*
    //測試資料來源: C:\Users\devel\Desktop\GITHUB\公司GIT\127\vteam_pos_sys\vteam_pos\VPOS\Json2Class\EasyCardAPIMsg.cs
    var input = '{"SID":"","Message_Type":"0500","Trans_Code":"CHECKOUT","Trans_Date":"20230425","Trans_Time":1682390727,"Trans_Amount":0,"Auto_Add_Value":0,"TMLocationID":"0000000001","Store_ID":"00010907","Pos_ID":"01","Employee_ID":"0001","Pos_Trans_Num":218,"Host_Serial_Num":220024,"Batch_No":"23042501","Dongle_Device_ID":"06100D9B2A00","New_Device_ID":"0001090701304102","Precessing_Code":"900000","Precessing_Name":"","RRN":"23042522002400","Checkout_Info":{"Checkout_ID":"34F07FABBC1F470E94C38C3B7F1C09ED","Batch_No":"23042501","Pos_Trans_Num":218,"Host_Serial_Num":220024,"TMLocationID":"0000000001","Store_ID":"00010907","Pos_ID":"01","Employee_ID":"0001","Dongle_Device_ID":"06100D9B2A00","New_Device_ID":"0001090701304102","Sale_Count":0,"Sale_Amount":0,"Refund_Count":0,"Refund_Amount":0,"Auto_Add_Value_Count":0,"Auto_Add_Value_Amount":0,"Trans_Count":0,"Trans_Amount":0,"Checkout_Time":1682390727,"Checkout_Success":"Y","Checkout_Match":"Y","Checkout_Msg":"01"},"Retry_Nex_Flag":"N","Trans_Success":"Y","Trans_Msg":"OK"}';
    */
	var MaxLength = 34;
	var ShiftSpace = '       ';//(80mm(48字)-57mm(34字))/2(對稱) + 1(美觀)= 7字
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
    }
    //---將輸入文字轉成JSON物件

    //---
    //判斷記錄輸入資料是否合法
    if (json_obj == null) {
        Result.state_code = 1;
        return JSON.stringify(Result);
    }
    else {
        Result.state_code = 0;
        ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化
    }
    //---判斷記錄輸入資料是否合法
    
	//---
    //新增列印主體內容
	//店名;文字至中 + 粗體+放大 + 店名 + 換行
	//C# 單獨指定 store_name 變數值
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);

	//標題;文字至中 + 粗體+放大 + 悠遊卡結帳憑證 + 換行
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + '悠遊卡結帳憑證 ' + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
	
	//門    市;文字靠左 + 門    市 + 換行
    strbuf = ShiftSpace + '門    市: ' + json_obj.TMLocationID;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//收銀機號;文字靠左 + 收銀機號 + 換行
    strbuf = ShiftSpace + '收銀機號: ' + json_obj.Pos_ID;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//交易序號;文字靠左 + 交易序號 + 換行
    strbuf = ShiftSpace + '交易序號: ' + PrefixInteger(json_obj.Pos_Trans_Num,6);
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
    strbuf = ShiftSpace + '==================================';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	
	//日期&時間;文字靠左 + 日期(時間) + 換行
    var date = new Date(json_obj.Trans_Time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
	var seconds = pad2(date.getSeconds());
	var time = year + "-" + month + "-" + day + " " + hour + ':' + minute + ':' + seconds;
    strbuf = ShiftSpace + '交易時間: ' + TypesettingSpace('交易時間: ',time,MaxLength) + time;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//平帳;文字靠左 + 平帳 + 換行
	strbuf = ShiftSpace + '平帳: ' + TypesettingSpace('平帳: ','平帳',MaxLength) + '平帳';
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	

	//二代設備編號;文字靠左 + 二代設備編號 + 換行
	strbuf = ShiftSpace + '二代設備編號: ' + TypesettingSpace('二代設備編號: ',json_obj.New_Device_ID,MaxLength) + json_obj.New_Device_ID;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//批次號碼;文字靠左 + 批次號碼 + 換行
	strbuf = ShiftSpace + '批次號碼: ' + TypesettingSpace('批次號碼: ',json_obj.Batch_No,MaxLength) + json_obj.Batch_No;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	
	//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
    strbuf = ShiftSpace + '----------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);		
	
	//購貨筆數;文字靠左 + 購貨筆數: + 換行
	strbuf = ShiftSpace + '購貨筆數: ' + TypesettingSpace('購貨筆數: ',json_obj.Checkout_Info.Sale_Count,MaxLength) + json_obj.Checkout_Info.Sale_Count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//購貨總額;文字靠左 + 購貨總額: + 換行
	strbuf = ShiftSpace + '購貨總額: ' + TypesettingSpace('購貨總額: ','$' + json_obj.Checkout_Info.Sale_Amount,MaxLength) + '$' + json_obj.Checkout_Info.Sale_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//退貨筆數;文字靠左 + 退貨筆數: + 換行
	strbuf = ShiftSpace + '退貨筆數: ' + TypesettingSpace('退貨筆數: ',json_obj.Checkout_Info.Refund_Count,MaxLength) + json_obj.Checkout_Info.Refund_Count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//退貨總額;文字靠左 + 退貨總額: + 換行
	strbuf = ShiftSpace + '退貨總額: ' + TypesettingSpace('退貨總額: ','$' + json_obj.Checkout_Info.Refund_Amount,MaxLength) + '$' + json_obj.Checkout_Info.Refund_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//自動加值筆數;文字靠左 + 自動加值筆數: + 換行
	strbuf = ShiftSpace + '自動加值筆數: ' + TypesettingSpace('自動加值筆數: ',json_obj.Checkout_Info.Auto_Add_Value_Count,MaxLength) + json_obj.Checkout_Info.Auto_Add_Value_Count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//自動加值總額;文字靠左 + 自動加值總額: + 換行
	strbuf = ShiftSpace + '自動加值總額: ' + TypesettingSpace('自動加值總額: ','$' + json_obj.Checkout_Info.Auto_Add_Value_Amount,MaxLength) + '$' + json_obj.Checkout_Info.Auto_Add_Value_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//購貨類總筆數;文字靠左 + 購貨類總筆數: + 換行
	strbuf = ShiftSpace + '購貨類總筆數: ' + TypesettingSpace('購貨類總筆數: ',json_obj.Checkout_Info.Trans_Count,MaxLength) + json_obj.Checkout_Info.Trans_Count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//購貨類總金額;文字靠左 + 購貨類總金額: + 換行
	strbuf = ShiftSpace + '購貨類總金額: ' + TypesettingSpace('購貨類總金額: ','$' + json_obj.Checkout_Info.Trans_Amount,MaxLength) + '$' + json_obj.Checkout_Info.Trans_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
    strbuf = ShiftSpace + '----------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	

	//購貨類總淨額;文字靠左 + 購貨類總淨額: + 換行
	strbuf = ShiftSpace + '購貨類總淨額: ' + TypesettingSpace('購貨類總淨額: ','$' + (json_obj.Checkout_Info.Sale_Amount - json_obj.Checkout_Info.Refund_Amount),MaxLength) + '$' +  (json_obj.Checkout_Info.Sale_Amount - json_obj.Checkout_Info.Refund_Amount);
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}
