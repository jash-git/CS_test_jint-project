//---
//建立 ESC/POS Command
const ecESC = "\u001B";
const ecGS = "\u001D";
const ecSET_BIG5 = ecESC + "\u0039" + "\u0003"; //設定中文
const ecFREE_LINE = "\u000A";//單純換行
const ecINITIALIZE_PRINTER = ecESC + "@";//印表機初始化
const ecCUT_PAPER = ecGS + "\u0056" + "\u0041" + "\u0000";//切紙
const ecBOLD_ON = ecESC + "E" + "\u0001";//文字粗體_start
const ecBOLD_OFF = ecESC + "E" + "\0";//文字粗體_end
const ecDOUBLE_ON = ecGS + "!" + "\u0022";//文字放大2倍_start // 2x sized text (double-high + double-wide)
const ecDOUBLE_OFF = ecGS + "!" + "\0";//文字放大2倍_end
const ecTRIPLE_ON = ecGS + "!" + "\u0033";//文字放大3倍_start // 4x sized text (double-high + double-wide)
const ecTRIPLE_OFF = ecGS + "!" + "\0";//文字放大3倍_end
const ecFOUR_ON = ecGS + "!" + "\u0044";//文字放大4倍_start // 4x sized text (double-high + double-wide)
const ecFOUR_OFF = ecGS + "!" + "\0";//文字放大4倍_end
const ecBIG_ON = ecGS + "!" + "\u0001";//文字放大1倍_start // big sized text (double-high + normal-wide)
const ecBIG_OFF = ecGS + "!" + "\0";//文字放大1倍_end
const ecTEXT_ALIGN_LEFT = ecESC + "a" + "\u0048";//文字靠左
const ecTEXT_ALIGN_CENTER = ecESC + "a" + "\u0049";//文字至中

const ecTEXT_SPACE70 = ecESC + "\u0033" + "\u0046";//文字間距60

const ecPAGE_MODE = ecESC + "\u004C";//选择页模式 ESC L
const ecMOTION_UNITS = ecGS + "\u0050" + "\u0000" + "\u00CB"; //设置水平和垂直运动单位 GS P x y ;  // For 203 Dpi 
const ecAREA_SIZE = ecESC + "\u0057" + "\u0000" + "\u0000" + "\u0000" + "\u0000" + "\u00A0" + "\u0001" + "\u0058" + "\u0002";//在页模式下设置打印区域 ESC W xL xH yL yH dxL dxH dyL dyH
const ecTEXT_CODE = ecESC + "\u0054" + "\u0000";//选择字符代码表 ESC T n ; HEX 1B 54 00 
const ecRESET_PAGE_MODE = ecESC + "\u000C";//打印并回到标准模式（在页模式下）

const ecBAR_CODE_WIDTH = ecGS + "\u0077" + "\u0001";//设置条形码宽度 GS w n [29   119   4]
const ecBAR_CODE_HIGHT = ecGS + "\u0068" + "\u0032";//设置条形码高度 GS h n [29   104   50]
const ecBAR_CODE_HEAD = ecGS + "\u006B" + "\u0004"//打印条形码     GS   k   m    d1...dk   NUL [29   107  4    d1...dk   0 ]  
const ecBAR_CODE_END = "\0";//打印条形码     GS   k   m    d1...dk   NUL [29   107  4    d1...dk   0 ]

const CashCommand = ecESC + "\u0070" + "\u0000" + "\u006A" + "\u006A"; //指令: ESC p 0 100 100 [收銀機/抽屜]
//---建立 ESC/POS Command

//---
//全域外部參數
var PrinterParms = {};//全域印表參數
//---全域外部參數

/*
*數字補N位0 ~ https://blog.csdn.net/qq_41854291/article/details/115344291
*/
function PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}
/*
*數字補齊兩位
*/
function pad2(n) {
    return (n < 10 ? '0' : '') + n;
}

/*
*具有中文字的字串 列印寬度子字串連續分割轉陣列格式
*/
function String2Array(strInput, len) {
    intWStrPoint = 0;
    var strResult = [];
    var start = intWStrPoint;
    var strBuf = '';
    do {
        strBuf = '';
        strBuf = Wsubstring(strInput, start, len);
        start += intWStrPoint;
        if (Wlen(strBuf) > 0) {
            strResult.push(strBuf);
        }
        else {
            break;
        }
    } while (true);

    return strResult;
}

/*
*具有中文字的字串 列印寬度計算
*/
function Wlen(str) {
    return str.replace(/[^\x00-\xff]/g, "xx").length;
}

