﻿//---
//建立 ESC/POS Command
const ESC = "\u001B";
const GS = "\u001D";
const SetBig5 = ESC + "\u0039" + "\u0003"; //設定中文
const FreeLine = "\u000A";//單純換行
const InitializePrinter = ESC + "@";//印表機初始化
const CutPaper = GS + "\u0056" + "\u0041" + "\u0000";//切紙
const BoldOn = ESC + "E" + "\u0001";//文字粗體_start
const BoldOff = ESC + "E" + "\0";//文字粗體_end
const DoubleOn = GS + "!" + "\u0011";//文字放大2倍_start // 2x sized text (double-high + double-wide)
const DoubleOff = GS + "!" + "\0";//文字放大2倍_end
const BigOn = GS + "!" + "\u0001";//文字放大2倍_start // big sized text (double-high + normal-wide)
const BigOff = GS + "!" + "\0";//文字放大2倍_end
const TextAlignLeft = ESC + "a" + "\u0048";//文字靠左
const TextAlignCenter = ESC + "a" + "\u0049";//文字至中
//---建立 ESC/POS Command

//收據範本
function Main() {
    //JSON資料顯示格式轉換: https://jsonformatter.org/

    //測試資料來源: C:\Users\devel\Desktop\CS_VPOS\CS_VPOS\Json2Class\orders_new.cs
    var input = '{"store_name":"VTEAM_POS體驗店","version":"1.5.7.3","device_code":"B38A2B57158BD6B82956F333F6D32F0CB5B08D05D3A1C339CC61815876D76855","order_no":"20220524-0004","order_no_from":"L","order_time":1653875523,"order_open_time":1653385396,"order_state":1,"order_type":"3","order_type_name":"內用","order_type_code":"xxxs","terminal_sid":"VT-POS-2020-00002","pos_no":"VTPOS202000002","class_name":"早班","employee_no":"vteam-1","table_code":"","table_name":"","call_num":"005","meal_num":"","member_flag":"N","member_no":"","member_platform":"","member_name":"","member_phone":"","outside_order_no":"","outside_description":"","takeaways_order_sid":"","delivery_city_name":"","delivery_district_name":"","delivery_address":"","item_count":5,"subtotal":180,"discount_fee":0,"promotion_fee":0,"coupon_discount":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_quantity":0,"stock_pull_amount":0,"service_fee":0,"service_rate":0,"trans_reversal":0,"over_paid":0,"tax_fee":9,"amount":180,"paid_flag":"Y","cash_fee":0,"change_fee":0,"cust_ein":"","invoice_flag":"N","business_day":1653875512,"cancel_flag":"N","cancel_time":0,"cancel_class_name":"","del_flag":"N","refund":0,"refund_type_sid":"","remarks":"","order_items":[{"item_no":1,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"F03","product_name":"鐵觀音","price":35,"count":1,"condiments":[{"condiment_code":"C001","condiment_name":"珍珠","price":10,"count":1,"amount":10},{"condiment_code":"C002","condiment_name":"大珍珠","price":10,"count":1,"amount":10}],"quantity":1,"subtotal":35,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":35,"customer_name":"","print_flag":"N","printers":[]},{"item_no":2,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"F01","product_name":"阿薩姆冰茶","price":25,"count":1,"quantity":1,"subtotal":25,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":1,"amount":25,"customer_name":"","print_flag":"N","printers":[]},{"item_no":3,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"C01M","product_name":"黃金綠茶(M)","price":45,"count":1,"quantity":1,"subtotal":45,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":45,"customer_name":"","print_flag":"N","printers":[]},{"item_no":4,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"A01","product_name":"阿土伯的透清涼","price":40,"count":1,"quantity":1,"subtotal":40,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":40,"customer_name":"","print_flag":"N","printers":[{"printer_group_sid":9,"printer_order_type":3,"product_sid":1,"product_code":"A01"}]},{"item_no":5,"category_code":"","category_name":"","item_type":"P","product_type":"P","product_code":"F03","product_name":"鐵觀音","price":35,"count":1,"quantity":1,"subtotal":35,"discount_code":"","discount_name":"","discount_type":"N","discount_rate":0,"discount_fee":0,"external_id":"","external_mode":"","stock_remainder_quantity":0,"stock_push_price":0,"stock_push_quantity":0,"stock_push_amount":0,"stock_pull_code":"","stock_pull_name":"","stock_pull_price":0,"stock_pull_quantity":0,"stock_pull_amount":0,"tax_type":"A","tax_rate":5,"tax_fee":2,"amount":35,"customer_name":"","print_flag":"N","printers":[]}],"packages":[{"package_code":"","package_name":"大型塑膠袋","price":2,"count":1,"amount":2}],"product_sale_count":5,"set_product_sale_count":0,"package_sale_count":0,"payments":[{"payment_sid":1,"payment_code":"CASH","payment_name":"現金","payment_module_code":"","payment_amount":180,"received_fee":0,"change_fee":0,"payment_time":1653875523,"payment_info":""}],"coupons":[],"company_sid":7,"upload_terminal_sid":"VT-POS-2020-00002","upload_ip_address":"R:[203.69.151.102] ","license_type":"POS"}';
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
        ESC_Value.push(InitializePrinter);//印表機初始化
    }
    //---判斷記錄輸入資料是否合法

    GlobalVariable_Init();//解析C#傳送過來的印表參數並修改對應全域變數

    //---
    //新增列印主體內容
    ESC_Value.push(TextAlignCenter + BoldOn + BigOn + json_obj.store_name + BigOff + BoldOff + FreeLine + FreeLine);//文字至中 + 粗體+放大 + 店名 + 換行

    strbuf = '單號(' + json_obj.order_type_name + ') :' + json_obj.call_num;
    ESC_Value.push(TextAlignLeft + BigOn + strbuf + BigOff + FreeLine);//文字靠左 + 放大 + 單號 + 換行
    ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併

    strbuf = '桌號: ' + json_obj.table_name;
    ESC_Value.push(TextAlignLeft + BigOn + strbuf + BigOff + FreeLine);//文字靠左 + 放大 + 桌號 + 換行
    ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併

    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = date.getMinutes();
    strbuf = '日期: ' + year + "-" + month + "-" + day + "  時間: " + hour + ':' + minute;
    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 日期(時間) + 換行
    
    strbuf = '交易序號: ' + json_obj.order_no;
    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 交易序號 + 換行

    strbuf = '------------------------------------------------';
    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 分隔線 + 換行

    var AllCount = 0;

    //---
    //產品+配料
    if (json_obj.order_items != null) {
        for (var i = 0; i < json_obj.order_items.length; i++) {
            //6字(X000)
            var space = "";
            var spaceCount = 0;

            AllCount += json_obj.order_items[i].count;
            var count = "" + json_obj.order_items[i].count;
            spaceCount = 6 - Wlen(count) - 2;
            for (var j = 0; j < spaceCount; j++) {
                space += " ";
            }
            count = "X" + space + json_obj.order_items[i].count;

            var product_name = json_obj.order_items[i].product_name;
            //48字
            space = "";
            spaceCount = 48 - Wlen(product_name) - Wlen(count);
            for (var j = 0; j < spaceCount; j++) {
                space += " ";
            }
            strbuf = product_name + space + count;
            ESC_Value.push(TextAlignLeft + BigOn + strbuf + BigOff + FreeLine);//文字靠左 + 放大 + 產品 + 換行

            if (json_obj.order_items[i].condiments != null) {
                for (var k = 0; k < json_obj.order_items[i].condiments.length; k++) {
                    strbuf = "--" + json_obj.order_items[i].condiments[k].condiment_name;
                    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 配料 + 換行
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
            ESC_Value.push(TextAlignLeft + BigOn + strbuf + BigOff + FreeLine);//文字靠左 + 放大 + 包裝 + 換行
        }
    }
    //---包裝

    strbuf = '------------------------------------------------';
    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 分隔線 + 換行

    strbuf = "總計數量: " + AllCount;
    ESC_Value.push(TextAlignLeft + BigOn + strbuf + BigOff + FreeLine);//文字靠左 + 放大 + 總計數量 + 換行

    strbuf = '------------------------------------------------';
    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 分隔線 + 換行


    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = now.getMinutes();
    strbuf = "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(TextAlignLeft + strbuf + FreeLine);//文字靠左 + 列印時間 + 換行
    //---新增列印主體內容

    ESC_Value.push(CutPaper);//切紙
    Result.value = ESC_Value;
    Result.log = Log_Value;
    return JSON.stringify(Result);
}

//-------------------//

function pad2(n){
    return (n < 10 ? '0' : '') + n;
}

function Test_String2Array() {
    //var strInput='10中文字';//4
    //var strInput ='0中文字1中文字2中文字3中文字4中文字5中文字6中文字7中文字8中文字9中文字10中文字';//24
    var strInput = '中文0字';//6
    var strResult = '';

    var array = String2Array(strInput, 6);
    for (var i = 0; i < array.length; i++) {
        strResult += array[i] + "\n";
    }

    return strResult;

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