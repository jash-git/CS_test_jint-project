unit uMain;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls,
  System.IOUtils;

type
  TSCLIB_OpenPort = procedure (PrinterName:PAnsiChar); stdcall;
  TSCLIB_ClosePort = procedure();stdcall;
  TSCLIB_Setup = procedure (LabelWidth,LabelHeight,Speed,Density,Sensor,Vertical,Offset:PAnsiChar);stdcall ;
  TSCLIB_ClearBuffer = procedure () ;stdcall;
  TSCLIB_WindowsFont = procedure (X,Y,FontHeight,Rotation,FontStyle,FontUnderline: Integer; FaceName,TextContect:PAnsiChar);stdcall;
//  TSCLIB_PrintLabel = procedure (NumberOfSet, NumberOfCopoy:PAnsiChar);stdcall;
  //
  TForm1 = class(TForm)
    btnPrint: TButton;
    Label1: TLabel;
    edtPrinterName: TEdit;
    Button1: TButton;
    procedure btnPrintClick(Sender: TObject);
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
    function TSC_LoadLibrary(var MyDll:THandle):boolean ;
    function TSC_OpenPort(PrinterName:AnsiString):boolean ;
    procedure TSC_ClosePort ;
    procedure TSC_Setup(LabelWidth,LabelHeight,Speed,Density,Sensor,Vertical,Offset:AnsiString);
    procedure TSC_ClearBuffer ;
    procedure TSC_WindowsFont(X,Y,FontHeight,Rotation,FontStyle,FontUnderline: Integer; FaceName,TextContect:AnsiString);
    procedure TSC_PrintLabel(NumberOfSet, NumberOfCopy:AnsiString) ;
  public
    { Public declarations }
  end;

//procedure openport(PrinterName:PAnsiChar);stdcall;far; external 'tsclib.dll';
//procedure closeport;stdcall;far; external 'tsclib.dll';
//procedure setup(LabelWidth,LabelHeight,Speed,Density,Sensor,Vertical,Offset:PAnsiChar);stdcall;far;external 'tsclib.dll' ;
//procedure clearbuffer ;external 'tsclib.dll' ;
procedure barcode(X,Y,CodeType,Height,Readable,Rotation,Narrow,Wide,Code:PAnsiChar);stdcall;far;external 'tsclib.dll' ;
//procedure windowsfont(X,Y,FontHeight,Rotation,FontStyle,FontUnderline: Integer; FaceName,TextContect:PAnsiChar);stdcall;far;external 'tsclib.dll' ;
procedure printlabel(NumberOfSet, NumberOfCopy:PAnsiChar);stdcall;far;external 'tsclib.dll' ;
procedure sendcommand(Command:PAnsiChar);stdcall;far;external 'tsclib.dll' ;

var
  Form1: TForm1;

implementation

{$R *.dfm}

function TForm1.TSC_LoadLibrary(var MyDll:THandle):boolean ;
const
  Dll_Library : String = 'TSCLIB.dll' ;
var
  File_Name : String ;
begin
  Result := False ;
  try
    // 定義DLL Name
    File_Name := TPath.GetLibraryPath + Dll_Library ;
    // 檢查 DLL 是否存在
    if not TFile.Exists(File_Name) then
      raise Exception.Create('[' + Dll_Library + '] Not Exists.');

    // 定義 Library
    MyDll := LoadLibrary(PChar(File_Name)) ;
      if MyDll = 0 then
        raise Exception.Create('Load Library [TSCLIB.dll] Fail.');
    //
    Result := True ;
  except
    on E:Exception do
    begin
//      WriteVteamLog('[TSC_LoadLibrary] Fail => ' + E.Message) ;
    end;
  end;
end;

function TForm1.TSC_OpenPort(PrinterName:AnsiString):boolean ;
var
  MyDll : THandle ;
   pOpenPort : TSCLIB_OpenPort ;
begin
  Result := False ;
