//Work~80mm
var Result = {};//最終結果物件
var json_obj = {};//輸入字串的JSON物件
var ESC_Value = [];//存放記錄所有產出的列印資訊陣列

function Main() {

    //---
    //將輸入文字轉成JSON物件
    try {
        json_obj = JSON.parse(input);
        WriteLog("input 解析成功");
        WriteLog(json_obj.store_name);
    }
    catch (e) {
        json_obj = null;
        WriteLog("input 解析失敗");
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

    //商品合併列印功能在 C# code 實現

    if (PrinterParms.product_single_cut == "N") {
        //正常模式
        Normal();
    }
    else {
        //一菜一切
        SingleCut();
    }

    Result.value = ESC_Value;
    Result.log = Log_Value;
    return JSON.stringify(Result);
}

function Normal() {//正常模式
    var strbuf = '';//字串資料暫存變數

    //---
    //新增列印主體內容

    //企業Logo
    if (PrinterParms.print_logo != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecLOGO);
    }
    else {
        //店名;文字至中 + 粗體+放大 + 店名 + 換行
        WriteLog(json_obj.store_name);
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
    }

    //訂單類型加大
    if (PrinterParms.big_order_type != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + json_obj.order_type_name + ecDOUBLE_OFF + ecFREE_LINE + ecFREE_LINE);
    }

    //取餐號加大
    if (PrinterParms.big_callnum != "N") {
        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecFOUR_ON + json_obj.call_num + ecFOUR_OFF + ecFREE_LINE + ecFREE_LINE);
    }

    //開啟提示音
    if (PrinterParms.start_buzzer != "N") {
        ESC_Value.push(ecSTART_BUZZER);
    }

    //外接蜂鳴器
    if (PrinterParms.external_buzzer != "N") {
        ESC_Value.push(ecEXTERNAL_BUZZER);
    }

    //單號;文字靠左 + 放大 + 單號 + 換行
    strbuf = '單號(' + json_obj.order_type_name + ') :' + json_obj.call_num
    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
    ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併

    //桌號;文字靠左 + 放大 + 桌號 + 換行
    if (json_obj.table_name.length > 0) {
        strbuf = '桌號: ' + json_obj.table_name;

        //桌號加大
        if (PrinterParms.big_table != "N") {
            strbuf = '桌號: ' + ecBIG_ON + json_obj.table_name + ecBIG_OFF;
        }

        ESC_Value.push(ecTEXT_ALIGN_LEFT +strbuf + ecFREE_LINE);
        ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併
    }

    //日期&時間;文字靠左 + 日期(時間) + 換行
    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
    var month = pad2(date.getMonth() + 1);//months (0-11)
    var day = pad2(date.getDate());//day (1-31)
    var year = date.getFullYear();
    var hour = pad2(date.getHours());
    var minute = pad2(date.getMinutes());
    strbuf = '日期: ' + year + "-" + month + "-" + day + "  時間: " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    //交易序號;文字靠左 + 交易序號 + 換行
    strbuf = '交易序號: ' + json_obj.order_no;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

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

            if ((json_obj.order_items[i].product_type == 'P') || (json_obj.order_items[i].product_type == 'K')) {//一般產品和包材
                AllCount += json_obj.order_items[i].count;//總數量統計

                var count = "" + json_obj.order_items[i].count;//單一產品數量值轉字串
                spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";//產生對應空白字串
                }
                count = "X" + space + json_obj.order_items[i].count;

                space = "";
                spaceCount = 0;
                var amount = "";//+ json_obj.order_items[i].amount;//單一產品價格值轉字串

                //列印商品金額
                if (PrinterParms.print_product_price != "N") {
                    amount = json_obj.order_items[i].amount;//單一產品價格值轉字串
                }
                spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                amount = space + amount;

                //產品&包材;文字靠左 + 放大 + 產品 + 換行
                space = "";
                spaceCount = 0;

                var product_name = json_obj.order_items[i].product_name;
                var product_name_len = Wlen(product_name);//計算產品名稱字串長度
                var product_name_show = '';
                if (product_name_len > 32)//32是產品名稱欄位最大寬度
                {
                    intWStrPoint = 0;//初始化Wsubstring函數的旗標
                    product_name_show = Wsubstring(product_name, 0, 32);
                }
                else {
                    product_name_show = product_name;
                }

                spaceCount = 48 - Wlen(product_name_show) - Wlen(count) - 4 - Wlen(amount);//該列總長度-產品民長度-數量長度-4-價格長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }

                if (PrinterParms.print_product_price != "N") {
                    strbuf = product_name_show + space + "  " + count + amount;
                }
                else {
                    strbuf = product_name_show + space + "  " + amount + count;
                }  
                ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

                if (Wlen(product_name_show) != Wlen(product_name)) {
                    var sublen = Wlen(product_name) - 32;//32是產品名稱欄位最大寬度
                    strbuf = Wsubstring(product_name, intWStrPoint, sublen);//從上次切斷點繼續往後擷取
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
            else if (json_obj.order_items[i].product_type == 'T') {//套餐類型
                AllCount += json_obj.order_items[i].count;//總數量統計

                var count = "" + json_obj.order_items[i].count;//單一產品數量值轉字串
                spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";//產生對應空白字串
                }
                count = "X" + space + json_obj.order_items[i].count;

                space = "";
                spaceCount = 0;
                var amount = "";//+ json_obj.order_items[i].amount;//單一產品價格值轉字串

                //列印商品金額
                if (PrinterParms.print_product_price != "N") {
                    amount = json_obj.order_items[i].amount;//單一產品價格值轉字串
                }
                spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                amount = space;//+ json_obj.order_items[i].amount;

                //產品&包材;文字靠左 + 放大 + 產品 + 換行
                space = "";
                spaceCount = 0;

                var product_name = json_obj.order_items[i].product_name;
                var product_name_len = Wlen(product_name);//計算產品名稱字串長度
                var product_name_show = '';
                if (product_name_len > 32)//32是產品名稱欄位最大寬度
                {
                    intWStrPoint = 0;//初始化Wsubstring函數的旗標
                    product_name_show = Wsubstring(product_name, 0, 32);
                }
                else {
                    product_name_show = product_name;
                }

                spaceCount = 48 - Wlen(product_name_show) - Wlen(count) - 4 - Wlen(amount);//該列總長度-產品民長度-數量長度-4-價格長度
                for (var j = 0; j < spaceCount; j++) {
                    space += " ";
                }
                strbuf = product_name_show + space + "    " + amount + count;
                ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

                if (Wlen(product_name_show) != Wlen(product_name)) {
                    var sublen = Wlen(product_name) - 32;//32是產品名稱欄位最大寬度
                    strbuf = Wsubstring(product_name, intWStrPoint, sublen);//從上次切斷點繼續往後擷取
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
                }

                if ((json_obj.order_items[i].set_meals != null) && (json_obj.order_items[i].set_meals.length > 0)) {
                    for (var j = 0; j < json_obj.order_items[i].set_meals.length; j++) {
                        if ((json_obj.order_items[i].set_meals[j].product != null) && (json_obj.order_items[i].set_meals[j].product.length > 0)) {
                            for (var l = 0; l < json_obj.order_items[i].set_meals[j].product.length; l++) {
                                var product_name = json_obj.order_items[i].set_meals[j].product[l].name;
                                strbuf = '  ' + product_name;
                                ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

                                //配料;文字靠左 + 配料 + 換行
                                strbuf = "    (";
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

            if (PrinterParms.product_big_gap != "N") {//商品間距加大
                ESC_Value = ESC_Value.concat(PageSpace(36));//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併
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
    spaceCount = 48 - Wlen("商品總數量: ") - Wlen("" + AllCount);
    for (var l = 0; l < spaceCount; l++) {
        space += " ";//產生對應空白字串
    }
    strbuf = "商品總數量: " + space + AllCount;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    strbuf = '------------------------------------------------';
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行

    //列印備註
    if (PrinterParms.print_ticket_memo != "N") {
        strbuf = "訂單備註: " + json_obj.remarks;

        //訂單備註加大
        if (PrinterParms.big_memo_font != "N") {
            strbuf = "訂單備註: " + ecBIG_ON + json_obj.remarks + ecBIG_OFF;
        }

        ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

        strbuf = '------------------------------------------------';
        ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
    }

    //列印軟體版本
    strbuf = 'Version: ' + json_obj.pos_ver;
    ESC_Value.push(ecFREE_LINE + ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

    //設備編號;文字靠左+ 設備編號 + 換行
    strbuf = '設備編號: ' + json_obj.terminal_sid;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	

    //列印時間
    var now = new Date();
    month = pad2(now.getMonth() + 1);//months (0-11)
    day = pad2(now.getDate());//day (1-31)
    year = now.getFullYear();
    hour = pad2(now.getHours());
    minute = pad2(now.getMinutes());
    strbuf = "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行

    //---新增列印主體內容

    ESC_Value.push(ecCUT_PAPER);//切紙
}

function SingleCut() {//一菜一切
    var strbuf = '';//字串資料暫存變數

    //開啟提示音
    if (PrinterParms.start_buzzer != "N") {
        ESC_Value.push(ecSTART_BUZZER);
    }

    //外接蜂鳴器
    if (PrinterParms.external_buzzer != "N") {
        ESC_Value.push(ecEXTERNAL_BUZZER);
    }

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
            for (var l = 0; l < json_obj.order_items[i].count; l++) {
                space = "";
                spaceCount = 0;
                //Num = l+1;

                if ((json_obj.order_items[i].product_type == 'P') || (json_obj.order_items[i].product_type == 'K')) {//一般產品和包材

                    //企業Logo
                    if (PrinterParms.print_logo != "N") {
                        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecLOGO);
                    }
                    else {
                        //店名;文字至中 + 粗體+放大 + 店名 + 換行
                        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);
                    }

                    //訂單類型加大
                    if (PrinterParms.big_order_type != "N") {
                        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecDOUBLE_ON + json_obj.order_type_name + ecDOUBLE_OFF + ecFREE_LINE + ecFREE_LINE);
                    }

                    //取餐號加大
                    if (PrinterParms.big_callnum != "N") {
                        ESC_Value.push(ecTEXT_ALIGN_CENTER + ecFOUR_ON + json_obj.call_num + ecFOUR_OFF + ecFREE_LINE + ecFREE_LINE);
                    }

                    //單號;文字靠左 + 放大 + 單號 + 換行
                    strbuf = '單號(' + json_obj.order_type_name + ') :' + json_obj.call_num
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);
                    ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併

                    //桌號;文字靠左 + 放大 + 桌號 + 換行
                    if (json_obj.table_name.length > 0) {
                        strbuf = '桌號: ' + json_obj.table_name;

                        //桌號加大
                        if (PrinterParms.big_table != "N") {
                            strbuf = '桌號: ' + ecBIG_ON + json_obj.table_name + ecBIG_OFF;
                        }

                        ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);
                        ESC_Value = ESC_Value.concat(PageSpace());//使用頁面模式實作文字間距功能 ;使用concat成員實現陣列合併
                    }

                    //日期&時間;文字靠左 + 日期(時間) + 換行
                    var date = new Date(json_obj.order_time * 1000);//json_obj.order_time (sec) -> ms, https://www.fooish.com/javascript/date/
                    var month = pad2(date.getMonth() + 1);//months (0-11)
                    var day = pad2(date.getDate());//day (1-31)
                    var year = date.getFullYear();
                    var hour = pad2(date.getHours());
                    var minute = pad2(date.getMinutes());
                    strbuf = '日期: ' + year + "-" + month + "-" + day + "  時間: " + hour + ':' + minute;
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                    //交易序號;文字靠左 + 交易序號 + 換行
                    strbuf = '交易序號: ' + json_obj.order_no;
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                    //分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
                    strbuf = '------------------------------------------------';
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                    var count = "1";//json_obj.order_items[i].count + "-" + Num;//單一產品數量值轉字串
                    spaceCount = 6 - Wlen(count) - 2;//計算數量欄位的空白數= 該欄位總長度6 - 數量字串長度 - X符號長度
                    for (var j = 0; j < spaceCount; j++) {
                        space += " ";//產生對應空白字串
                    }
                    count = space + count;

                    space = "";
                    spaceCount = 0;
                    var amount = "";//+ json_obj.order_items[i].amount;//單一產品價格值轉字串

                    //列印商品金額
                    if (PrinterParms.print_product_price != "N") {
                        amount = json_obj.order_items[i].amount;//單一產品價格值轉字串
                    }
                    spaceCount = 6 - Wlen(amount);//計算價格欄位的空白數= 該欄位總長度6 - 數量字串長度
                    for (var j = 0; j < spaceCount; j++) {
                        space += " ";
                    }
                    amount = space + amount;

                    //產品&包材;文字靠左 + 放大 + 產品 + 換行
                    space = "";
                    spaceCount = 0;

                    var product_name = json_obj.order_items[i].product_name;
                    var product_name_len = Wlen(product_name);//計算產品名稱字串長度
                    var product_name_show = '';
                    if (product_name_len > 32)//32是產品名稱欄位最大寬度
                    {
                        intWStrPoint = 0;//初始化Wsubstring函數的旗標
                        product_name_show = Wsubstring(product_name, 0, 32);
                    }
                    else {
                        product_name_show = product_name;
                    }

                    spaceCount = 48 - Wlen(product_name_show) - Wlen(count) - 4 - Wlen(amount);//該列總長度-產品民長度-數量長度-4-價格長度
                    for (var j = 0; j < spaceCount; j++) {
                        space += " ";
                    }
                    if (PrinterParms.print_product_price != "N") {
                        strbuf = product_name_show + space + "  " + count + amount;
                    }
                    else {
                        strbuf = product_name_show + space + "  " + amount + count;
                    } 
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

                    if (Wlen(product_name_show) != Wlen(product_name)) {
                        var sublen = Wlen(product_name) - 32;//32是產品名稱欄位最大寬度
                        strbuf = Wsubstring(product_name, intWStrPoint, sublen);//從上次切斷點繼續往後擷取
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

                    //列印備註
                    if (PrinterParms.print_ticket_memo != "N") {
                        strbuf = "訂單備註: " + json_obj.remarks;

                        //訂單備註加大
                        if (PrinterParms.big_memo_font != "N") {
                            strbuf = "訂單備註: " + ecBIG_ON + json_obj.remarks + ecBIG_OFF;
                        }

                        ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                        strbuf = '------------------------------------------------';
                        ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 分隔線 + 換行
                    }

                    //列印軟體版本
                    strbuf = 'Version: ' + json_obj.pos_ver;
                    ESC_Value.push(ecFREE_LINE + ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                    //設備編號;文字靠左+ 設備編號 + 換行
                    strbuf = '設備編號: ' + json_obj.terminal_sid;
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);	

                    //列印時間
                    var now = new Date();
                    month = pad2(now.getMonth() + 1);//months (0-11)
                    day = pad2(now.getDate());//day (1-31)
                    year = now.getFullYear();
                    hour = pad2(now.getHours());
                    minute = pad2(now.getMinutes());
                    strbuf = "列印時間: " + year + "-" + month + "-" + day + " " + hour + ':' + minute;
                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);//文字靠左 + 列印時間 + 換行

                    ESC_Value.push(ecCUT_PAPER);//切紙
                }
                else if (json_obj.order_items[i].product_type == 'T') {//套餐類型			
                    if ((json_obj.order_items[i].set_meals != null) && (json_obj.order_items[i].set_meals.length > 0)) {
                        for (var j = 0; j < json_obj.order_items[i].set_meals.length; j++) {
                            if ((json_obj.order_items[i].set_meals[j].product != null) && (json_obj.order_items[i].set_meals[j].product.length > 0)) {
                                for (var l = 0; l < json_obj.order_items[i].set_meals[j].product.length; l++) {
                                    //店名;文字至中 + 粗體+放大 + 店名 + 換行
                                    ESC_Value.push(ecTEXT_ALIGN_CENTER + ecBOLD_ON + ecBIG_ON + json_obj.store_name + ecBIG_OFF + ecBOLD_OFF + ecFREE_LINE + ecFREE_LINE);

                                    //交易序號;文字靠左 + 交易序號 + 換行
                                    strbuf = '交易序號: ' + json_obj.order_no;
                                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                                    //分隔線;文字靠左 + 分隔線 + 換行(80mm分隔線48的符號)
                                    strbuf = '------------------------------------------------';
                                    ESC_Value.push(ecTEXT_ALIGN_LEFT + strbuf + ecFREE_LINE);

                                    var product_name = json_obj.order_items[i].set_meals[j].product[l].name;
                                    strbuf = product_name;
                                    ESC_Value.push(ecTEXT_ALIGN_LEFT + ecBIG_ON + strbuf + ecBIG_OFF + ecFREE_LINE);

                                    //配料;文字靠左 + 配料 + 換行
                                    strbuf = "  (";
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
}