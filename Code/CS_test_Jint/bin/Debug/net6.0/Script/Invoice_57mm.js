//Invoice~57mm

const ecBAR_CODE_WIDTH = ecGS + "\u0077" + "\u0003";//设置条形码宽度 GS w n [29   119   4]
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
    }
    //---判斷記錄輸入資料是否合法
	
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
	
	//---
	//BarCode
	ESC_Value.push(ecBAR_CODE_HIGHT);	
	ESC_Value.push(ecBAR_CODE_WIDTH);
	
	var StrBarCode = "ABCD 39";
	ESC_Value.push(ecTEXT_ALIGN_CENTER);
	ESC_Value.push(ecBAR_CODE_HEAD + StrBarCode + ecBAR_CODE_END);
	
	ESC_Value.push(ecTEXT_ALIGN_CENTER);
	ESC_Value.push("\x1d\x6b\x04\x43\x4f\x44\x45\x20\x33\x39\x00");//Encode the text "CODE 39" as a Code 39 barcode
	
	ESC_Value.push(ecTEXT_ALIGN_CENTER);
	ESC_Value.push("\x1d\x6b\x08\x7b\x42\x43\x6f\x64\x65\x20\x31\x32\x38\x00");//Encode the text "Code 128" as a Code 128 barcode
	//---BarCode
	
	//---
	//Dynamic 2D Barcode
	ESC_Value.push("\1d\x28\x6b")                      // start command
	ESC_Value.push("\x1f\x00")                         // string length (28 bytes + 3)
	ESC_Value.push("\x31\x50\x31")                     // rest of command...
	ESC_Value.push("https://pyramidacceptors.com")     // Actual string
	//ESC_Value.push("\x1d\x28\x6b\x03\x00\x31\x51\x31") // Print now	
	//---Dynamic 2D Barcode
	
	ESC_Value.push(ecCUT_PAPER);//切紙
	
    Result.value = ESC_Value;
    return JSON.stringify(Result);	
}