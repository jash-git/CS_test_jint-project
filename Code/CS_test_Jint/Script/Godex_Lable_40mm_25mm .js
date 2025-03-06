//---
//建立 40 mm,25 mm 標籤機 Command
const lcPOSITION_X = 15;//起始定位座標點
const lcPOSITION_Y = 10;//起始定位座標點
const lcPOSITION_HalfWidth = 175;
const lcWORD_COUNT = 24;//(12*2)一行英文最多字數(SIZE 40 mm,25 mm)

const lcSET_PAGE_SIZE = '^W40\r\n';//設定紙張寬
const lcSET_GAP_DISTANCE = '^Q25,0,3\r\n';//設定紙張寬+間隙
const lcSET_COLORSHADE = '^H10\r\n';//黑度
const lcSET_SPEED = '^S3\r\n';//速度
const lcPRINTEND = '^P1\r\n';//指定設定列印資料對應列印張數
const lcSET_COPY = '^C1\r\n';//設定複製張數
const lcSET_DATA_START = '^L\r\n';//資料開始
const lcSET_DATA_END = 'E\r\n';//資料結束

const lcINITIALIZE_PRINTER = lcSET_PAGE_SIZE + lcSET_GAP_DISTANCE + lcSET_COLORSHADE + lcPRINTEND + lcSET_COPY + lcSET_DATA_START;//印表機初始化

const lcFONT_NAME = 'Arial';
const lcFONT_SIZE02 = 45;//字型大小3 => H=75,W=13
const lcFONT_SIZE02 = 30;//字型大小2 => H=50,W=13
const lcFONT_SIZE01 = 20;//字型大小1 => H=25,W=13

//---建立 40 mm,25 mm 標籤機 Command

//---
//全域外部參數
var PrinterParms = {};//全域印表參數
var Log_Value = [];//所有除錯用Log物件
//---全域外部參數

