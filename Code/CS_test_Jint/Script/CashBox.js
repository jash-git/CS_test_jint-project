//CashBox
function Main() {
    var Result = {};//最終結果物件
    var ESC_Value = [];//存放記錄所有產出的列印資訊陣列
	var CashCommand = ecESC + "\u0070" +"\u0000"+ "\u006A" +  "\u006A"; //指令: ESC p 0 100 100
	
	ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化	
	ESC_Value.push(CashCommand);
	
	Result.state_code = 0;	
    Result.value = ESC_Value;
    return JSON.stringify(Result);
}
