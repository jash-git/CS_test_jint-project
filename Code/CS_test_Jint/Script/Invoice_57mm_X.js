//Invoice~57mm
const ecTEXT_SPACE70 = ecESC + "\u0033" + "\u0046";//文字間距60

const ecPAGE_MODE = ecESC + "\u004C";//选择页模式 ESC L
const ecMOTION_UNITS = ecGS + "\u0050" + "\u0000" + "\u00CB"; //设置水平和垂直运动单位 GS P x y ;  // For 203 Dpi 
const ecAREA_SIZE = ecESC + "\u0057" + "\u0000" + "\u0000" + "\u0000" + "\u0000" + "\u00A0" + "\u0001" + "\u0058" + "\u0002" ;//在页模式下设置打印区域 ESC W xL xH yL yH dxL dxH dyL dyH
const ecTEXT_CODE = ecESC + "\u0054" + "\u0000";//选择字符代码表 ESC T n ; HEX 1B 54 00 
const ecRESET_PAGE_MODE = ecESC + "\u000C";//打印并回到标准模式（在页模式下）

const ecBAR_CODE_WIDTH = ecGS + "\u0077" + "\u0001";//设置条形码宽度 GS w n [29   119   4]
const ecBAR_CODE_HIGHT = ecGS + "\u0068" + "\u0032";//设置条形码高度 GS h n [29   104   50]
const ecBAR_CODE_HEAD = ecGS + "\u006B" + "\u0004"//打印条形码     GS   k   m    d1...dk   NUL [29   107  4    d1...dk   0 ]  
const ecBAR_CODE_END = "\0";//打印条形码     GS   k   m    d1...dk   NUL [29   107  4    d1...dk   0 ]

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
		ESC_Value.push(ecTEXT_SPACE);//文字間距
    }
    //---判斷記錄輸入資料是否合法	
	//---
	//店家名 & LOGO
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + json_obj.store_name + ecDOUBLE_OFF + ecFREE_LINE);
	//---店家名 & LOGO
	
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + "電子發票證明聯" + ecDOUBLE_OFF + ecFREE_LINE);
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + "104年1-4月" + ecDOUBLE_OFF + ecFREE_LINE);
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + "UZ-17690872(測)" + ecDOUBLE_OFF + ecFREE_LINE);

	//---
	//列印時間;文字靠左 + 列印時間 + 換行
	ESC_Value.push(ecTEXT_SPACE70);
    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = pad2(now.getMinutes());
	second = pad2(now.getSeconds());
    strbuf = ShiftSpace + year + "-" + month + "-" + day + " " + hour + ':' + minute + ':' + second;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行
	//---列印時間;文字靠左 + 列印時間 + 換行
	
	strbuf = ShiftSpace + "隨機碼: " + "0122" + "       總計: " + "220";
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 隨機碼&總計 + 換行
	
	strbuf = ShiftSpace + "賣方: " + "28537502" + "     買方: " + "";
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 統編 + 換行	
	
	//---
	//BarCode
	ESC_Value.push(ecBAR_CODE_HIGHT);	
	ESC_Value.push(ecBAR_CODE_WIDTH);
	
	var StrBarCode = "10404UZ176908720122";//年月-發票號碼-隨機嗎
	ESC_Value.push(ecTEXT_ALIGN_CENTER);
	ESC_Value.push(ecBAR_CODE_HEAD + StrBarCode + ecBAR_CODE_END);//BarCode Code39
	//---BarCode
	
	//---
	//紙張設定
	ESC_Value.push("\x1B\x4C");//选择页模式 ESC L
	//ESC_Value.push("\x1D\x50\x00\xCB");//设置水平和垂直运动单位 GS P x y ;// For 203 Dpi
	ESC_Value.push("\x1B\x57\x00\x00\x00\x00\x80\x02\x30\x02");//在页模式下设置打印区域 ESC W xL xH yL yH dxL dxH dyL dyH; [456%256=200(C8) 456/256=1(01) [57mm]; 480%256=244(F4) 480/256=1(01)[30mm]
	ESC_Value.push("\x1B\x54\x00");//选择字符代码表 ESC T n ; HEX 1B 54 00	
	//---紙張設定		
	

	
	//---
	//QR CODE
	//*
	ESC_Value.push(ecGS + "$" + '\x10' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x4A' + '\x00')//水平定位 [ESC $ nL nH 设置绝对打印位置] 90,0
	ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	
	var StrQrData = "AB112233441020523999900000144000001540000000001234567ydXZt4LAN1UHN/j1juVcRA==:**********:3:3:2:5Lm+6Zu75rGg";
	var numberOfBytes = (Wlen(StrQrData)+3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes/256));
	ESC_Value.push(ecGS + "(k" + pL + pH +"\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); // GS ( k <Function 181>
	//*/
	
	ESC_Value.push(ecGS + "$" + '\x10' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x1F' + '\x01')//水平定位 [ESC $ nL nH 设置绝对打印位置]
	ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	
	StrQrData = "**OjE6MTA1OuWPo+e9qToxOjIxMDrniZvlpbY6MToyNQ==";
	var numberOfBytes = (Wlen(StrQrData)+3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes/256));
	ESC_Value.push(ecGS + "(k" + pL + pH +"\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); 	
	

	//---QR CODE
	

	ESC_Value.push(ecESC + "\x0C");//打印并回到标准模式（在页模式下）
	ESC_Value.push("\x1B\x53");//Select standard mode [ESC S] 
	
	strbuf = ShiftSpace + "店家: " + numberOfBytes;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + "機號: ";
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	
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

