//Invoice~57mm
const ecTEXT_SPACE70 = ecESC + "\u0033" + "\u0046";//文字間距60

const ecPAGE_MODE = ecESC + "\u004C";//选择页模式 ESC L
const ecMOTION_UNITS = ecGS + "\u0050" + "\u0000" + "\u00CB"; //设置水平和垂直运动单位 GS P x y ;  // For 203 Dpi 
const ecAREA_SIZE = ecESC + "\u0057" + "\u0000" + "\u0000" + "\u0000" + "\u0000" + "\u00A0" + "\u0001" + "\u0058" + "\u0002" ;//在页模式下设置打印区域 ESC W xL xH yL yH dxL dxH dyL dyH
const ecTEXT_CODE = ecESC + "\u0054" + "\u0000";//选择字符代码表 ESC T n ; HEX 1B 54 00 
const ecRESET_PAGE_MODE = ecESC + "\u000C";//打印并回到标准模式（在页模式下）

const ecBAR_CODE_WIDTH = ecGS + "\u0077" + "\u0001";//设置条形码宽度 GS w n [29   119   4]
const ecBAR_CODE_HIGHT = ecGS + "\u0068" + "\u0031";//设置条形码高度 GS h n [29   104   50]
const ecBAR_CODE_HEAD = ecGS + "\u006B" + "\u0004"//打印条形码     GS   k   m    d1...dk   NUL [29   107  4    d1...dk   0 ]  
const ecBAR_CODE_END = "\0";//打印条形码     GS   k   m    d1...dk   NUL [29   107  4    d1...dk   0 ]