//標籤40 mm,25 mm範本
function Main() {
    //JSON資料顯示格式轉換: https://jsonformatter.org/
	//測試資料來源: C:\Users\devel\Desktop\CS_VPOS\CS_VPOS\Json2Class\orders_new.cs
    var Result = {};//最終結果物件
    var json_obj = {};//輸入字串的JSON物件
    var CMD_Value = [];//存放記錄所有產出的列印資訊陣列
    var strbuf = '';//字串資料暫存變數

    //---
    //將輸入文字轉成JSON物件
    try {
        json_obj = JSON.parse(input);
        WriteLog("input 解析成功");
        WriteLog(json_obj.store_name);
    }
    catch (e) {
        json_obj = null;
        WriteLog(e.message);
        WriteLog("input 解析失敗");
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
        CMD_Value.push(lcINITIALIZE_PRINTER);//印表機初始化
    }
    //---判斷記錄輸入資料是否合法

    GlobalVariable_Init();//解析C#傳送過來的印表參數並修改對應全域變數

    //---
    //新增列印主體內容

	//日期&時間
    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
	
    var AllCount = json_obj.item_count;//產品總數量
	var Num = 0;//目前在第幾號產品
	
    if (json_obj.order_items != null) {
        for (var i = 0; i < json_obj.order_items.length; i++) {
			for(var j=0;j<json_obj.order_items[i].count;j++){
				var PositionY_Buf = 0;
				Num++;
                CMD_Value.push(lcSET_SPEED);
				
				//訂單類型+產品編號
				strbuf = '"' + json_obj.order_type_name + '(' + AllCount + '-' + Num + ')' + '"';
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE01 + strbuf + lcEND);
				
                //單號
                var order_noAry = json_obj.order_no.split('-');
                strbuf = '"' + json_obj.call_num + '"';
				var POSITION_numY =50;//單號字高
				CMD_Value.push(lcDATA_START + lcPOSITION_HalfWidth + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				//日期
				strbuf = '"' + month + '/' + day + '"';
				var POSITION_dayX = lcPOSITION_HalfWidth +(13*Wlen(order_noAry[1]));
				CMD_Value.push(lcDATA_START + POSITION_dayX + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE01 + strbuf + lcEND);
				
				//時間
				strbuf = '"' + hour + ':' + minute + '"';
				var POSITION_timeY=lcPOSITION_Y+25;
				CMD_Value.push(lcDATA_START + POSITION_dayX + ',' + POSITION_timeY + ',' + lcFONT_SIZE01 + strbuf + lcEND);
				
				//---
				//產品+配料		

				//產品
				strbuf = '"' + json_obj.order_items[i].product_name + '"'; //取出產品名稱
				var POSITION_nameY =50;//產品名稱字高
				var POSITION_Y = lcPOSITION_Y + POSITION_numY;
				PositionY_Buf = POSITION_Y + POSITION_nameY/2;
                CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_Y + ',' + lcFONT_SIZE02 + strbuf + lcEND);

				//分隔線
				var Delimiter = '------------------------'	
				strbuf = '"' + Delimiter + '"';
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);				
				
				var POSITION_Line = 10;
				PositionY_Buf += POSITION_Line;
				
				//配料
                if (json_obj.order_items[i].condiments != null) {
                    strbuf = '';
                    for (var k = 0; k < json_obj.order_items[i].condiments.length; k++) {
                        strbuf += '(' + json_obj.order_items[i].condiments[k].condiment_name + ')';		
                    }
                    
                    var array = String2Array(strbuf, 24);
                    for (var l = 0; l < array.length; l++) {
                        PositionY_Buf = lcPOSITION_Y + POSITION_numY + POSITION_nameY + POSITION_Line + (l * 25);
                        strbuf = '"  ' + array[l]+'"';
                        CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE01 + strbuf + lcEND);
                    }
				}
				else{//沒有配料 也要有空白列 ~ 排版一致性
					PositionY_Buf = lcPOSITION_Y + POSITION_numY + POSITION_nameY + POSITION_Line;
					strbuf = '"  "';
					CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE01 + strbuf + lcEND);
				}					
				//---產品+配料
                
				//金額
				PositionY_Buf += 25;
                if (PrinterParms.no_print_price == "N") {//不印價格
                    strbuf = '"$' + json_obj.order_items[i].amount + '"';
                }
                else {
                    strbuf = '"' + '"';
                }		
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				CMD_Value.push(lcPRINTEND);//"PRINT 1,1\r\n"				
			}

        }
		
    }
    //---新增列印主體內容


    Result.value = CMD_Value;
    Result.log = Log_Value;
    return JSON.stringify(Result);
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
function Wlen(val) {
    var str = "" + val;//確保JS一定將該變數型態其判斷為字串
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

function GlobalVariable_Init() {//解析C#傳送過來的印表參數並修改對應全域變數
    var json_obj = {};//輸入字串的JSON物件 區域變數

    //---
    //將輸入文字轉成JSON物件
    try {
        json_obj = JSON.parse(TemplateVar);
        WriteLog("GlobalVariable_Init 解析成功")
    }
    catch (e) {
        WriteLog("GlobalVariable_Init 解析錯誤")
        json_obj = null;
        WriteLog(e.message);
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

function WriteLog(Messages) {//將想要紀錄資訊寫在記憶體中，有需要時拿出來分析判讀(韌體除錯技巧)
    var time = new Date();
    Log_Value.push(time.toLocaleString() + " : " + Messages);
}

/*
						   //command_type, data, coordinate_X, coordinate_Y, font_name, text_Size, qr_Mul, qr_Mode, qr_Type, qr_Mask, qr_Deg, qr_ErrorLevel, qr_Encoding
var cmd1 = CreateGodexCmdObj(undefined,"^L");
var cmd2 = CreateGodexCmdObj("TEXT","中文測試", 30, 40, undefined, 35);
var cmd3 = CreateGodexCmdObj("QRCODE","20250101-0202-0303-000000000000001111111111222222222222", 100, 200);
// 按此方式創建其餘的資料元件

CMD_Value.push(cmd1);
CMD_Value.push(cmd2);
CMD_Value.push(cmd3);
// 重複上述步驟以添加更多物件

console.log(JSON.stringify(CMD_Value));
[
	{
	"command_type": "SET",
	"data": "^L",
	"coordinate_x": 0,
	"coordinate_y": 0,
	"font_name": "Arial",
	"text_size": 20,
	"qr_mode": 3,
	"qr_type": 2,
	"qr_qr_errorlevel": "M",
	"qr_mask": 8,
	"qr_mul": 5,
	"qr_deg": 0,
	"qr_encoding": 0
	},
	{
	"command_type": "TEXT",
	"data": "中文測試",
	"coordinate_x": 30,
	"coordinate_y": 40,
	"font_name": "Arial",
	"text_size": 35,
	"qr_mode": 3,
	"qr_type": 2,
	"qr_qr_errorlevel": "M",
	"qr_mask": 8,
	"qr_mul": 5,
	"qr_deg": 0,
	"qr_encoding": 0
	},
	{
	"command_type": "QRCODE",
	"data": "20250101-0202-0303-000000000000001111111111222222222222",
	"coordinate_x": 100,
	"coordinate_y": 200,
	"font_name": "Arial",
	"text_size": 20,
	"qr_mode": 3,
	"qr_type": 2,
	"qr_qr_errorlevel": "M",
	"qr_mask": 8,
	"qr_mul": 3,
	"qr_deg": 0,
	"qr_encoding": 0
	}
]
*/
function CreateGodexCmdObj(command_type=undefined, data=undefined, coordinate_X=undefined, coordinate_Y=undefined, font_name=undefined, text_Size=undefined, qr_Mul=undefined, qr_Mode=undefined, qr_Type=undefined, qr_Mask=undefined, qr_Deg=undefined, qr_ErrorLevel=undefined, qr_Encoding=undefined) {
	var cmd = {
		"command_type": "SET",
		"data": "",
		"coordinate_x": 0,
		"coordinate_y": 0,
		"font_name": "Arial",
		"text_size":20,
		"qr_mode":3,
		"qr_type":2,
		"qr_qr_errorlevel":"M",
		"qr_mask":8,
		"qr_mul":5,
		"qr_deg":0,
		"qr_encoding":0
	};
	if (command_type !== undefined) cmd.command_type = command_type;
	if (data !== undefined) cmd.data = data;
	if (coordinate_X !== undefined) cmd.coordinate_x = coordinate_X;
	if (coordinate_Y !== undefined) cmd.coordinate_y = coordinate_Y;
	if (font_name !== undefined) cmd.font_name = font_name;
	if (text_Size !== undefined) cmd.text_size = text_Size;
	if (qr_Mode !== undefined) cmd.qr_mode = qr_Mode;
	if (qr_Type !== undefined) cmd.qr_type = qr_Type;
	if (qr_ErrorLevel !== undefined) cmd.qr_errorlevel = qr_ErrorLevel;
	if (qr_Mask !== undefined) cmd.qr_mask = qr_Mask;
	if (qr_Mul !== undefined) cmd.qr_mul = qr_Mul;    
	if(data.length>70)
	{
		cmd.qr_mul = 2;
	}
	else if(data.length > 50)
	{
		cmd.qr_mul = 3;
	}
	else if(data.length > 30)
	{
		cmd.qr_mul = 4;
	}            
	if (qr_Deg !== undefined) cmd.qr_deg = qr_Deg;
	if (qr_Encoding !== undefined) cmd.qr_encoding = qr_Encoding;
	
	return cmd;
}