/*
*具有中文字的字串 列印寬度子字串分割
*/
var intWStrPoint = 0;//紀錄Wsubstring最後一次取得子字串列印寬度
function Wsubstring(data, start, len) {
    var strResult = '';
    var intAllEngLen = Wlen(data);
    if (intAllEngLen <= start) {
        strResult = '';
        intWStrPoint = start;
    }
    else {
        if (intAllEngLen <= len) {
            strResult = data;
            intWStrPoint = len;
        }
        else {
            var intNewLen = len;
            strResult = data.substr(start, len);

            while (Wlen(strResult) > len) {
                intNewLen--;
                strResult = data.substr(start, intNewLen);
            }

            intWStrPoint = intNewLen;
        }
    }

    return strResult;
}


function TypesettingSpace(StrCaption,intValue,intMaxLength ) {//排版空格字串
	var StrResult = '';
	var intCaptionLength = Wlen(StrCaption);//計算字串長度
	var intValueLength = Wlen(''+intValue);
	var intLength = intMaxLength-intCaptionLength-intValueLength;
	for(var i=0;i<intLength;i++)
	{
		StrResult += ' ';
	}
	return StrResult;
}

function DividingLine(StrDelimiter,intMaxLength ) {//分隔線字串
	var StrResult = '';
	for(var i=0;i<intMaxLength;i++)
	{
		StrResult += StrDelimiter;
	}
	return StrResult;
}

//---
//純粹收集 還未使用過JS
function decode(s) {
    //JS Unicode轉義(\uXXXX)的解碼 ~ https://www.twblogs.net/a/5c88ea23bd9eee35fc148602
    return unescape(s.replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1'));
}
function encode1(s) {
    //JS Unicode轉義(\uXXXX)的編碼 ~ https://www.twblogs.net/a/5c88ea23bd9eee35fc148602
    return escape(s).replace(/%(u[0-9A-F]{4})|(%[0-9A-F]{2})/gm, function ($0, $1, $2) {
        return $1 && '\\' + $1.toLowerCase() || unescape($2);
    });
}
function ascii_to_hex(str) {//English String to Hex String
    //https://www.codegrepper.com/code-examples/javascript/javascript+string+to+hexadecimal+format
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }

    return JSON.stringify(arr1);//arr1.join('');
}

function unicode_to_hex(str) {//Unicode String to Hex String
    //https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex ,"\u6f22\u5b57" === "漢字"
    //https://www.haomeili.net/HanZi/ZiFuBianMaZhuanHuan?ToCode=BIG5 ,226f 575b
    //https://www.fooish.com/javascript/string/substr.html ,字串切割
    var arr1 = [];
    //var str1 = unescape(encodeURIComponent(str));
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        if (hex.length < 4) {
            arr1.push(hex);
        }
        else {
            /*
            var buf = hex.substr(2, 2) +hex.substr(0, 2);
            arr1.push(buf);
            */
            arr1.push(hex.substr(0, 2));
            arr1.push(hex.substr(2, 2));
            
        }
        
    }

    return JSON.stringify(arr1);//arr1.join('');
}

function utf8_to_hex(data) {
    //https://juejin.cn/post/7023214891959844871
    let parsedData = [];

    for (let i = 0, l = data.length; i < l; i++) {
        let byteArray = [];
        // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码，返回值是 0 - 65535 
        // 之间的整数，表示给定索引处的 UTF-16 代码单元。
        let code = data.charCodeAt(i);

        // 十六进制转十进制：0x10000 ==> 65535  0x800 ==> 2048  0x80 ==> 128
        if (code > 0x10000) { // 4个字节
            // 0xf0 ==> 11110000 
            // 0x80 ==> 10000000

            byteArray[0] = 0xf0 | ((code & 0x1c0000) >>> 18); // 第 1 个字节
            byteArray[1] = 0x80 | ((code & 0x3f000) >>> 12); // 第 2 个字节
            byteArray[2] = 0x80 | ((code & 0xfc0) >>> 6); // 第 3 个字节
            byteArray[3] = 0x80 | (code & 0x3f); // 第 4 个字节

        } else if (code > 0x800) { // 3个字节
            // 0xe0 ==> 11100000
            // 0x80 ==> 10000000

            byteArray[0] = 0xe0 | ((code & 0xf000) >>> 12);
            byteArray[1] = 0x80 | ((code & 0xfc0) >>> 6);
            byteArray[2] = 0x80 | (code & 0x3f);

        } else if (code > 0x80) { // 2个字节
            // 0xc0 ==> 11000000
            // 0x80 ==> 10000000

            byteArray[0] = 0xc0 | ((code & 0x7c0) >>> 6);
            byteArray[1] = 0x80 | (code & 0x3f);

        } else { // 1个字节

            byteArray[0] = code;
        }

        parsedData.push(byteArray);
    }

    return JSON.stringify(parsedData);
    /*
    parsedData = Array.prototype.concat.apply([], parsedData);

    console.log('输出结果：', parsedData);
    console.log('转二进制：',
        parseInt(parsedData[0].toString(2)),
        parseInt(parsedData[1].toString(2)),
        parseInt(parsedData[2].toString(2)),
    );
    */
}
//---純粹收集 還未使用過JS

