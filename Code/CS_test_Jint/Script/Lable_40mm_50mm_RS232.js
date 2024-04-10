//---
//建立 40 mm,50 mm 標籤機 Command
const lcPOSITION_X = 15;//起始定位座標點
const lcPOSITION_Y = 8;//起始定位座標點
const lcPOSITION_HalfWidth = 175;//紙張一半的平移座標
const lcWORD_COUNT = 24;//(12*2)一行英文最多字數(SIZE 40 mm,50 mm)

const lcSET_PAGE_SIZE = 'SIZE 40 mm,50 mm\r\n';//設定紙張大小 [400(40*10) * 500(50*10)]
const lcSET_GAP_DISTANCE = 'GAP 3 mm,0 mm\r\n';//設定紙張間隙
const lcSET_DIRECTION = 'DIRECTION 1\r\n'; //設定紙張方向
const lcCLEAR = 'CLS\r\n';//清除影像暫存
const lcSET_BIG5 = 'CODEPAGE 950\r\n';//設定語系

const lcINITIALIZE_PRINTER = lcSET_PAGE_SIZE + lcSET_GAP_DISTANCE + lcSET_DIRECTION + lcSET_BIG5;//印表機初始化

//DataStart + PositionX + ',' + PositionY + ',' + FontSizeXX + " + strbuf + " + End
const lcDATA_START = 'TEXT ';
const lcFONT_SIZE03 = '"TST24.BF2",0,1,3,';//字型大小3 => H=75,W=13
const lcFONT_SIZE02 = '"TST24.BF2",0,1,2,';//字型大小2 => H=50,W=13
const lcFONT_SIZE01 = '"TST24.BF2",0,1,1,';//字型大小1 => H=25,W=13
const lcEND = '\r\n';

const lcQRCODE = 'QRCODE 93, 158, M, 4, A, 0, J1, M2, X140, S7,';//座標X(13*6+15),座標Y(108+50),纠错等级(M),模块宽度(4),编码模式(A),旋转(0),[对齐方式(J1)],模式(M2),[最大条码区域(X150)],编码数据(S7)
//const lcQRCODE = 'QRCODE 93,158,M,4,A,0,M2,S7,';

const lcPRINTEND = "PRINT 1,1\r\n";//指定設定列印資料對應列印張數
//---建立 40 mm,50 mm 標籤機 Command

//---
//全域外部參數
var PrinterParms = {};//全域印表參數
var Log_Value = [];//所有除錯用Log物件
//---全域外部參數

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
            for (var j = 0; j < json_obj.order_items[i].count; j++) {
                var PositionY_Buf = 0;
                Num++;
                CMD_Value.push(lcCLEAR);//清除影像暫存

                //[訂單類型]+單號
                strbuf = '"[' + json_obj.order_type_name + ']' + json_obj.call_num + '"';
                CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE01 + strbuf + lcEND);

                //產品編號
                strbuf = '"' + Num + '-' + AllCount + '"';
                var POSITION_numX = lcPOSITION_HalfWidth + ((12 - Wlen(Num + '-' + AllCount)) * 13) - lcPOSITION_X;//12:一半為12字;13:字寬
                var POSITION_numY = 25;
                CMD_Value.push(lcDATA_START + POSITION_numX + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE01 + strbuf + lcEND);


                //---
                //產品+配料		

                //產品
                strbuf = '"' + json_obj.order_items[i].product_name + '"'; //取出產品名稱
                var POSITION_nameY = 50;//產品名稱字高
                var POSITION_Y = lcPOSITION_Y + POSITION_numY;//起始點+產品編號高度
                PositionY_Buf = POSITION_Y + POSITION_nameY / 2;
                CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_Y + ',' + lcFONT_SIZE02 + strbuf + lcEND);

                var StrCondiment_code = '';
                //配料
                if (json_obj.order_items[i].condiments != null) {
                    strbuf = '-';
                    for (var k = 0; k < json_obj.order_items[i].condiments.length; k++) {
                        if (k == 0) {
                            strbuf += json_obj.order_items[i].condiments[k].condiment_name;
                            StrCondiment_code = json_obj.order_items[i].condiments[k].condiment_code;
                        }
                        else {
                            strbuf += ',' + json_obj.order_items[i].condiments[k].condiment_name;
                            StrCondiment_code += ',' + json_obj.order_items[i].condiments[k].condiment_code;
                        }
                    }

                    var array = String2Array(strbuf, 24);
                    for (var l = 0; l < array.length; l++) {
                        PositionY_Buf = lcPOSITION_Y + POSITION_numY + POSITION_nameY + (l * 25);
                        strbuf = '"  ' + array[l] + '"';
                        CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE01 + strbuf + lcEND);
                    }
                }
                else {//沒有配料 也要有空白列 ~ 排版一致性
                    PositionY_Buf = lcPOSITION_Y + POSITION_numY + POSITION_nameY;
                    strbuf = '"  "';
                    CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE01 + strbuf + lcEND);
                }
                //---產品+配料

                //QR code
                strbuf = '"';
                strbuf += json_obj.order_no.replace('-', '') + '|' + json_obj.order_items[i].product_code + '|' + StrCondiment_code;//訂單編號
                strbuf += '"';
                CMD_Value.push(lcQRCODE + strbuf + lcEND);

                //time
                var POSITION_timeY = 310;
                strbuf = '"' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + '"';
                CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_timeY + ',' + lcFONT_SIZE01 + strbuf + lcEND);

                //金額
                var POSITION_priceY = POSITION_timeY + 0;
                var POSITION_priceX = 0;
                if (PrinterParms.no_print_price == "N") {//不印價格
                    strbuf = '"TWD ' + json_obj.order_items[i].amount + '"';
                    POSITION_priceX = lcPOSITION_HalfWidth + ((12 - Wlen(strbuf) + 2) * 13) - lcPOSITION_X;//12:一半為12字;13:字寬
                }
                else {
                    strbuf = '"' + '"';
                }
                CMD_Value.push(lcDATA_START + POSITION_priceX + ',' + POSITION_priceY + ',' + lcFONT_SIZE02 + strbuf + lcEND);

                //店家名稱
                var POSITION_storeY = POSITION_timeY + 25;
                strbuf = '"' + json_obj.store_name + '"';
                CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_storeY + ',' + lcFONT_SIZE01 + strbuf + lcEND);

                //標籤底部
                var POSITION_lableY = POSITION_storeY + 25;
                strbuf = '"' + PrinterParms.label_bottom_info + '"';
                CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_lableY + ',' + lcFONT_SIZE01 + strbuf + lcEND);

                CMD_Value.push(lcPRINTEND);//"PRINT 1,1\r\n"

            }
            //只印一張除錯用 break;
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