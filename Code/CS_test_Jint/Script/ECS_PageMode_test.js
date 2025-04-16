function Main() {
	var json_obj = {};//輸入字串的JSON物件
	var invoice_obj = {};//輸入invoice字串的JSON物件
	var Result = "";//最終JSON字串
	var ResultObj = {};//最終結果物件
	var ESC_Value = [];//存放記錄所有產出的列印資訊陣列
	ResultObj.state_code = 0;
	ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化
	//ESC_Value.push(ecTEXT_SPACE);//文字間距
	ESC_Value.push("\x1B\x4C");//选择页模式 ESC L (Select page mode)
	/*
	Set horizontal and vertical motion units
	GS P x y
	x = 0
	y = 203(=CBH)        // For 203 Dpi 
	*/
	//ESC_Value.push("\x1D\x50\x00\xCB");//Set horizontal and vertical motion units
	/*
	Set print area in page mode 
	設定寬度
	52mm / 0.125 mm / dots = 416 dots = 256 * 1 + 160 
                    = 256 * dxH + dxL
	dxL = 160(=A0H)
	dxH = 1
	設定長度
	75mm / 0.125 mm / dots = 600 dots = 256 * 2 + 88 
                  = 256 * dyH + dyL 
	dyL = 88(=58H)
	dyH = 2
	*/
	ESC_Value.push("\x1B\x57\x00\x00\x00\x00\xA0\x01\x58\x02");//Set print area in page mode 
	ESC_Value.push("\x1B\x54\x00");//Select print direction in page mode
	ESC_Value.push("Hello, Thermal Printer Page Mode!\n");
	/*
	 定位 
		在  PAGE MODE  下將文字/圖檔/Barcode/QRCode  在頁面內位置定位指令 
		GS $    =  Set absolute vertical print position in page mode    (定位 Y 軸) 
		GS $ nL Nh 
		如果定義列印位置離起印位置往下 2cm  則 
		20mm/0.125mm = 160 = 256 *0 + 160
				     = 256*nH+nL 
		nH = 0
		nL = 160(A0H)
 
		ESC $   =  Set absolute print position     (定位 X 軸) 
				ESC $ nL nH 
		如果定義列印位置離左邊界 1cm  則 
				10mm/0.125mm = 80 = 256*0 + 80 
								  = 256*nH+nL 
        nH  =  0 
        nL  =  80 (32H)
	*/
	//ESC_Value.push(ecGS + "$" + '\xA0' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	//ESC_Value.push(ecESC + "$" + '\x32' + '\x00');//水平定位 [ESC $ nL nH 设置绝对打印位置] 90,0

	/*
	電子發票條碼使用  Code 39 ,  長度為  19 碼 
	*/
	//ESC_Value.push("\x1D\x48\x00");//Select print position of HRI characters   
	//ESC_Value.push("\x1D\x68\x40");//Set bar code height
	//ESC_Value.push("\x1D\x77\x01");//Set bar code width
	//ESC_Value.push("\x1D\x6B\x45\x13\x48\x65\x6C\x6C\x6F");//Print bar code 

	ESC_Value.push(ecESC + "\x0C");//打印并回到标准模式（在页模式下）//Print and return to standard mode (in page mode) 
	ESC_Value.push("\x1B\x53");//Select standard mode [ESC S] 
	ESC_Value.push(ecCUT_PAPER);//Select cut mode and cut paper

	ResultObj.value = ESC_Value;
	return JSON.stringify(ResultObj);
}