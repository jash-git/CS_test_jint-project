//Work~57mm
function Main() {
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
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);

	//單號;文字靠左 + 放大 + 單號 + 換行
	var order_noAry = json_obj.order_no.split('-');
    strbuf = ShiftSpace + '單號(' + json_obj.order_type_name + ') :' + ((order_noAry.length>1) ? order_noAry[1] : order_noAry[0]);//json_obj.call_num
    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

	//日期&時間;文字靠左 + 日期(時間) + 換行
    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
    strbuf = ShiftSpace + '日期: ' + year + "-" + month + "-" + day + "  時間: " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//交易序號;文字靠左 + 交易序號 + 換行
    strbuf = ShiftSpace + '交易序號: ' + json_obj.order_no;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
    strbuf = ShiftSpace + '----------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
//*	
	//---
	//紙張設定
	ESC_Value.push("\x1B\x4C");//选择页模式 ESC L
	ESC_Value.push("\x1B\x57\xD8\x00\x00\x00\x80\x02\x00\x02");//在页模式下设置打印区域 ESC W xL xH yL yH dxL dxH dyL dyH; [456%256=200(C8) 456/256=1(01) [57mm]; 480%256=244(F4) 480/256=1(01)[30mm]
	//---紙張設定		

	ESC_Value.push(ecGS + "$" + '\xDA' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\xFF' + '\x00')//水平定位 [ESC $ nL nH 设置绝对打印位置] 90,0
	ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	
	var StrQrData = json_obj.strQrcodeInfor;
	var numberOfBytes = (Wlen(StrQrData)+3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes/256));
	ESC_Value.push(ecGS + "(k" + pL + pH +"\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); // GS ( k <Function 181>
	
	ESC_Value.push(ecESC + "\x0C");//打印并回到标准模式（在页模式下）
	ESC_Value.push("\x1B\x53");//Select standard mode [ESC S] 	

    strbuf = ShiftSpace + '----------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
	
	//設備編號;文字靠左+ 設備編號 + 換行
	strbuf = ShiftSpace + '設備編號: ' + json_obj.terminal_sid;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	
	//列印軟體版本
	strbuf = ShiftSpace + 'Version: ' + json_obj.pos_ver;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//列印時間
    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = pad2(now.getMinutes());
    strbuf = ShiftSpace + "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行
	
    //---新增列印主體內容

    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}

function intToChar(integer) {
  return String.fromCharCode(integer)
}

function charToInt(char) {
  return char.charCodeAt(0)
}