/*
C# 對應
	engine.SetValue("Business_Name", "VTEAM-茶飲店(營業登記名稱)");//SqliteDataAccess.m_company[0].business_name;
	engine.SetValue("Com_EIN", "28537502");//SqliteDataAccess.m_company[0].EIN;//統一編號
	engine.SetValue("Reprint", "N");//補印
	engine.SetValue("Sandbox", "Y");//測試
	engine.SetValue("input", StrInput);
	engine.SetValue("Invoice", StrInvoice);
	engine.SetValue("QRCode_Value_1", "LC100425701120613531300000064000000640000000028537502QLOOx0nzLcX0LCfop8gLRA==\u0000:**********:2:2:1:");
	engine.SetValue("QRCode_Value_2", "**5rOi6Zy457SF6Iy2OjE6NTA66aSK5qiC5aSa57agKOWkpyk6MTo1MDo=");//**波霸紅茶:1:50:養樂多綠(大):1:50:
	engine.SetValue("BarCode_Value", "11206LC100425705313");
*/
function Main() {
	var ShiftSpace = '       ';//(80mm(48字)-57mm(34字))/2(對稱) + 1(美觀)= 7字
    var Result = {};//最終結果物件
    var json_obj = {};//輸入字串的JSON物件
	var invoice_obj = {};//輸入invoice字串的JSON物件
    var ESC_Value = [];//存放記錄所有產出的列印資訊陣列
    var strbuf = '';//字串資料暫存變數
	
    //---
    //將輸入文字轉成JSON物件
    try {
        json_obj = JSON.parse(input);
		invoice_obj = JSON.parse(Invoice);
    }
    catch (e) {
        json_obj = null;
		invoice_obj = null;
    }
    //---將輸入文字轉成JSON物件

    //---
    //判斷記錄輸入資料是否合法
    if ((json_obj == null) || (invoice_obj == null)) {
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
	if(Wlen(Business_Name)<=18)
	{
		ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + Business_Name + ecDOUBLE_OFF + ecFREE_LINE);
	}
	else
	{
		ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBIG_ON + Business_Name + ecBIG_OFF + ecFREE_LINE);
	}
	//---店家名 & LOGO

	var Invoice_Title = "電子發票證明聯";
	if(Reprint=="Y")
	{
		Invoice_Title = Invoice_Title + "補印";
	}
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + Invoice_Title + ecDOUBLE_OFF + ecFREE_LINE);
	
	var Inv_Period = (json_obj.invoice_data.inv_period.substr(0, 4) - 1911) + "年" + (json_obj.invoice_data.inv_period.substr(4, 2) - 1) + "-" + (json_obj.invoice_data.inv_period.substr(4, 2) - 0) + "月";
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + Inv_Period + ecDOUBLE_OFF + ecFREE_LINE);
	
	var Invoice_NO = json_obj.invoice_data.inv_no.substr(0, 2) + "-" + json_obj.invoice_data.inv_no.substr(2, 8);
	if(Sandbox=="Y")
	{
		Invoice_NO = Invoice_NO + "(測)";
	}
	ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + Invoice_NO + ecDOUBLE_OFF + ecFREE_LINE);

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
	
	strbuf = ShiftSpace + "隨機碼: " + json_obj.invoice_data.random_code + "       總計: " + json_obj.amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 隨機碼&總計 + 換行
	
	strbuf = ShiftSpace + "賣方: " + Com_EIN + "     買方: " + json_obj.invoice_data.cust_ein;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 統編 + 換行	
	
	
	//---
	//紙張設定
	ESC_Value.push("\x1B\x4C");//选择页模式 ESC L
	ESC_Value.push("\x1B\x57\x00\x00\x00\x00\x80\x02\x00\x02");//在页模式下设置打印区域 ESC W xL xH yL yH dxL dxH dyL dyH; [456%256=200(C8) 456/256=1(01) [57mm]; 480%256=244(F4) 480/256=1(01)[30mm]
	//ESC_Value.push("\x1B\x54\x00");//选择字符代码表 ESC T n ; HEX 1B 54 00	
	//---紙張設定		
	
	//---
	//BarCode
	ESC_Value.push(ecGS + "$" + '\xDE' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x6F' + '\x00')//水平定位 [ESC $ nL nH 设置绝对打印位置] 90,0
	ESC_Value.push(ecGS + "H" + '\x00');
	ESC_Value.push(ecBAR_CODE_HIGHT);	
	ESC_Value.push(ecBAR_CODE_WIDTH);
	
	//var StrBarCode =  (json_obj.invoice_data.inv_period.substr(0, 4) - 1911) + json_obj.invoice_data.inv_period.substr(4, 2) + json_obj.invoice_data.inv_no + json_obj.invoice_data.random_code;//發票期別-發票號碼-隨機嗎
	ESC_Value.push(ecBAR_CODE_HEAD + BarCode_Value + ecBAR_CODE_END);//BarCode Code39
	//---BarCode
	
	//---
	//QR CODE

	ESC_Value.push(ecGS + "$" + '\xF0' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x4A' + '\x00')//水平定位 [ESC $ nL nH 设置绝对打印位置] 90,0
	ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	
	var StrQrData = QRCode_Value_1;
	var numberOfBytes = (Wlen(StrQrData)+3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes/256));
	ESC_Value.push(ecGS + "(k" + pL + pH +"\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); // GS ( k <Function 181>

	ESC_Value.push(ecGS + "$" + '\xF0' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x30' + '\x01')//水平定位 [ESC $ nL nH 设置绝对打印位置]
	ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	
	StrQrData = QRCode_Value_2;
	var numberOfBytes = (Wlen(StrQrData)+3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes/256));
	ESC_Value.push(ecGS + "(k" + pL + pH +"\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); 	
	
	//---QR CODE

	ESC_Value.push(ecESC + "\x0C");//打印并回到标准模式（在页模式下）
	ESC_Value.push("\x1B\x53");//Select standard mode [ESC S] 
	
	//---
	//最後資訊
	strbuf = ShiftSpace + "店家: " + json_obj.store_name;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	strbuf = ShiftSpace + "機號: " + json_obj.terminal_sid;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	//---最後資訊
	
	//---
	//必須列印銷貨明細
	if(json_obj.invoice_data.cust_ein.length>0)
	{
		ESC_Value.push(ecTEXT_SPACE70);
		
		strbuf = ShiftSpace + '----------------------------------';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		
		ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBIG_ON + "交易明細表" + ecBIG_OFF + ecFREE_LINE + ecFREE_LINE);

		strbuf = ShiftSpace + '營業人名稱: ' + Business_Name;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		
		strbuf = ShiftSpace + '營業人統編: ' + Com_EIN;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

		strbuf = ShiftSpace + '發票編號: ' + invoice_obj.Track + "-" + invoice_obj.Inv_No;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

		strbuf = ShiftSpace + '交易序號: ' + json_obj.order_no;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE + ecFREE_LINE);

		var AllCount = 0;
		var space = "";
		var spaceCount = 0;
		var AllAmount = 0;
		var AllTax_Fee = 0;
		//---
		//產品+配料
		if (invoice_obj.Items != null) {
			for (var i = 0; i < invoice_obj.Items.length; i++) {
				space = "";
				spaceCount = 0;
				
				AllCount += invoice_obj.Items[i].Quantity;//總數量統計
				AllAmount+= invoice_obj.Items[i].Amount;//含稅總金額
				AllTax_Fee+= invoice_obj.Items[i].Tax_Fee;//總稅額
				
				var count = "" + invoice_obj.Items[i].Quantity;//單一產品數量值轉字串
				spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
				for (var j = 0; j < spaceCount; j++){
					space += " ";//產生對應空白字串
				}
				count = "X" + space + invoice_obj.Items[i].Quantity;

				space = "";
				spaceCount = 0;
				var amount = "" + invoice_obj.Items[i].Price + " TX";//單一產品價格值轉字串
				spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
				for (var j = 0; j < spaceCount; j++) {
					space += " ";
				}
				amount = space  + invoice_obj.Items[i].Price + " TX"

				//產品&包材;文字靠左 + 放大 + 產品 + 換行
				space = "";
				spaceCount = 0;
				
				var product_name = invoice_obj.Items[i].Product_Name;
				var product_name_len = Wlen(product_name);//計算產品名稱字串長度
				var product_name_show ='';
				if(product_name_len>20)//20是產品名稱欄位最大寬度
				{
					intWStrPoint = 0;//初始化Wsubstring函數的旗標
					product_name_show = Wsubstring(product_name,0,20);
				}
				else
				{
					product_name_show = product_name;
				}
				
				spaceCount = 34 - Wlen(product_name_show) - Wlen(count) - 2 - Wlen(amount);//該列總長度-產品民長度-數量長度-2-價格長度
				for (var j = 0; j < spaceCount; j++) {
					space += " ";
				}
				strbuf = ShiftSpace + product_name_show + space + count + "  " + amount;
				ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);				

			}
		}
		//---產品+配料

		strbuf = ShiftSpace + '----------------------------------';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
		
		//---
		//小計列
		space = "";
		spaceCount = 34 - Wlen("小計: ") - Wlen(invoice_obj.Total_Amount + " TX");//總長度為34字元
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}		
		strbuf = ShiftSpace + "小計: " + space + invoice_obj.Total_Amount + "   ";
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		//---小計列
		
		strbuf = ShiftSpace + '----------------------------------';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行				
		
		//---
		//稅別列
		strbuf = ShiftSpace + '稅別    應稅總額    稅額      總計';//34=8[中文4個字]+14+4[中文2個字]+4+4[中文2個字]
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
		

		var Untaxed = AllAmount- AllTax_Fee;//應稅總額
		strbuf = ShiftSpace + ' TX     ';
		space = "";
		spaceCount = 8 - Wlen(""+Untaxed);
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}
		strbuf += space + Untaxed;
		
		space = "";
		spaceCount = 8 - Wlen(""+AllTax_Fee);
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}		
		strbuf += space + AllTax_Fee;
		
	    space = "";
		spaceCount = 10 - Wlen(""+AllAmount);
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}
		strbuf += space + AllAmount;		
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		
		strbuf = ShiftSpace + '----------------------------------';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
		//---稅別列

		//---
		//合計列
		strbuf = ShiftSpace +"合計:";
		space = "";
		spaceCount = 10 - Wlen(""+AllCount);
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}
		strbuf += space + AllCount + "項";
		
		strbuf+="  金額:";
		space = "";
		spaceCount = 9 - Wlen(""+AllAmount);
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}
		strbuf += space + AllAmount;			
		ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
		//---合計列
	}
	//---必須列印銷貨明細
	
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

