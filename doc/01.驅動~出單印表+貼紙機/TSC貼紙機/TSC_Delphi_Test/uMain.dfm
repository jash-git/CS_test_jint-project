object Form1: TForm1
  Left = 0
  Top = 0
  Caption = 'Form1'
  ClientHeight = 230
  ClientWidth = 476
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -16
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  PixelsPerInch = 96
  TextHeight = 19
  object Label1: TLabel
    Left = 24
    Top = 16
    Width = 88
    Height = 19
    Caption = 'PrinterName'
  end
  object btnPrint: TButton
    Left = 46
    Top = 64
    Width = 97
    Height = 33
    Caption = 'Print'
    TabOrder = 0
    OnClick = btnPrintClick
  end
  object edtPrinterName: TEdit
    Left = 118
    Top = 13
    Width = 211
    Height = 27
    TabOrder = 1
    Text = 'TSC TDP-225'
  end
  object Button1: TButton
    Left = 176
    Top = 64
    Width = 137
    Height = 33
    Caption = 'Button1'
    TabOrder = 2
    OnClick = Button1Click
  end
end
