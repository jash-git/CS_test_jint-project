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
	Trans_Amount = 0;//交易金額變數初始化
    if (json_obj == null) {
        Result.state_code = 1;
        return JSON.stringify(Result);
    }
    else {
		Trans_Amount = parseInt(json_obj.Trans_Amount, 10)/100;;
		if(Trans_Amount<=1000)
		{
			Result.state_code = 0;
			ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化			
		}
		else
		{
			Result.state_code = 1;
			return JSON.stringify(Result);			
		}
    }
    //---判斷記錄輸入資料是否合法
    
	//---
    //新增列印主體內容
	//店名;文字至中 + 粗體+放大 + 店名 + 換行
	//C# 單獨指定 store_name 變數值
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);

	//標題;文字至中 + 粗體+放大 + 聯合信用卡小額交易持卡人存根 + 換行
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + '聯合信用卡小額交易持卡人存根' + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
	
	//卡號&卡別;文字靠左 + 卡號        卡別:  + 換行
	strCardType = "";
	switch(json_obj.Card_Type)
	{
		case "01":
			strCardType = "TWIN Card";
			break;
		case "02":
			strCardType = "VISA";
			break;
		case "03":
			strCardType = "MASTERCARD";		
			break;
		case "04":
			strCardType = "JCB";		
			break;
		case "05":
			strCardType = "AMEX";		
			break;
		case "06":
			strCardType = "CUP";		
			break;
		case "07":
			strCardType = "DISCOVER";		
			break;
		case "08":
			strCardType = "SMARTPAY";		
			break;
		case "11":
			strCardType = "悠遊卡";		
			break;
		case "12":
			strCardType = "一卡通";		
			break;
		case "13":
			strCardType = "愛金卡";		
			break;
		case "14":
			strCardType = "有錢卡";		
			break;
		case "15":
			strCardType = "OO社員卡";		
			break;																		
		default:
			strCardType = "未定義";
	}	
	strbuf = ShiftSpace + '卡號        卡別: ' + TypesettingSpace('卡號        卡別: ',strCardType,MaxLength) + strCardType;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//卡號;文字靠左 + 卡號 + 換行
    strbuf = ShiftSpace + json_obj.Card_No;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//交易時間;文字靠左 + 交易時間 + 換行
	strDateTime = "20"+json_obj.Trans_Date.substr(0, 2)+"/"+json_obj.Trans_Date.substr(2, 2)+"/"+json_obj.Trans_Date.substr(4, 2)+" " +json_obj.Trans_Time.substr(0, 2)+":"+json_obj.Trans_Time.substr(2, 2);
	strbuf = ShiftSpace + '日期時間: ' + TypesettingSpace('日期時間: ',strDateTime,MaxLength) + strDateTime;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
    
	//授權碼&調閱碼;文字靠左 + 授權碼: OOOOOO 調閱碼: OOOOOO+ 換行
	//strbuf = ShiftSpace + '授權碼(Approval No): ' + json_obj.Approval_No +'調閱碼(Receipt No): '+ json_obj.Receipt_No;
	strbuf = ShiftSpace + '授權碼: ' + json_obj.Approval_No +'  調閱碼: '+ json_obj.Receipt_No;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//總計;文字靠左 + 總計 + 換行
	strbuf = ShiftSpace + '總計(Total): ' + TypesettingSpace('總計(Total):  ',Trans_Amount,MaxLength) + '$' + Trans_Amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}
