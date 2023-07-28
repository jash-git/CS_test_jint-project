//Work~57mm_1by1
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
    
	//---
    //新增列印主體內容	
    var AllCount = json_obj.item_count;//產品總數量
	var space = "";
	var spaceCount = 0;
	//var Num =0;//目前在第幾號產品
    //---
    //產品+配料
    if (json_obj.order_items != null) {
        for (var i = 0; i < json_obj.order_items.length; i++) {			
			//Num = 0;
			for(var l=0;l<json_obj.order_items[i].count;l++) {				
				space = "";
				spaceCount = 0;
				//Num = l+1;
				
				if ((json_obj.order_items[i].product_type == 'P') || (json_obj.order_items[i].product_type == 'K')) 
				{//一般產品和包材

					//店名;文字至中 + 粗體+放大 + 店名 + 換行
					ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
			
					//交易序號;文字靠左 + 交易序號 + 換行
					strbuf = ShiftSpace + '交易序號: ' + json_obj.order_no;
					ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

					//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
					strbuf = ShiftSpace + '----------------------------------';
					ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
			
					var count = "";//json_obj.order_items[i].count + "-" + Num;//單一產品數量值轉字串
					spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
					for (var j = 0; j < spaceCount; j++){
						space += " ";//產生對應空白字串
					}
					count = space + count;

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
					
					ESC_Value.push(ecCUT_PAPER);//切紙					
				}
				else if (json_obj.order_items[i].product_type == 'T') 
				{//套餐類型
					if ((json_obj.order_items[i].set_meals != null) && (json_obj.order_items[i].set_meals.length > 0))
					{
						for(var j=0;j<json_obj.order_items[i].set_meals.length;j++)
						{
							if((json_obj.order_items[i].set_meals[j].product!=null) && (json_obj.order_items[i].set_meals[j].product.length>0))
							{
								for(var l=0;l<json_obj.order_items[i].set_meals[j].product.length;l++)
								{
									//店名;文字至中 + 粗體+放大 + 店名 + 換行
									ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
							
									//交易序號;文字靠左 + 交易序號 + 換行
									strbuf = ShiftSpace + '交易序號: ' + json_obj.order_no;
									ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

									//分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
									strbuf = ShiftSpace + '----------------------------------';
									ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
					
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
									ESC_Value.push(ecCUT_PAPER);//切紙
								}
							}
						}
					}
				}
			}
        }
    }
    //---產品+配料

    Result.value = ESC_Value;
    return JSON.stringify(Result);
}