//  try
//    openport(PAnsiChar(PrinterName)) ;
//    //
//    Result := True ;
//  except
//    on E:Exception do
//    begin
//      ShowMessage(E.Message);
//    end;
//  end;
  try
    try
//      MyDll := LoadLibrary('TSCLIB.dll') ;
//      if MyDll = 0 then
//        raise Exception.Create('Load Library [TSCLIB.dll] Fail.');
      if not TSC_LoadLibrary(MyDll) then Exit ;
      

      //
      // 載入指定的函式
      @pOpenPort := GetProcAddress(MyDll,'openport') ;
      if not Assigned(@pOpenPort) then Exit ;

      // 執行函式
      pOpenPort(PAnsiChar(PrinterName)) ;
      //
      Result := True ;
    except
      on E:Exception do
      begin
        ShowMessage(E.Message) ;
//        WriteVteamLog('[TSC_OpenPort] Fail => ' + E.Message);
      end;
    end;
  finally
    FreeLibrary(MyDll) ;
  end;
end;

// 關閉連線
procedure TForm1.TSC_ClosePort ;
var
  MyDll : THandle ;
  pClosePort : TSCLIB_ClosePort ;
begin
  try
    if not TSC_LoadLibrary(MyDll) then Exit ;
    try
      // 載入指定的函式
      @pClosePort := GetProcAddress(MyDll,'closeport') ;
      if not Assigned(@pClosePort) then Exit ;

      // 執行函式
      pClosePort() ;

    except
      on E:Exception do
      begin
        ShowMessage(E.Message) ;
//        WriteVteamLog('[TSC_ClosePort] Fail => ' + E.Message);
      end;
    end;
  finally
    FreeLibrary(MyDll) ;
  end;
end;

// 設定標籤格式及參數
procedure TForm1.TSC_Setup(LabelWidth,LabelHeight,Speed,Density,Sensor,Vertical,Offset:AnsiString);
var
  MyDll : THandle ;
  pSetup : TSCLIB_Setup ;
begin
  try
    if not TSC_LoadLibrary(MyDll) then Exit ;
    try
      // 載入指定的函式
      @pSetup := GetProcAddress(MyDll,'setup') ;
      if not Assigned(@pSetup) then Exit ;

      // 執行函式
      pSetup(
              PAnsiChar(LabelWidth),
              PAnsiChar(LabelHeight),
              PAnsiChar(Speed),
              PAnsiChar(Density),
              PAnsiChar(Sensor),
              PAnsiChar(Vertical),
              PAnsiChar(Offset)
             );
    except
      on E:Exception do
      begin
//        WriteVteamLog('[TSC_Setup] Fail => ' + E.Message);
      end;
    end;
  finally
    FreeLibrary(MyDll) ;
  end;
end;

// 清除
procedure TForm1.TSC_ClearBuffer ;
var
  MyDll : THandle ;
  pClearBuffer : TSCLIB_ClearBuffer ;
begin
  try
    if not TSC_LoadLibrary(MyDll) then Exit ;
    try
      // 載入指定的函式
      @pClearBuffer := GetProcAddress(MyDll,'clearbuffer') ;
      if not Assigned(@pClearBuffer) then Exit ;

      // 執行函式
      pClearBuffer() ;
    except
      on E:Exception do
      begin
//        WriteVteamLog('[TSC_ClearBuffer] Fail => ' + E.Message);
      end;
    end;
  finally
    FreeLibrary(MyDll) ;
  end;
end;

procedure TForm1.TSC_WindowsFont(X,Y,FontHeight,Rotation,FontStyle,FontUnderline: Integer; FaceName,TextContect:AnsiString);
var
  MyDll : THandle ;
  pWindowsFont : TSCLIB_WindowsFont ;
begin
  try
    if not TSC_LoadLibrary(MyDll) then Exit ;
    try
      // 載入指定的函式
      @pWindowsFont := GetProcAddress(MyDll,'windowsfont') ;
      if not Assigned(@pWindowsFont) then Exit ;

      // 執行函式
      pWindowsFont(
                X,
                Y,
                FontHeight,
                Rotation,
                FontStyle,
                FontUnderline,
                PAnsiChar(FaceName),
                PAnsiChar(TextContect)
              );
    except
      on E:Exception do
      begin
