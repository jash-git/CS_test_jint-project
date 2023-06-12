//Invoice~57mm
const ecPage_57_Base_Left = ecGS + "\u004C" + "\u0046" + "\u0000";

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
	var str_debug_buf = '';//字串資料暫存變數
	
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
		//ESC_Value.push(ecPage_57_Base_Left);
		//ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化
    }
    //---判斷記錄輸入資料是否合法
	
	//---
	//設定 頁面模式 & 紙張大小	
	var Page_Width = 552; //57mm
	var Page_Height = 1180;// 設定紙張長度  // 目前找到的依據 (n / 2) * 0.125 = 紙張長度 mm  Ex: (1120 / 2) * 0.125 = 70mm
	var First_Position = 0;//96 // 要扣除掉Logo位置的部分

	var dxL = (Page_Width % 256); // 紙張寬度
	var dxH = parseInt(Page_Width/256);

	var dyL = (Page_Height % 256);// 紙張長度
	var dyH = parseInt(Page_Height/256);
	//str_debug_buf = "Page_Width:" + Page_Width +" ;Page_Height:" + Page_Height +" ;dxL:"+ dxL + " ;dxH:" + dxH + " ;dyL:" + dyL + " ;dyH:" + dyH;
	var nL = 0; 
	var nH = 0;
	var	pX = 0;

	ESC_Value.push("\x1B\x4C");//选择页模式 ESC L
	ESC_Value.push("\x1B\x57\x10\x00\x00\x00"+ String.fromCharCode(dxL) + String.fromCharCode(dxH) + String.fromCharCode(dyL) + String.fromCharCode(dyH));//在页模式下设置打印区域 ESC W xL(16) xH(0) yL(0) yH(0) dxL(200) dxH(1) dyL(156) dyH(4)
	ESC_Value.push("\x1B\x54\x00");//选择字符代码表 ESC T n ; HEX 1B 54 00	
	//---設定 頁面模式 & 紙張大小	
	
	//---
	//店家名 & LOGO
	nL = 45;
	nH = 1;
	ESC_Value.push(ecGS + "$" + String.fromCharCode(nL) + String.fromCharCode(nH)); // 垂直起始位置	(nL+(nH*256))*0.125=60*0.125=7.5mm	
	
	pX = Wlen(json_obj.store_name) * 25; // 大字形，每個英數字佔用 25 dot
	if (pX > Page_Width)
	{
		pX = Wlen(json_obj.store_name) * 12;//Wlen(json_obj.store_name) * 12; 
		strbuf = ecBIG_ON + json_obj.store_name + ecBIG_OFF;
	}
	else
	{
		strbuf = ecDOUBLE_ON + json_obj.store_name + ecDOUBLE_OFF;	
	}	
	nL = (parseInt(Page_Width / 2) - parseInt(pX / 2)) % 256;//116
	nH = parseInt((parseInt(Page_Width / 2) - parseInt(pX / 2)) / 256);//0
	ESC_Value.push(ecESC + "$" + String.fromCharCode(nL) + String.fromCharCode(nH)); // 水平位置	
	
	ESC_Value.push(strbuf);
	//---店家名 & LOGO
/*
	//---
	//電子發票證明聯
	pX = 128;
	nL = pX % 256;
	nH = parseInt(pX/256);
	ESC_Value.push(ecGS + "$" + String.fromCharCode(nL) + String.fromCharCode(nH)); // 垂直起始位置	(nL+(nH*256))*0.125=60*0.125=7.5mm	
	
	pX = Wlen("電子發票證明聯") * 25; // 大字形，每個英數字佔用 25 dot
	
	nL = (parseInt(Page_Width / 2) - parseInt(pX / 2)) % 256;//116
	nH = parseInt((parseInt(Page_Width / 2) - parseInt(pX / 2)) / 256);//0
	ESC_Value.push(ecESC + "$" + String.fromCharCode(nL) + String.fromCharCode(nH)); // 水平位置		

	ESC_Value.push(ecDOUBLE_ON + "電子發票證明聯" + ecDOUBLE_OFF);
	//---電子發票證明聯
*/
	
	ESC_Value.push(ecESC + "\x0C");//打印并回到标准模式（在页模式下）
	ESC_Value.push("\x1B\x53");//Select standard mode [ESC S] 
	
	
	ESC_Value.push(ecTEXT_ALIGN_LEFT + "DEBUG: "+ str_debug_buf);
	
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

