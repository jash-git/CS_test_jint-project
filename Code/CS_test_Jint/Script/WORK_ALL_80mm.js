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