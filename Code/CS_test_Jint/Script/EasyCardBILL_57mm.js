//EasyCardBILL_57mm
function Main() {
    //JSON資料顯示格式轉換: https://jsonformatter.org/
    /*
    //測試資料來源: C:\Users\devel\Desktop\GITHUB\公司GIT\127\vteam_pos_sys\vteam_pos\VPOS\Json2Class\EasyCardAPIMsg.cs
    var input = '{"SID":"6D03CBCC5F234669887675F6D85D663C","Message_Type":"0200","Trans_Code":"DEDUCT","Trans_Date":"20230421","Trans_Time":1682058565,"Trans_Amount":50,"Auto_Add_Value":0,"TMLocationID":"0000000001","Store_ID":"00010907","Pos_ID":"01","Employee_ID":"0001","Pos_Trans_Num":213,"Host_Serial_Num":220013,"Batch_No":"23042104","Dongle_Device_ID":"06100D9B2A00","New_Device_ID":"0001090701304102","Precessing_Code":"811599","Precessing_Name":"購貨","RRN":"23042122001261","Card_Info":{"Physical_ID":"1719511104","Purse_ID":"","Receipt_Card_ID":"1719511104","Effective_Date":"20250810","Card_Type":"00","Balance_Amount":103,"Befer_Amount":153,"Serial_Num":""},"Checkout_ID":"","Retry_Nex_Flag":"N","Trans_Success":"Y","Trans_Msg":"OK"}';
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

	//標題;文字至中 + 粗體+放大 + 悠遊卡交易憑證(顧客聯) + 換行
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + '悠遊卡交易憑證(顧客聯)' + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
	
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

	//悠遊卡卡號;文字靠左 + 悠遊卡卡號 + 換行
	strbuf = ShiftSpace + '悠遊卡卡號: ' + TypesettingSpace('悠遊卡卡號: ',json_obj.Card_Info.Receipt_Card_ID,MaxLength) + json_obj.Card_Info.Receipt_Card_ID;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	

	//交易類別;文字靠左 + 交易類別 + 換行
	strbuf = ShiftSpace + '交易類別: ' + TypesettingSpace('交易類別: ',json_obj.Precessing_Name,MaxLength) + json_obj.Precessing_Name;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//二代設備編號;文字靠左 + 二代設備編號 + 換行
	strbuf = ShiftSpace + '二代設備編號: ' + TypesettingSpace('二代設備編號: ',json_obj.New_Device_ID,MaxLength) + json_obj.New_Device_ID;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//批次號碼;文字靠左 + 批次號碼 + 換行
	strbuf = ShiftSpace + '批次號碼: ' + TypesettingSpace('批次號碼: ',json_obj.Batch_No,MaxLength) + json_obj.Batch_No;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	
	//RRN;文字靠左 + RRN + 換行
	strbuf = ShiftSpace + 'RRN: ' + TypesettingSpace('RRN: ',json_obj.RRN,MaxLength) + json_obj.RRN;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//交易前餘額;文字靠左 + 交易前餘額 + 換行
	strbuf = ShiftSpace + '交易前餘額: ' + TypesettingSpace('交易前餘額: ',json_obj.Card_Info.Befer_Amount,MaxLength) + json_obj.Card_Info.Befer_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//自動加值金額;文字靠左 + 自動加值金額 + 換行
	strbuf = ShiftSpace + '自動加值金額: ' + TypesettingSpace('自動加值金額: ',json_obj.Auto_Add_Value,MaxLength) + json_obj.Auto_Add_Value;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//交易金額;文字靠左 + 交易金額 + 換行
	strbuf = ShiftSpace + '交易金額: ' + TypesettingSpace('交易金額: ',json_obj.Trans_Amount,MaxLength) + json_obj.Trans_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//交易後餘額;文字靠左 + 交易後餘額 + 換行
	strbuf = ShiftSpace + '交易後餘額: ' + TypesettingSpace('交易後餘額: ',json_obj.Card_Info.Balance_Amount,MaxLength) + json_obj.Card_Info.Balance_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	
    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}
