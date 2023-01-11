//---
//建立 40 mm,60 mm 標籤機 Command
const lcPOSITION_X = 20;//起始定位座標點
const lcPOSITION_Y = 10;//起始定位座標點
const lcPOSITION_HalfWidth = 175;
const lcWORD_COUNT = 24;//(12*2)一行英文最多字數(SIZE 40 mm,60 mm)

const lcSET_PAGE_SIZE = 'SIZE 40 mm,60 mm\r\n';//設定紙張大小
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

const lcPRINTEND = "PRINT 1,1\r\n";//指定設定列印資料對應列印張數
//---建立 40 mm,60 mm 標籤機 Command

//標籤40 mm,60 mm範本
function Main() {
    //JSON資料顯示格式轉換: https://jsonformatter.org/
	//測試資料來源: C:\Users\devel\Desktop\CS_VPOS\CS_VPOS\Json2Class\orders_new.cs
    var Result = {};//最終結果物件
    var input_obj = {};//輸入字串的JSON物件
	var memo_obj = {};//輸入對應
    var CMD_Value = [];//存放記錄所有產出的列印資訊陣列
    var strbuf = '';//字串資料暫存變數

    //---
    //將輸入文字轉成JSON物件
    try {
        input_obj = JSON.parse(input);
    }
    catch (e) {
        input_obj = null;
    }
	
    try {
        memo_obj = JSON.parse(memo);
    }
    catch (e) {
        memo_obj = null;
    }	
    //---將輸入文字轉成JSON物件

    //---
    //判斷記錄輸入資料是否合法
    if (input_obj == null) {
        Result.state_code = 1;
        return JSON.stringify(Result);        
    }
    else {
        Result.state_code = 0;
        CMD_Value.push(lcINITIALIZE_PRINTER);//印表機初始化
    }
    //---判斷記錄輸入資料是否合法

    //---
    //新增列印主體內容

	//日期&時間
    var date = new Date(input_obj.order_time * 1000);//input_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
	
    var AllCount = input_obj.item_count;//產品總數量
	var Num = 0;//目前在第幾號產品
	var PositionY_Shift = 0;
	
    if (input_obj.order_items != null) {
        for (var i = 0; i < input_obj.order_items.length; i++) {
			for(var j=0;j<input_obj.order_items[i].count;j++){
				var PositionY_Buf = 0;
				Num++;
                CMD_Value.push(lcCLEAR);
				
				//單號
				var order_noAry = input_obj.order_no.split('-');
				strbuf = '"' + order_noAry[1] + '"';
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				
				//日期
				strbuf = '"' + month + '/' + day + '"';
				CMD_Value.push(lcDATA_START + lcPOSITION_HalfWidth + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE02 + strbuf + lcEND);

				
				//時間
				strbuf = '"' + hour + ':' + minute + '"';				
				var POSITION_dayX = lcPOSITION_HalfWidth +(13*Wlen(month + '-' + day));
				CMD_Value.push(lcDATA_START + POSITION_dayX + ',' + lcPOSITION_Y + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				
				//分隔線
				var Delimiter = '------------------------'	
				strbuf = '"' + Delimiter + '"';
				PositionY_Shift = lcPOSITION_Y;
				var POSITION_LineY = PositionY_Shift + (50/2);
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_LineY + ',' + lcFONT_SIZE02 + strbuf + lcEND);

				//訂單類型 + 產品
				if( (Wlen(input_obj.order_type_name)+Wlen(input_obj.order_items[i].product_name))>=22)
				{
					strbuf = input_obj.order_type_name + "  " + input_obj.order_items[i].product_name;
				}
				else
				{
					strbuf = input_obj.order_type_name;
					for(var l=0;l<(24-(Wlen(input_obj.order_type_name)+Wlen(input_obj.order_items[i].product_name)));l++)
					{
						strbuf += ' ';
					}
					strbuf += input_obj.order_items[i].product_name;
				}
				
				var array = String2Array(strbuf, 24);
				PositionY_Shift = POSITION_LineY + 50;
				for (var l = 0; l < array.length; l++) {
					PositionY_Buf = PositionY_Shift + (l * 50);
					strbuf = '"' + array[l] + '"';
					CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				}
				
				
				//配料 + 金額
				PositionY_Shift = PositionY_Buf + 50;
                if (input_obj.order_items[i].condiments != null) {
                    var condiments = '';
                    for (var k = 0; k < input_obj.order_items[i].condiments.length; k++) {
						if(k==0)
						{
							condiments = input_obj.order_items[i].condiments[k].condiment_name;
						}
						else
						{
							condiments += ' ' + input_obj.order_items[i].condiments[k].condiment_name;
						}
                    }
					
                    if((Wlen(condiments)+Wlen('$'+input_obj.order_items[i].amount))>=22)
					{
						strbuf = condiments + "  " + input_obj.order_items[i].amount;
					}
					else
					{
						strbuf = condiments;
						for(var l=0;l<(24-(Wlen(condiments)+Wlen('$'+input_obj.order_items[i].amount)));l++)
						{
							strbuf += ' ';
						}
						strbuf += '$' + input_obj.order_items[i].amount;						
					}
					
                    var array01 = String2Array(strbuf, 24);				
                    for (var l = 0; l < array01.length; l++) {
                        PositionY_Buf = PositionY_Shift + (l * 50);
                        strbuf = '"' + array01[l] + '"';
                        CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
                    }
				}
				else
				{
					PositionY_Buf = PositionY_Shift;
					strbuf = '';
					for(var l=0;l<(24-Wlen('$'+input_obj.order_items[i].amount));l++)
					{
						strbuf += ' ';
					}
					strbuf = '"' + strbuf + '$' +input_obj.order_items[i].amount + '"';						
					CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				}

				
				//分隔線
				strbuf = '"' + Delimiter + '"';
				PositionY_Shift = PositionY_Buf;
				var POSITION_LineY = PositionY_Shift + (50/2);
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + POSITION_LineY + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				//Memo
				if( (memo_obj!=null) && (memo_obj.data.length>0) ){
					PositionY_Shift = PositionY_Buf + 50 + (20/2);
					for(var k=0;k<memo_obj.data.length;k++){
						if(input_obj.order_items[i].product_code === memo_obj.data[k].product_code)
						{
							var Memo = memo_obj.data[k].memo;
							var array02 = String2Array(Memo, 24);				
							for (var l = 0; l < array02.length; l++) {
								PositionY_Buf = PositionY_Shift + (l * 70);//(l * 50)
								strbuf = '"' + array02[l] + '"';
								CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
								if(l==2)
								{
									break;
								}
							}							
							break;
						}
					}
				}
				
				
				//分隔線
				PositionY_Shift = PositionY_Shift + (50/2) +(50*3);
				PositionY_Buf = PositionY_Shift;
				strbuf = '"' + Delimiter + '"';
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				
				//頁尾文字
				PositionY_Shift = PositionY_Buf + (70/2);//(50/2)
				PositionY_Buf = PositionY_Shift;
				strbuf = '"' + '40mm x 60mm' + '"';
				CMD_Value.push(lcDATA_START + lcPOSITION_X + ',' + PositionY_Buf + ',' + lcFONT_SIZE02 + strbuf + lcEND);
				
				
				CMD_Value.push(lcPRINTEND);//"PRINT 1,1\r\n"				
			}

        }
		
    }
    //---新增列印主體內容


    Result.value = CMD_Value;
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