//        WriteVteamLog('[TSC_WindowsFont] Fail => ' + E.Message);
      end;
    end;
  finally
    FreeLibrary(MyDll) ;
  end;
end;

// 列印標籤內容
procedure TForm1.TSC_PrintLabel(NumberOfSet, NumberOfCopy:AnsiString) ;
//type
//  TSCLIB_PrintLabel = procedure (NumberOfSet, NumberOfCopy:PAnsiChar);stdcall;
//var
//  MyDll : THandle ;
//  pPrintLabel : TSCLIB_PrintLabel ;
//begin
//  try
//    if not TSC_LoadLibrary(MyDll) then Exit ;
//    try
//      // 載入指定的函式
//      @pPrintLabel := GetProcAddress(MyDll,'printlabel') ;
//      if not Assigned(@pPrintLabel) then Exit ;
//
//      // 執行函式
////      pPrintLabel(PAnsiChar(NumberOfSet),PAnsiChar(NumberOfCopoy)) ;
//      pPrintLabel('1','1');
//    except
//      on E:Exception do
//      begin
////        WriteVteamLog('[TSC_PrintLabel] Fail => ' + E.Message);
//      end;
//    end;
//  finally
//    FreeLibrary(MyDll) ;
//  end;

//  procedure printlabel(NumberOfSet, NumberOfCopy:PAnsiChar);stdcall;far;external 'TSCLIB.dll' ;
begin
  try
    printlabel(PAnsiChar(NumberOfSet),PAnsiChar(NumberOfCopy));
  except
  end;
end;


procedure TForm1.btnPrintClick(Sender: TObject);
var
  PrinterName : AnsiString ;
begin
  try
    try
      // 開啟指定印表機
//      PrinterName := edtPrinterName.Text ;
//      openport(PAnsiChar(PrinterName)) ;
      if not TSC_OpenPort(edtPrinterName.Text) then Exit ;


      // 設定紙張參數
//      setup('40','25','2','10','0','0','0') ;
      TSC_Setup('40','25','2','10','0','0','0') ;
      // 清除
//      clearbuffer ;
      TSC_ClearBuffer ;

      // 送出barcode
//      barcode('10','0','EAN13','80','1','0','2','4','1234567890') ;
      //
//      windowsfont(10,100,50,0,0,0,'標楷體','標楷體字形') ;
      TSC_WindowsFont(10,100,50,0,0,0,'標楷體','標楷體字形') ;
      //
//      printlabel('1','1') ;
      TSC_PrintLabel('1','1') ;
      //
//      closeport ;
      TSC_ClosePort ;
    except

      on E:Exception do
      begin
        ShowMessage(E.Message) ;
      end;
    end;
  finally

  end;
end;

procedure TForm1.Button1Click(Sender: TObject);
var
  PrinterName,Code : AnsiString;

begin
  try
    try
       // 設定標籤紙Size
//      Code := 'SIZE 40 mm,25 mm' + #13#10 + 'GAP 3 mm,0 mm' + #13#10 +
//        'DIRECTION 1' + #13#10 + // 標籤轉向180度列印
//        'CLS' + #13#10;
//      // 訂單類型名稱
//      Code := Code + 'TEXT 30,20,"TST24.BF2",0,1,1,"' + '(測試列印)' + '"' + #13#10;
//
//      // 訂單流水號(大字體)
//      Code := Code + 'TEXT 180,10,"TST24.BF2",0,1,2,"' + '999' + '"' + #13#10;
//      Code := Code + 'PRINT 1,1' ;
//      TSC_SendCommand(Code) ;
//
//      Code := '' ;
//      TSC_SendCommand(Code) ;
    except

    end;
  finally

  end;
end;

end.
