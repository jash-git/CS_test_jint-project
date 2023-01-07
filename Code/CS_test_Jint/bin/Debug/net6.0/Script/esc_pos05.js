//Bill~80mm
function Main() {
    //JSON資料顯示格式轉換: https://jsonformatter.org/
    /*
    //測試資料來源: C:\Users\devel\Desktop\CS_VPOS\CS_VPOS\Json2Class\orders_new.cs
    var input = '{"store_name":"VTEAM_POS體驗店","version":"1.5.7.3","device_code":"B38A2B57158BD6B82956F333F6D32F0CB5B08D05D3A1C339CC61815876D76855","order_no":"20220524-0004","order_no_from":"L","order_time":1653875523,"order_open_time":1653385396,"order_state":1,"order_type":"3","order_type_name":"內用","order_type_code":"xxxs","terminal_sid":"VT-POS-2020-00002","pos_no":"VTPOS202000002","class_name":"早班","employee_no":"vteam-1","table_code":"","table_name":"","call_num":"005","meal_num":"","member_flag":"N","member_no":"","member_platform":"","member_name":"","member_phone":"","outside_order_no":"","outside_description":"","takeaways_order_sid":"","delivery_city_name":"","delivery_district_name":"","delivery_address":"","item_count":5,"subtotal":180,"discount_fee":0,"promotion_fee":0,"coupon_discount":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_quantity":0,"stock_pull_amount":0,"service_fee":0,"service_rate":0,"trans_reversal":0,"over_paid":0,"tax_fee":9,"amount":180,"paid_flag":"Y","cash_fee":0,"change_fee":0,"cust_ein":"","invoice_flag":"N","business_day":1653875512,"cancel_flag":"N","cancel_time":0,"cancel_class_name":"","del_flag":"N","refund":0,"refund_type_sid":"","remarks":"","order_items":[{"item_no":1,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"F03","product_name":"鐵觀音","price":35,"count":1,"condiments":[{"condiment_code":"C001","condiment_name":"珍珠","price":10,"count":1,"amount":10},{"condiment_code":"C002","condiment_name":"大珍珠","price":10,"count":1,"amount":10}],"quantity":1,"subtotal":35,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":35,"customer_name":"","print_flag":"N","printers":[]},{"item_no":2,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"F01","product_name":"阿薩姆冰茶","price":25,"count":1,"quantity":1,"subtotal":25,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":1,"amount":25,"customer_name":"","print_flag":"N","printers":[]},{"item_no":3,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"C01M","product_name":"黃金綠茶(M)","price":45,"count":1,"quantity":1,"subtotal":45,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":45,"customer_name":"","print_flag":"N","printers":[]},{"item_no":4,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"A01","product_name":"阿土伯的透清涼","price":40,"count":1,"quantity":1,"subtotal":40,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":40,"customer_name":"","print_flag":"N","printers":[{"printer_group_sid":9,"printer_order_type":3,"product_sid":1,"product_code":"A01"}]},{"item_no":5,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"F03","product_name":"鐵觀音","price":35,"count":1,"quantity":1,"subtotal":35,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":35,"customer_name":"","print_flag":"N","printers":[]}],"packages":[{"package_code":"","package_name":"大型塑膠袋","price":2,"count":1,"amount":2}],"product_sale_count":5,"set_product_sale_count":0,"package_sale_count":0,"payments":[{"payment_sid":1,"payment_code":"CASH","payment_name":"現金","payment_module_code":"","payment_amount":180,"received_fee":0,"change_fee":0,"payment_time":1653875523,"payment_info":""}],"coupons":[],"company_sid":7,"upload_terminal_sid":"VT-POS-2020-00002","upload_ip_address":"R:[203.69.151.102] ","license_type":"POS"}';
    */

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
    strbuf = '單號(' + json_obj.order_type_name + ') :' + json_obj.call_num;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

	//桌號;文字靠左 + 放大 + 桌號 + 換行
	if(json_obj.table_name.length>0)
	{
		strbuf = '桌號: ' + json_obj.table_name;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);		
	}

	//日期&時間;文字靠左 + 日期(時間) + 換行
    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = date.getMinutes();
    strbuf = '日期: ' + year + "-" + month + "-" + day + "  時間: " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//交易序號;文字靠左 + 交易序號 + 換行
    strbuf = '交易序號: ' + json_obj.order_no;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
    strbuf = '------------------------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    strbuf = '商品名稱                          數量      價格';//48=8[中文4個字]+32+4[中文2個字]+4+4[中文2個字]
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行

	//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
    strbuf = '------------------------------------------------';
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
                var amount = "" + json_obj.order_items[i].amount;//單一產品價格值轉字串
                spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                amount = space + json_obj.order_items[i].amount;

				//產品&包材;文字靠左 + 放大 + 產品 + 換行
                space = "";
				spaceCount = 0;
				
				var product_name = json_obj.order_items[i].product_name;
				var product_name_len = Wlen(product_name);//計算產品名稱字串長度
				var product_name_show ='';
				if(product_name_len>32)//32是產品名稱欄位最大寬度
				{
					intWStrPoint = 0;//初始化Wsubstring函數的旗標
					product_name_show = Wsubstring(product_name,0,32);
				}
				else
				{
					product_name_show = product_name;
				}
				
                spaceCount = 48 - Wlen(product_name_show) - Wlen(count) - 4 - Wlen(amount);//該列總長度-產品民長度-數量長度-4-價格長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                strbuf = product_name_show + space + count + "    " + amount;
                ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
				
				if(Wlen(product_name_show) != Wlen(product_name))
				{
					var sublen = Wlen(product_name)-32;//32是產品名稱欄位最大寬度
					strbuf = Wsubstring(product_name,intWStrPoint,sublen);//從上次切斷點繼續往後擷取
					ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
				}

                //配料;文字靠左 + 配料 + 換行
				strbuf = "  (";
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
                if ((json_obj.order_items[i].set_meals != null) && (json_obj.order_items[i].set_meals.length > 0)) {
                    for (var j = 0; j < json_obj.order_items[i].set_meals.length; j++) {
						AllCount += json_obj.order_items[i].set_meals[j].count;
						
						var count = "" + json_obj.order_items[i].count;//單一產品數量值轉字串
						spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
						for (var j = 0; j < spaceCount; j++){
							space += " ";//產生對應空白字串
						}
						count = "X" + space + json_obj.order_items[i].count;

                        var product_name = json_obj.order_items[i].set_meals[j].product_name;
                        //48字
                        space = "";
                        spaceCount = 48 - Wlen(product_name) - Wlen(count);
                        for (var k = 0; k < spaceCount; k++) {
                            space += " ";
                        }
                        strbuf = product_name + space + count;
                        ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);//文字靠左 + 放大 + 產品 + 換行

                        strbuf = "  (";
                        if (json_obj.order_items[i].set_meals[j].condiments != null) {
                            for (var k = 0; k < json_obj.order_items[i].set_meals[j].condiments.length; k++) {
                                if (k > 0) {
                                    strbuf = strbuf + "," + json_obj.order_items[i].set_meals[j].condiments[k].condiment_name;
                                }
                                else {
                                    strbuf = strbuf + json_obj.order_items[i].set_meals[j].condiments[k].condiment_name;
                                }
                            }
                            strbuf = strbuf + ")"
                            ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 配料 + 換行
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
            //6字(X000)
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
            //48字
            space = "";
            spaceCount = 48 - Wlen(package_name) - Wlen(count);
            for (var j = 0; j < spaceCount; j++) {
                space += " ";
            }
            strbuf = package_name + space + count;
            ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);//文字靠左 + 放大 + 包裝 + 換行
        }
    }
    //---包裝

    strbuf = '------------------------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行

	//商品總數量;文字靠左 + 總計數量 + 換行
	space = "";
    spaceCount = 48 - Wlen("商品總數量: ") - Wlen(""+AllCount);
	for (var l = 0; l < spaceCount; l++){
		space += " ";//產生對應空白字串
	}	
    strbuf = "商品總數量: " + space + AllCount;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//小計金額;文字靠左 + subtotal + 換行
	space = "";
    spaceCount = 48 - Wlen("小計金額: ") - Wlen(""+json_obj.subtotal);
	for (var l = 0; l < spaceCount; l++){
		space += " ";//產生對應空白字串
	}		
	strbuf = "小計金額: " + space + json_obj.subtotal;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    strbuf = '------------------------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
	
	//服務費
	if(json_obj.service_fee>0)
	{
		space = "";
		spaceCount = 48 - Wlen("服務費(" + json_obj.service_rate + "%): ") - Wlen(""+json_obj.service_fee);
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}	
		strbuf = "服務費(" + json_obj.service_rate + "%): " + space + json_obj.service_fee;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
	}
	
    strbuf = '------------------------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
	
	//總計
	space = "";
	spaceCount = 48 - Wlen("總計: ") - Wlen(""+json_obj.amount);
	for (var l = 0; l < spaceCount; l++){
		space += " ";//產生對應空白字串
	}	
	strbuf = "總計: " + space + json_obj.amount
	ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE)
	
    strbuf = '------------------------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
	
	strbuf = '【支付方式】';
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//支付方式與金額
	for (var i = 0; i < json_obj.payments.length; i++) {
		var payment_name = json_obj.payments[i].payment_name;
		var payment_amount = "" + json_obj.payments[i].payment_amount;
		
		space = "";
		spaceCount = 48 - Wlen(payment_name) - Wlen(payment_amount);	
		for (var l = 0; l < spaceCount; l++){
			space += " ";//產生對應空白字串
		}
		
		strbuf = payment_name + space + payment_amount;
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);		
	}
	
	//列印軟體版本
	strbuf = 'Version: ' + json_obj.version;
	ESC_Value.push(ecFREE_LINE + ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//列印時間
    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = now.getMinutes();
    strbuf = "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行
	
    //---新增列印主體內容

    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}