//---
//基本C# 呼叫 JS 範例
function JSCallJS(a, b) {
    return "" + (GetSum(a, b) + 10);
}

function GetSum(a, b) {
    return a + b;
}


function Echo() {
    return str + " From Javascript";
}

function CallServerFunc(name) {
    return name + " From Javascript - CallServerFunc";
}

function CallServerFunc2(name) {
    return testapi.GetStringFromClassFunction(name) + " From Javascript - CallServerFunc";

}

/*
 * JS 解析JSON字串&建立JS 陣列物件
 */
function parseJson() {
    /*
    { "sites" : [{ "name":"Runoob" , "url":"www.runoob.com" },{ "name":"Google" , "url":"www.google.com" },{ "name":"Taobao" , "url":"www.taobao.com" } ]} 
     */
    obj = JSON.parse(json_data);

    var data = '';
    for (var i = 0; i < obj.sites.length; i++) {
        data += obj.sites[i].name + " : " + obj.sites[i].url+"\n";
    }

    return data;
}

/*
 * 建立JS 陣列物件 轉成 C#標準可解析JSON字串
 */
function obj2JsonString() {
    /*
    { "sites" : [{ "name":"Runoob" , "url":"www.runoob.com" },{ "name":"Google" , "url":"www.google.com" },{ "name":"Taobao" , "url":"www.taobao.com" } ]} 
     */
    input = JSON.parse(json_data);

    var output = [];
    for (var i = 0; i < input.sites.length; i++) {
        var obj = {};
        obj.ShowName = input.sites[i].name;
        obj.Url = input.sites[i].url;
        output.push(obj);
    }

    data = '{"obj":' + JSON.stringify(output) + '}';//手動增加C#拆解Json字串所需外框
    /*
    //C# 對應 class
    public class JsonArray
    {
        public List<string> data { get; set; }
    }
    */ 
    return data;
}
//---基本C# 呼叫 JS 範例

function Test_String2Array()
{
	//var strInput='10中文字';//4
	var strInput ='0中文字1中文字2中文字3中文字4中文字5中文字6中文字7中文字8中文字9中文字10中文字';//24
	//var strInput='中文0字';//6
	var strResult = '';
	
	var array = String2Array(strInput,24);
	for(var i=0;i<array.length;i++)
	{
		strResult += array[i]+"\n";
	}
	
	return strResult;
	
	/*
	驗證用
	Wlen('0中文字1中文字2中文字3中')
	Wlen('文字4中文字5中文字6中文')
	Wlen('字7中文字8中文字9中文字1')
	Wlen('0中文字')	
	*/
	
}

function GlobalVariable_Init()
{//解析C#傳送過來的印表參數並修改對應全域變數

    //---
    //將輸入文字轉成JSON物件
    try {
        json_obj = JSON.parse(TemplateVar);
    }
    catch (e) {
        json_obj = null;
    }
    //---將輸入文字轉成JSON物件
	
    if (json_obj == null) {
        PrinterParms.print_logo = "N";//企業Logo
        PrinterParms.conn_cash_box = "N";
        PrinterParms.print_barcode = "N";//列印條碼
        PrinterParms.start_buzzer = "N";//開啟提示音
        PrinterParms.external_buzzer = "N";//外接蜂鳴器
        PrinterParms.big_callnum = "N";//取餐號加大
        PrinterParms.big_order_type = "N";//訂單類型加大
        PrinterParms.big_takeaways_no = "N";//外賣單號加大
        PrinterParms.big_table = "N";//桌號加大
        PrinterParms.print_product_price = "N";//列印商品金額
        PrinterParms.product_single_cut = "N";//一菜一切
        PrinterParms.merge_product = "N";//商品合併列印
        PrinterParms.single_report = "N";//只印簡表
        PrinterParms.no_print_price = "N";//不印價格
        PrinterParms.print_ticket_memo = "N";//列印備註
        PrinterParms.label_bottom_info = "";//底部列印資訊
    }
    else {
        PrinterParms = json_obj;
	}		
}
