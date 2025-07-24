function Main() {
	var json_obj = {};//輸入字串的JSON物件
	var invoice_obj = {};//輸入invoice字串的JSON物件
	var Result = "";//最終JSON字串
	var ResultObj = {};//最終結果物件
	var ESC_Value = [];//存放記錄所有產出的列印資訊陣列
	ResultObj.state_code = 0;
	ESC_Value.push(ecINITIALIZE_PRINTER);//印表機初始化

	ESC_Value.push("\x1B\x4C");//选择页模式 ESC L

	ESC_Value.push(ecGS + "$" + '\xF0' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x4A' + '\x00')//水平定位 [ESC $ nL nH 设置绝对打印位置] 90,0

    // 打印第一個QR Code ("HELLO01")
    ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
    ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
    ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	var StrQrData = "QRCode_Value_1";
	var numberOfBytes = (Wlen(StrQrData) + 3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes / 256));
	ESC_Value.push(ecGS + "(k" + pL + pH + "\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); // GS ( k <Function 181>

	ESC_Value.push(ecGS + "$" + '\xF0' + '\x00');// 垂直起始位置 [GS $  nL nH 页模式下设置绝对垂直打印位置]
	ESC_Value.push(ecESC + "$" + '\x30' + '\x01')//水平定位 [ESC $ nL nH 设置绝对打印位置]

    // 打印第二個QR Code ("HELLO02")
	ESC_Value.push("\x1D\x28\x6B\x04\x00\x31\x41\x32\x00");//GS ( k <Function 165> QR Code: Select the model ; GS ( k pL pH cn fn n1 n2 
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x43\x05");//GS ( k <Function 167> QR Code: Set the size of module ; GS ( k pL pH cn fn n
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x45\x31");//GS ( k <Function 169> QR Code: Select the error correction level  ; GS ( k pL pH cn fn n 	
	var StrQrData = "QRCode_Value_2";
	var numberOfBytes = (Wlen(StrQrData) + 3);
	var pL = intToChar(numberOfBytes % 256);
	var pH = intToChar(parseInt(numberOfBytes / 256));
	ESC_Value.push(ecGS + "(k" + pL + pH + "\x31\x50\x30" + StrQrData);
	ESC_Value.push("\x1D\x28\x6B\x03\x00\x31\x51\x30"); // GS ( k <Function 181>

	ESC_Value.push(ecESC + "\x0C");//打印并回到标准模式（在页模式下）
	ESC_Value.push("\x1B\x53");//Select standard mode [ESC S] 



	ESC_Value.push(ecCUT_PAPER);//Select cut mode and cut paper
	ResultObj.value = ESC_Value;
	return JSON.stringify(ResultObj);
}
function intToChar(integer) {
	return String.fromCharCode(integer)
}

function charToInt(char) {
	return char.charCodeAt(0)
}
