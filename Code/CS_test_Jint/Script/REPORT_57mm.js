//REPORT~57mm
function Main() {
	var MaxLength = 34;
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
		if(json_obj.report_no.length==0)//沒有報表編號就不用進行後續運算
		{
			return JSON.stringify(Result);
		}		
        ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化		
    }
    //---判斷記錄輸入資料是否合法
    
	//---
    //新增列印主體內容
	
	//店名;文字至中 + 粗體+放大 + 店名 + 換行
    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);

	//設備編號;文字靠左+ 設備編號 + 換行
	strbuf = ShiftSpace + '設備編號: ' + json_obj.terminal_sid;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//報表列別;文字靠左+ 報表列別 + 換行
	strbuf = ShiftSpace + '報表列別: ';
	strbuf += (json_obj.report_type=='C') ? '交班報表' : '關帳報表';
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//關帳時間;文字靠左 + 日期(時間) + 換行
    var date = new Date(json_obj.report_time * 1000);//json_obj.report_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
    strbuf = ShiftSpace + '關帳時間: ' + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//報表編號;文字靠左 + 報表編號 + 換行
    strbuf = ShiftSpace + '報表編號: ' + json_obj.report_no;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行
    strbuf = ShiftSpace + DividingLine('-',MaxLength);
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//訂單時間;文字靠左 + 訂單時間 + 換行
	var order_start_time = new Date(json_obj.order_start_time*1000);
    month = pad2(order_start_time.getMonth() + 1);//months (0-11)
    day = pad2(order_start_time.getDate());//day (1-31)
    year = order_start_time.getFullYear();
    hour = pad2(order_start_time.getHours());
    minute = pad2(order_start_time.getMinutes());
	strbuf = ShiftSpace + '訂單時間: ' + year + "-" + month + "-" + day + " " + hour + ':' + minute + ' ~ ';
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	var order_end_time = new Date(json_obj.order_end_time*1000);
    month = pad2(order_end_time.getMonth() + 1);//months (0-11)
    day = pad2(order_end_time.getDate());//day (1-31)
    year = order_end_time.getFullYear();
    hour = pad2(order_end_time.getHours());
    minute = pad2(order_end_time.getMinutes());
	strbuf = ShiftSpace + '          ' + year + "-" + month + "-" + day + " " + hour + ':' + minute;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行
    strbuf = ShiftSpace + DividingLine('=',MaxLength);;	
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//營業日;文字靠左 + 營業日 + 換行
	var business_day = new Date(json_obj.business_day*1000);
    month = pad2(business_day.getMonth() + 1);//months (0-11)
    day = pad2(business_day.getDate());//day (1-31)
    year = business_day.getFullYear();
    hour = pad2(business_day.getHours());
    minute = pad2(business_day.getMinutes());
	strbuf = ShiftSpace + '營業日: ' + year + "-" + month + "-" + day ;//+ " " + hour + ':' + minute;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//執行人員;文字靠左 + 執行人員 + 換行
	strbuf = ShiftSpace + '執行人員: ' + json_obj.employee_no;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//分隔線;文字靠左 + 分隔線 + 換行
    strbuf = ShiftSpace + DividingLine('-',MaxLength);;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	//基本資料條列;文字靠左 + 基本資料條列 + 換行
	strbuf = ShiftSpace + '訂單筆數: ' + TypesettingSpace('訂單筆數: ',json_obj.order_count,MaxLength) + json_obj.order_count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '原始銷售金額: ' + TypesettingSpace('原始銷售金額: ',json_obj.sale_total,MaxLength) + json_obj.sale_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '產品銷售數量: ' + TypesettingSpace('產品銷售數量: ',json_obj.sale_item_count,MaxLength) + json_obj.sale_item_count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '產品平均單價: ' + TypesettingSpace('產品平均單價: ',json_obj.sale_item_avg_cost,MaxLength) + json_obj.sale_item_avg_cost;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '營業日訂單作廢筆數: ' + TypesettingSpace('營業日訂單作廢筆數: ',json_obj.cancel_count,MaxLength) + json_obj.cancel_count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '營業日訂單作廢金額: ' + TypesettingSpace('營業日訂單作廢金額: ',json_obj.cancel_total,MaxLength) + json_obj.cancel_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '非營業日訂單作廢筆數: ' + TypesettingSpace('非營業日訂單作廢筆數: ',json_obj.other_cancel_count,MaxLength) + json_obj.other_cancel_count;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '非營業日訂單作廢金額: ' + TypesettingSpace('非營業日訂單作廢金額: ',json_obj.other_cancel_total,MaxLength) + json_obj.other_cancel_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '折扣總金額: ' + TypesettingSpace('折扣總金額: ',json_obj.discount_total,MaxLength) + json_obj.discount_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '促銷折扣總金額: ' + TypesettingSpace('促銷折扣總金額: ',json_obj.promotion_total,MaxLength) + json_obj.promotion_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '優惠/兌換券金額: ' + TypesettingSpace('優惠/兌換券金額: ',json_obj.coupon_total,MaxLength) + json_obj.coupon_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '商品寄庫金額: ' + TypesettingSpace('商品寄庫金額: ',json_obj.stock_push_amount,MaxLength) + json_obj.stock_push_amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '寄庫商品領取金額: ' + TypesettingSpace('寄庫商品領取金額: ',json_obj.stock_pull_amount,MaxLength) + json_obj.stock_pull_amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '服務費總金額: ' + TypesettingSpace('服務費總金額: ',json_obj.tax_total,MaxLength) + json_obj.tax_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '交易沖正金額: ' + TypesettingSpace('交易沖正金額: ',json_obj.trans_reversal,MaxLength) + json_obj.trans_reversal;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '溢收款金額: ' + TypesettingSpace('溢收款金額: ',json_obj.over_paid,MaxLength) + json_obj.over_paid;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '營業銷售金額: ' + TypesettingSpace('營業銷售金額: ',json_obj.sale_amount,MaxLength) + json_obj.sale_amount;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行
    strbuf = ShiftSpace + DividingLine('-',MaxLength);;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	strbuf = ShiftSpace + '收支現金合計金額: ' + TypesettingSpace('收支現金合計金額: ',json_obj.expense_cash_total,MaxLength) + json_obj.expense_cash_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	strbuf = ShiftSpace + '現金退款金額: ' + TypesettingSpace('現金退款金額: ',json_obj.refund_cash_total,MaxLength) + json_obj.refund_cash_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行
    strbuf = ShiftSpace + DividingLine('-',MaxLength);;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

	strbuf = ShiftSpace + '抽屜現金金額: ' + TypesettingSpace('抽屜現金金額: ',json_obj.payment_cash_total,MaxLength) + json_obj.payment_cash_total;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//分隔線;文字靠左 + 分隔線 + 換行
    strbuf = ShiftSpace + DividingLine('=',MaxLength);;	
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//支付方式;文字靠左 + 支付方式 + 換行
	if((json_obj.payment_info!=null) && (json_obj.payment_info.length>0))
	{
		strbuf = ShiftSpace + '【支付方式】';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		
		for(var i=0;i<json_obj.payment_info.length;i++)
		{
			var StrCaption = " " + json_obj.payment_info[i].payment_name + ' X ' + json_obj.payment_info[i].total_count + ':';
			strbuf = ShiftSpace + StrCaption + TypesettingSpace(StrCaption,json_obj.payment_info[i].payment_amount,MaxLength) + json_obj.payment_info[i].payment_amount;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		}

		strbuf = ShiftSpace + DividingLine('=',MaxLength);;	
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);			
	}

	//收支紀錄;文字靠左 + 支付方式 + 換行
	if((json_obj.expense_info!=null) && (json_obj.expense_info.length>0))
	{
		strbuf = ShiftSpace + '【收支紀錄】';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

		for(var i=0;i<json_obj.expense_info.length;i++)
		{
			var StrCaption = " " + json_obj.expense_info[i].account_name + '(' + json_obj.expense_info[i].payment_name + '): ';
			strbuf = ShiftSpace + StrCaption + TypesettingSpace(StrCaption,json_obj.expense_info[i].money,MaxLength) + json_obj.expense_info[i].money;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
		}
		
		strbuf = ShiftSpace + DividingLine('=',MaxLength);
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
	}
	
	//優惠/兌換券區塊;文字靠左 + 支付方式 + 換行
	if((json_obj.coupon_info!=null) && (json_obj.coupon_info.length>0))
	{
		strbuf = ShiftSpace + '【優惠/兌換券】';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

		for(var i=0;i<json_obj.coupon_info.length;i++)
		{
			var StrCaption = " " + json_obj.coupon_info[i].coupon_name + ':';
			strbuf = ShiftSpace + StrCaption + TypesettingSpace(StrCaption,json_obj.coupon_info[i].coupon_amount,MaxLength) + json_obj.coupon_info[i].coupon_amount;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);		
		}
		
		strbuf = ShiftSpace + DividingLine('=',MaxLength);
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);			
	}
	
	//發票區塊;文字靠左 + 支付方式 + 換行
	if( (json_obj.inv_summery_info.details!=null) && (json_obj.inv_summery_info.details.length>0) )
	{
		var intsale_quantity = parseInt(json_obj.inv_summery_info.sale_quantity);
		var intcancel_quantity = parseInt(json_obj.inv_summery_info.cancel_quantity);
		var intCount = 0;
		//開立
		if(intsale_quantity>0)
		{
			strbuf = ShiftSpace + '發票開立張數:' + TypesettingSpace('發票開立張數:',json_obj.inv_summery_info.sale_quantity,MaxLength) + json_obj.inv_summery_info.sale_quantity;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
			strbuf = ShiftSpace + '發票開立金額:' + TypesettingSpace('發票開立金額:',json_obj.inv_summery_info.sale_amount,MaxLength) + json_obj.inv_summery_info.sale_amount;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
			strbuf = ShiftSpace + '發票開立清單:';
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
			intCount = 0;
			
			for(var i=0;i<json_obj.inv_summery_info.details.length;i++)
			{
				if(json_obj.inv_summery_info.details[i].inv_type == '1')
				{			
					var StrCaption = ' ' + json_obj.inv_summery_info.details[i].track + json_obj.inv_summery_info.details[i].begin_no + ' - ' + json_obj.inv_summery_info.details[i].track + json_obj.inv_summery_info.details[i].end_no;
					strbuf = ShiftSpace + StrCaption + TypesettingSpace(StrCaption,json_obj.inv_summery_info.details[i].quantity,MaxLength) + json_obj.inv_summery_info.details[i].quantity;
					ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
					
					intCount+= json_obj.inv_summery_info.details[i].quantity;
					if(intsale_quantity == intCount)
					{
						break;
					}
				}
			}
		}
		
		if((intsale_quantity>0) && (intcancel_quantity>0))
		{
			strbuf = ShiftSpace + DividingLine('-',MaxLength);;	
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);				
		}

		//作廢
		if(intcancel_quantity>0)
		{
			strbuf = ShiftSpace + '發票作廢張數:' + TypesettingSpace('發票作廢張數:',json_obj.inv_summery_info.cancel_quantity,MaxLength) + json_obj.inv_summery_info.cancel_quantity;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
			strbuf = ShiftSpace + '發票作廢金額:' + TypesettingSpace('發票作廢金額:',json_obj.inv_summery_info.cancel_amount,MaxLength) + json_obj.inv_summery_info.cancel_amount;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
			strbuf = ShiftSpace + '發票作廢清單:';
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
			intCount = 0;
			
			for(var i=0;i<json_obj.inv_summery_info.details.length;i++)
			{
				if(json_obj.inv_summery_info.details[i].inv_type == '2')
				{
					var StrCaption = ' ' + json_obj.inv_summery_info.details[i].track + json_obj.inv_summery_info.details[i].begin_no + ' - ' + json_obj.inv_summery_info.details[i].track + json_obj.inv_summery_info.details[i].end_no;
					strbuf = ShiftSpace + StrCaption + TypesettingSpace(StrCaption,json_obj.inv_summery_info.details[i].quantity,MaxLength) + json_obj.inv_summery_info.details[i].quantity;
					ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
					
					intCount+= json_obj.inv_summery_info.details[i].quantity;			
					if(intcancel_quantity == intCount)
					{
						break;
					}					
				}				
			}
		}
		
		strbuf = ShiftSpace + DividingLine('=',MaxLength);
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);		
	}

	//商品類別銷售統計;文字靠左 + 支付方式 + 換行
	if( (json_obj.category_sale_info!=null) && (json_obj.category_sale_info.length>0) )
	{
		strbuf = ShiftSpace + '【商品類別銷售統計】';
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
		
		for(var i=0;i<json_obj.category_sale_info.length;i++)
		{
			var intSpaceLen = 16 - Wlen(json_obj.category_sale_info[i].category_name) -1;
			strbuf = ShiftSpace + json_obj.category_sale_info[i].category_name  + ':' +  DividingLine(' ',intSpaceLen);
			strbuf += 'x';
			var intSpaceLen = 6 - Wlen(''+json_obj.category_sale_info[i].quantity);
			strbuf += DividingLine(' ',intSpaceLen) + json_obj.category_sale_info[i].quantity;
			var intSpaceLen = 11 - Wlen(''+json_obj.category_sale_info[i].subtotal);
			strbuf += DividingLine(' ',intSpaceLen) + json_obj.category_sale_info[i].subtotal;
			ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	
		}
			
		strbuf = ShiftSpace + DividingLine('=',MaxLength);
		ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);				
	}
	
	//列印軟體版本;文字靠左 + 支付方式 + 換行
	strbuf = ShiftSpace + 'Version: ' + json_obj.version;
	ESC_Value.push(ecFREE_LINE + ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
	//列印時間;文字靠左 + 支付方式 + 換行
    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = pad2(now.getMinutes());
    strbuf = ShiftSpace + "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行

	//印表設備;文字靠左+ 印表設備 + 換行
	strbuf = ShiftSpace + '印表設備: ' + json_obj.terminal_sid;
	ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
	
    //---新增列印主體內容

    ESC_Value.push(ecCUT_PAPER);//切紙
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}