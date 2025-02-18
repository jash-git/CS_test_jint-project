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
        WriteLog(e.message);
    }
    //---將輸入文字轉成JSON物件

    //---
    //判斷記錄輸入資料是否合法
    if (json_obj == null) {
        Result.state_code = 1;
        Result.log = Log_Value;
        return JSON.stringify(Result);
    }
    else {
        Result.state_code = 0;
        ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化
    }
    //---判斷記錄輸入資料是否合法

    GlobalVariable_Init();//解析C#傳送過來的印表參數並修改對應全域變數

	//---
    //新增列印主體內容
	
    //企業Logo
    if (PrinterParms.print_logo != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecLOGO);
    }
    else {
        //店名;文字至中 + 粗體+放大 + 店名 + 換行
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
    }

	//單號;文字靠左 + 放大 + 單號 + 換行
	var order_noAry = json_obj.order_no.split('-');
    strbuf = ShiftSpace + '單號(' + json_obj.order_type_name + ') :' + ((order_noAry.length>1) ? order_noAry[1] : order_noAry[0]);//json_obj.call_num
    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
    ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併

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
	
    var AllCount = 0;
	var space = "";
	var spaceCount = 0;
    //---
    //產品+配料
    if (json_obj.order_items != null) {
        for (var i = 0; i < json_obj.order_items.length; i++) {
			space = "";
			spaceCount = 0;
			
            if ((json_obj.order_items[i].product_type == 'P') || (json_obj.order_items[i].product_type == 'K')) 
			{//一般產品和包材
                AllCount += json_obj.order_items[i].count;//總數量統計
				
                var count = "" + json_obj.order_items[i].count;//單一產品數量值轉字串
                spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
                for (var j = 0; j < spaceCount; j++){
                    space += " ";//產生對應空白字串
                }
                count = "X" + space + json_obj.order_items[i].count;

                space = "";
				spaceCount = 0;
                var amount = "" ;//+ json_obj.order_items[i].amount;//單一產品價格值轉字串
                spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                amount = space ;//+ json_obj.order_items[i].amount;

				//產品&包材;文字靠左 + 放大 + 產品 + 換行
                space = "";
				spaceCount = 0;
				
				var product_name = json_obj.order_items[i].product_name;
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
                strbuf = ShiftSpace + product_name_show + space + "  " + amount + count;
                ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
				
				if(Wlen(product_name_show) != Wlen(product_name))
				{
					var sublen = Wlen(product_name)-20;//20是產品名稱欄位最大寬度
					strbuf = ShiftSpace + Wsubstring(product_name,intWStrPoint,sublen);//從上次切斷點繼續往後擷取
					ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
				}

                //配料;文字靠左 + 配料 + 換行
				strbuf = ShiftSpace + "  (";
                if (json_obj.order_items[i].condiments != null) {
                    for (var k = 0; k < json_obj.order_items[i].condiments.length; k++) {
                        if (k > 0) {
                            strbuf = strbuf + "," + json_obj.order_items[i].condiments[k].condiment_name;
                        }
                        else {
                            strbuf = strbuf + json_obj.order_items[i].condiments[k].condiment_name;
                        }
                    }
                    strbuf = strbuf + ")"
					ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
                }				
            }
            else if (json_obj.order_items[i].product_type == 'T') 
			{//套餐類型
                AllCount += json_obj.order_items[i].count;//總數量統計
				
                var count = "" + json_obj.order_items[i].count;//單一產品數量值轉字串
                spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
                for (var j = 0; j < spaceCount; j++){
                    space += " ";//產生對應空白字串
                }
                count = "X" + space + json_obj.order_items[i].count;

                space = "";
				spaceCount = 0;
                var amount = "" ;//+ json_obj.order_items[i].amount;//單一產品價格值轉字串
                spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                amount = space ;//+ json_obj.order_items[i].amount;

				//產品&包材;文字靠左 + 放大 + 產品 + 換行
                space = "";
				spaceCount = 0;
				
				var product_name = json_obj.order_items[i].product_name;
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
                strbuf = ShiftSpace + product_name_show + space + "  " + amount + count;
                ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
				
				if(Wlen(product_name_show) != Wlen(product_name))
				{
					var sublen = Wlen(product_name)-20;//20是產品名稱欄位最大寬度
					strbuf = ShiftSpace + Wsubstring(product_name,intWStrPoint,sublen);//從上次切斷點繼續往後擷取
					ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
				}
				
                if ((json_obj.order_items[i].set_meals != null) && (json_obj.order_items[i].set_meals.length > 0))
				{
					for(var j=0;j<json_obj.order_items[i].set_meals.length;j++)
					{
						if((json_obj.order_items[i].set_meals[j].product!=null) && (json_obj.order_items[i].set_meals[j].product.length>0))
						{
							for(var l=0;l<json_obj.order_items[i].set_meals[j].product.length;l++)
							{
								var product_name = json_obj.order_items[i].set_meals[j].product[l].name;
								strbuf =ShiftSpace + '  '+product_name;
								ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
								
								//配料;文字靠左 + 配料 + 換行
								strbuf =ShiftSpace + "    (";
								if (json_obj.order_items[i].set_meals[j].product[l].condiments != null) {
									for (var k = 0; k < json_obj.order_items[i].set_meals[j].product[l].condiments.length; k++) {
										if (k > 0) {
											strbuf = strbuf + "," + json_obj.order_items[i].set_meals[j].product[l].condiments[k].condiment_name;
										}
										else {
											strbuf = strbuf + json_obj.order_items[i].set_meals[j].product[l].condiments[k].condiment_name;
										}
									}
									strbuf = strbuf + ")"
									ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
								}								
							}
						}
					}
                }	
            }
        }
    }
    //---產品+配料

    //---
    //包裝
    if (json_obj.packages != null) {
        for (var i = 0; i < json_obj.packages.length; i++) {
            var space = "";
            var spaceCount = 0;

            AllCount += json_obj.packages[i].count;
            var count = "" + json_obj.packages[i].count;
            spaceCount = 6 - Wlen(count) - 2;
            for (var j = 0; j < spaceCount; j++) {
                space += " ";
            }
            count = "X" + space + json_obj.packages[i].count;

            var package_name = json_obj.packages[i].package_name;
            //34字
            space = "";
            spaceCount = 34 - Wlen(package_name) - Wlen(count);
            for (var j = 0; j < spaceCount; j++) {
                space += " ";
            }
            strbuf = ShiftSpace + package_name + space + count;
            ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);//文字靠左 + 放大 + 包裝 + 換行
        }
    }
    //---包裝

    strbuf = ShiftSpace + '----------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行

	//商品總數量;文字靠左 + 總計數量 + 換行
	space = "";
    spaceCount = 34 - Wlen("商品總數量: ") - Wlen(""+AllCount);
	for (var l = 0; l < spaceCount; l++){
		space += " ";//產生對應空白字串
	}	
    strbuf = ShiftSpace + "商品總數量: " + space + AllCount;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
    strbuf = ShiftSpace + '----------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行

    //列印軟體版本
    strbuf = ShiftSpace + 'Version: ' + json_obj.pos_ver;
    ESC_Value.push(ecFREE_LINE + ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    //設備編號;文字靠左+ 設備編號 + 換行
    strbuf = ShiftSpace + '設備編號: ' + json_obj.terminal_sid;
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
    Result.log = Log_Value;
    return JSON.stringify(Result);
}
