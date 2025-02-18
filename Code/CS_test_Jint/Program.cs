﻿// See https://aka.ms/new-console-template for more information
using Jint;
using System.Text;
using System.Drawing.Printing;

//出處/原始教學 網站
//https://github.com/sebastienros/jint
//https://www.youtube.com/watch?v=yCs6UmogKEg&t=57s
//https://docs.microsoft.com/zh-tw/shows/code-conversations/sebastien-ros-on-jint-javascript-interpreter-net

//延伸教學 網站
//https://blog.no2don.com/2020/03/cnet-core-c-jint-javascript.html

using System.IO.Ports; //RS232
using System.Text.Json;
using System.Drawing;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Net.Sockets;
using System.Reflection;
using System.Security.Cryptography;

namespace CS_test_Jint
{
    public class JsonArray
    {
        public List<string> data { get; set; }
    }
    public class ESCPOS_OrderNew
    {
        public int state_code { get; set; }
        public List<string> value { get; set; }
        public List<string> log { get; set; }
    }

    public class TestClass
    {

        public string GetStringFromClassFunction(string str)
        {
            return str + ", 您好我來自於 TestClass-GetStringFromClassFunction。";
        }
    }

    class Program
    {
        static void pause()
        {
            Console.WriteLine("\nPress any key to terminate...");
            Console.ReadKey();
        }

        //---
        //Jint 相關
        static void LoadFileCommandMode()
        {
            var engine = new Engine();
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "esc_pos04.js"));

            while (true)
            {
                Console.Write("> ");
                var Command = Console.ReadLine();
                var Result = engine.Evaluate(Command);
                Console.WriteLine(Result);
            }

        }

        static void CommandMode()
        {
            var engine = new Engine();

            /*
            //單行JS直譯測試，確定Jint Lib可用
            Console.WriteLine(engine.Execute("2+5*12").GetCompletionValue());
            */

            //*
            //透過C#無限迴圈，製作一個CMD的可輸入的JS直譯器
            // x=12
            // y=2
            // z=x+y

            //function add(x,y){return (x+y);}
            //add(10,20.5)
            //add(add (10,20),-20.5)
            while (true)
            {
                Console.Write("> ");
                var Command = Console.ReadLine();
                var Result = engine.Evaluate(Command);
                Console.WriteLine(Result);
            }
            //*/
        }
        static int Sum(int x = 19, int y = 46)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "GetSum";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call(x,y);//執行範本運算 3.0.1

            return Convert.ToInt32(StrJsonResult.AsNumber());
        }

        static string Echo(string str = "DONMA")
        {
            //在 javascript 中，Echo  function 裡面並沒有 str 的參數，這樣我直接透過 C# 端定義一個 str 的變數，呼叫後並且取得回傳值。
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            engine.SetValue("str", str);

            String StrFunName = "Echo";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static string DoubleCall(string str = "當麻")
        {
            //先建立一個 TestClass ，並且讓 javascript 可以呼叫 TestClass 中 GetStringFromClassFunction 並且在回傳給 C# 端
            var engine = new Engine();

            engine.SetValue("testapi", new TestClass());

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "testapi.GetStringFromClassFunction";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call(str);//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String CallSum(int x = 19, int y = 46)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "JSCallJS";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call(x,y);//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String JS_ParseJson()
        {
            string text = "{ \"sites\" : [" +
                          "{ \"name\":\"Runoob\" , \"url\":\"www.runoob.com\" }," +
                          "{ \"name\":\"Google\" , \"url\":\"www.google.com\" }," +
                          "{ \"name\":\"Taobao\" , \"url\":\"www.taobao.com\" } ]}";

            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            engine.SetValue("json_data", text);

            String StrFunName = "parseJson";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String JS_CreateJsonString()
        {
            string text = "{ \"sites\" : [" +
                          "{ \"name\":\"Runoob\" , \"url\":\"www.runoob.com\" }," +
                          "{ \"name\":\"Google\" , \"url\":\"www.google.com\" }," +
                          "{ \"name\":\"Taobao\" , \"url\":\"www.taobao.com\" } ]}";

            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            engine.SetValue("json_data", text);

            String StrFunName = "obj2JsonString";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String JS_EnglishString2HexString(String StrData)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "ascii_to_hex";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call(StrData);//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String JS_UnicodeString2HexString(String StrData)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "unicode_to_hex";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call(StrData);//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String JS_Utf8String2HexString(String StrData)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "utf8_to_hex";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName, StrData).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }

        static String JS_Create_ESCPOS_test()
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));

            String StrFunName = "Create_ESCPOS_test";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            return StrJsonResult.AsString();
        }
        //---Jint 相關

        //---
        //C# Unicode (\uxxxx) 和 中文 變數互轉
        /*        
            Console.WriteLine(StringToUnicode("廖"));
            //UTF-8 轉中文
            String result00 = string.Format(@"\u"+"{0:x4}", 24278);
            String result01 = "\u5ed6";

            String StrBuf00 = UnescapeUnicode(result00+"jashliao中文1234");
            String StrBuf01 = StringToUnicode(result01);

            Console.Write(UnicodeToString(StrBuf01));
        */
        static string StringToUnicode(string srcText)
        {
            //http://trufflepenne.blogspot.com/2013/03/cunicode.html
            string dst = "";
            char[] src = srcText.ToCharArray();
            for (int i = 0; i < src.Length; i++)
            {
                byte[] bytes = Encoding.Unicode.GetBytes(src[i].ToString());
                string str = @"\u" + bytes[1].ToString("X2") + bytes[0].ToString("X2");
                dst += str;
            }
            return dst;
        }

        static string UnicodeToString(string srcText)
        {
            //http://trufflepenne.blogspot.com/2013/03/cunicode.html
            string dst = "";
            string src = srcText;
            int len = srcText.Length / 6;

            for (int i = 0; i <= len - 1; i++)
            {
                string str = "";
                str = src.Substring(0, 6).Substring(2);
                src = src.Substring(6);
                byte[] bytes = new byte[2];
                bytes[1] = byte.Parse(int.Parse(str.Substring(0, 2), System.Globalization.NumberStyles.HexNumber).ToString());
                bytes[0] = byte.Parse(int.Parse(str.Substring(2, 2), System.Globalization.NumberStyles.HexNumber).ToString());
                dst += Encoding.Unicode.GetString(bytes);
            }
            return dst;
        }

        public static string UnescapeUnicode(string str)  // 将unicode转义序列(\uxxxx)解码为字符串
        {
            //GOOGLE: C#  \uXXXX
            //https://www.cnblogs.com/netlog/p/15911016.html C#字符串Unicode转义序列编解码
            //https://docs.microsoft.com/en-us/dotnet/api/system.text.regularexpressions.regex.unescape?view=net-6.0
            //https://docs.microsoft.com/zh-tw/dotnet/api/system.text.regularexpressions.regex.unescape?view=net-6.0

            return (System.Text.RegularExpressions.Regex.Unescape(str));
        }

        //---C# Unicode (\uxxxx) 和 中文 變數互轉

        //---
        //ESC_POS_JS2Data & RS232 Print
        public static SerialPort m_port = new SerialPort();
        public static void CommDataReceived(Object sender, SerialDataReceivedEventArgs e)
        {
            //https://www.cnblogs.com/xinaixia/p/6216745.html
            try
            {
                //Comm.BytesToRead中为要读入的字节长度
                int len = m_port.BytesToRead;
                Byte[] readBuffer = new Byte[len];
                m_port.Read(readBuffer, 0, len); //将数据读入缓存
                //处理readBuffer中的数据，自定义处理过程
                String StrMsg= System.Text.Encoding.Default.GetString(readBuffer);
            }
            catch (Exception ex)
            {
            }
        }

        static void ESCPOS_Lable_RS232Print(String StrInput="",String StrMemo="", String StrTemplateVar = "")
        {
            Console.WriteLine("Init Jint...");
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "Lable_40mm_50mm_RS232.js"));

            engine.SetValue("input", StrInput);
            engine.SetValue("memo", StrMemo);
            engine.SetValue("TemplateVar", StrTemplateVar);

            Console.WriteLine("Create ESC_Command...");
            String StrFunName = "Main";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1


            ESCPOS_OrderNew ESCPOSCommand = new ESCPOS_OrderNew();
            ESCPOSCommand = JsonSerializer.Deserialize<ESCPOS_OrderNew>(StrJsonResult.AsString());

            Console.WriteLine("C# Modified ESC_Command Start");
            if ((ESCPOSCommand != null) && (ESCPOSCommand.state_code == 0))
            {
                for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                {
                    ESCPOSCommand.value[i] = UnescapeUnicode(ESCPOSCommand.value[i]);
                }
            }
            Console.WriteLine("C# Modified ESC_Command End");

            string[] m_comports;//= SerialPort.GetPortNames();
            m_comports = SerialPort.GetPortNames();
            if ((m_comports.Length > 0) && (!m_port.IsOpen))
            {
                m_port.PortName = m_comports[0];
                m_port.BaudRate = 9600;
                m_port.DataBits = 8;
                m_port.StopBits = StopBits.One;
                m_port.Parity = Parity.None;
                m_port.ReadTimeout = 1;
                m_port.ReadTimeout = 3000; //单位毫秒
                m_port.WriteTimeout = 3000; //单位毫秒
                                            //串口控件成员变量，字面意思为接收字节阀值，
                                            //串口对象在收到这样长度的数据之后会触发事件处理函数
                                            //一般都设为1
                m_port.ReceivedBytesThreshold = 1;
                m_port.DataReceived += new SerialDataReceivedEventHandler(CommDataReceived); //设置数据接收事件（监听）
                m_port.Open();

                Console.WriteLine("ESC_Command to Printer Start");
                if ((ESCPOSCommand != null) && (ESCPOSCommand.value != null))
                {
                    for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                    {
                        m_port.Write(Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]), 0, Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]).Length);
                    }
                }
                //*/
                Console.WriteLine("ESC_Command to Printer End");
            }
            else
            {
                m_port.Close();
            }
        }

        static void ESCPOS_Receipt_RS232Print(String StrInput="",String StrTemplateVar="")//收據
        {
            Console.WriteLine("Init Jint...");
            var engine = new Engine();

            /*
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "esc_pos01.js"));
            */

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "WORK_ALL_80mm.js"));

            engine.SetValue("input", StrInput);
            engine.SetValue("TemplateVar", StrTemplateVar);

            Console.WriteLine("Create ESC_Command...");
            String StrFunName = "Main";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1


            ESCPOS_OrderNew ESCPOSCommand = new ESCPOS_OrderNew();
            ESCPOSCommand = JsonSerializer.Deserialize<ESCPOS_OrderNew>(StrJsonResult.AsString());

            Console.WriteLine("C# Modified ESC_Command Start");
            if ((ESCPOSCommand != null)&&(ESCPOSCommand.state_code==0)&&(ESCPOSCommand.value!=null)&&(ESCPOSCommand.value.Count>0))
            {
                for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                {
                    ESCPOSCommand.value[i] = UnescapeUnicode(ESCPOSCommand.value[i]);
                }
            }
            Console.WriteLine("C# Modified ESC_Command End");

            string[] m_comports;//= SerialPort.GetPortNames();
            m_comports = SerialPort.GetPortNames();
            if ((m_comports.Length > 0) && (!m_port.IsOpen))
            {
                m_port.PortName = m_comports[0];
                //m_port.BaudRate = 115200;//RP-700  ;
                m_port.BaudRate = 19200;//PDC325
                m_port.DataBits = 8;
                m_port.StopBits = StopBits.One;
                m_port.Parity = Parity.None;
                m_port.ReadTimeout = 1;
                m_port.ReadTimeout = 3000; //单位毫秒
                m_port.WriteTimeout = 3000; //单位毫秒
                //串口控件成员变量，字面意思为接收字节阀值，
                //串口对象在收到这样长度的数据之后会触发事件处理函数
                //一般都设为1
                m_port.ReceivedBytesThreshold = 1;
                m_port.DataReceived += new SerialDataReceivedEventHandler(CommDataReceived); //设置数据接收事件（监听）
                m_port.Open();

                Console.WriteLine("ESC_Command to Printer Start");
                if((ESCPOSCommand!=null) && (ESCPOSCommand.value!=null))
                {
                    for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                    {
                        //會亂碼  byte[] bytes = Encoding.UTF8.GetBytes(ESCPOSCommand.value[i]);
                        //會亂碼  byte[] bytes = Encoding.Default.GetBytes(ESCPOSCommand.value[i]);
                        //會亂碼  byte[] bytes = Encoding.ASCII.GetBytes(ESCPOSCommand.value[i]);
                        //會亂碼  byte[] bytes = Encoding.Latin1.GetBytes(ESCPOSCommand.value[i]);
                        //byte[] bytes = Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]);
                        m_port.Write(Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]), 0, Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]).Length);
                        //m_port.Write(bytes, 0, bytes.Length);
                    }
                }
                //*/
                Console.WriteLine("ESC_Command to Printer End");
            }
            else
            {
                m_port.Close();
            }
        }

        static void ESCPOS_PaymentDetails_RS232Print(String StrInput = "")//付款明細
        {
            Console.WriteLine("Init Jint...");
            var engine = new Engine();

            /*
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "esc_pos01.js"));
            */

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "CommonFun.js"));
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "esc_pos05.js"));

            engine.SetValue("input", StrInput);

            Console.WriteLine("Create ESC_Command...");
            String StrFunName = "Main";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1


            ESCPOS_OrderNew ESCPOSCommand = new ESCPOS_OrderNew();
            ESCPOSCommand = JsonSerializer.Deserialize<ESCPOS_OrderNew>(StrJsonResult.AsString());

            Console.WriteLine("C# Modified ESC_Command Start");
            if ((ESCPOSCommand != null) && (ESCPOSCommand.state_code == 0))
            {
                for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                {
                    ESCPOSCommand.value[i] = UnescapeUnicode(ESCPOSCommand.value[i]);
                }
            }
            Console.WriteLine("C# Modified ESC_Command End");

            TcpClient tcpSocket = new TcpClient();
            tcpSocket.ReceiveBufferSize = 8192;//8k
            tcpSocket.SendBufferSize = 8192;//8k
            int intTcpRetryCount = 0;
            try
            {
                do
                {
                    //tcpSocket.Connect("192.168.1.54", 9100);
                    if (!tcpSocket.ConnectAsync("192.168.1.54", 9100).Wait(3000))//if (!tcpSocket.Connected)
                    {
                        tcpSocket = null;
                        tcpSocket = new TcpClient();
                        intTcpRetryCount++;
                        Console.WriteLine("TCP RetryCount={0};{1}",intTcpRetryCount, DateTime.Now.ToString("yyyyMMddHHmmss"));
                    }
                    else
                    {
                        break;
                    }
                }while ((!tcpSocket.Connected) && (intTcpRetryCount<5));
                
                if(tcpSocket.Connected)
                {
                    if ((ESCPOSCommand != null) && (ESCPOSCommand.value != null))
                    {
                        for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                        {
                            byte[] bytes = Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]);
                            NetworkStream tcpStream = tcpSocket.GetStream();
                            tcpStream.Write(bytes, 0, bytes.Length);
                            tcpStream.Flush();
                        }
                    }
                    tcpSocket.GetStream().Close();
                    tcpSocket.Close();
                }
                else
                {
                    Console.WriteLine("TCP Connect Error");
                }

            }
            catch (Win32Exception ex)
            {
                Console.WriteLine("TCP Error:{0}",ex.ToString());
            }


            /*印表驅動&Windows API
            Int32 dwError = 0, dwWritten = 0;
            IntPtr hPrinter = new IntPtr(0);
            DOCINFOA di = new DOCINFOA();
            bool bSuccess = false;
            di.pDocName = "My C#.NET RAW Document";
            di.pDataType = "RAW";
            try
            {
                // 打開印表機                
                if (PrinterHelper.OpenPrinter("80mm Series Printer", out hPrinter, IntPtr.Zero))
                {
                    // 啟動文檔列印                    
                    if (PrinterHelper.StartDocPrinter(hPrinter, 1, di))
                    {
                        // 開始列印                        
                        if (PrinterHelper.StartPagePrinter(hPrinter))
                        {
                            if ((ESCPOSCommand != null) && (ESCPOSCommand.value != null))
                            {
                                for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                                {                                    
                                    byte[] bytes = Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]);

                                    Int32 dwCount = bytes.Length;
                                    // 非託管指針              
                                    IntPtr pBytes = Marshal.AllocHGlobal(dwCount);
                                    // 將託管位元組陣列複製到非託管記憶體指標          
                                    Marshal.Copy(bytes, 0, pBytes, dwCount);

                                    // 向印表機輸出位元組  
                                    bSuccess = PrinterHelper.WritePrinter(hPrinter, pBytes, dwCount, out dwWritten);
                                }
                            }
                                                       
                            PrinterHelper.EndPagePrinter(hPrinter);
                        }
                        PrinterHelper.EndDocPrinter(hPrinter);
                    }
                    PrinterHelper.ClosePrinter(hPrinter);
                }
                if (bSuccess == false)
                {
                    dwError = Marshal.GetLastWin32Error();
                }
            }
            catch (Win32Exception ex)
            {
                bSuccess = false;
            }
            */

            /*RS232 Mode
            string[] m_comports;//= SerialPort.GetPortNames();
            m_comports = SerialPort.GetPortNames();
            if ((m_comports.Length > 0) && (!m_port.IsOpen))
            {
                m_port.PortName = m_comports[0];
                m_port.BaudRate = 19200;
                m_port.DataBits = 8;
                m_port.StopBits = StopBits.One;
                m_port.Parity = Parity.None;
                m_port.ReadTimeout = 1;
                m_port.ReadTimeout = 3000; //单位毫秒
                m_port.WriteTimeout = 3000; //单位毫秒
                                            //串口控件成员变量，字面意思为接收字节阀值，
                                            //串口对象在收到这样长度的数据之后会触发事件处理函数
                                            //一般都设为1
                m_port.ReceivedBytesThreshold = 1;
                m_port.DataReceived += new SerialDataReceivedEventHandler(CommDataReceived); //设置数据接收事件（监听）
                m_port.Open();

                Console.WriteLine("ESC_Command to Printer Start");
                if ((ESCPOSCommand != null) && (ESCPOSCommand.value != null))
                {
                    for (int i = 0; i < ESCPOSCommand.value.Count; i++)
                    {
                        m_port.Write(Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]), 0, Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.value[i]).Length);
                    }
                }
                
                Console.WriteLine("ESC_Command to Printer End");
            }
            else
            {
                m_port.Close();
            }
            */
        }
        static void ESC_POS_JS2Data_RS232Print()
        {
            /*
            const string ESC = "\u001B";
            const string GS = "\u001D";
            const string SetBig5 = ESC + "\u0039" + "\u0003";
            const string FreeLine = "\u000A";
            const string InitializePrinter = ESC + "@";
            const string CutPaper = GS + "\u0056" + "\u0041" + "\u0000";
            const string BoldOn = ESC + "E" + "\u0001";
            const string BoldOff = ESC + "E" + "\0";
            const string DoubleOn = GS + "!" + "\u0011";  // 2x sized text (double-high + double-wide)
            const string DoubleOff = GS + "!" + "\0";
            */

            int Count = 1;
            do
            {
                Console.WriteLine("Count : " + Count);

                //*
                //測試 https://blog.no2don.com/2020/03/cnet-core-c-jint-javascript.html 網站現成 JS檔 直譯呼叫使用
                Console.WriteLine(Sum());
                Console.WriteLine(Echo());
                Console.WriteLine(DoubleCall());
                Console.WriteLine(String.Format("19+46+10={0}", CallSum()));
                //*/

                //JSON基本測試
                Console.WriteLine(JS_ParseJson());
                Console.WriteLine(JS_CreateJsonString());

                // English String to Hex String
                String StrData = "Good morning";
                Console.WriteLine(StrData);
                Console.WriteLine(JS_EnglishString2HexString(StrData));

                String StrUnicode = "漢字";
                Console.WriteLine(StrUnicode);
                String StrBuf = JS_Utf8String2HexString(StrUnicode);
                StrBuf = StrBuf.Replace("[", "");
                StrBuf = StrBuf.Replace("]", "");
                StrBuf = StrBuf.Replace("\"", "");
                string[] strs = StrBuf.Split(",");
                byte[] byteBuf = new byte[strs.Length];
                for (int i = 0; i < strs.Length; i++)
                {
                    byteBuf[i] = (byte)(Convert.ToInt32(strs[i], 10));
                }
                Console.WriteLine(StrBuf);

                StrBuf = JS_Create_ESCPOS_test();
                JsonArray ESCPOSCommand = new JsonArray();
                ESCPOSCommand = JsonSerializer.Deserialize<JsonArray>(StrBuf);

                //*
                for (int i = 0; i < ESCPOSCommand.data.Count; i++)
                {
                    /*
                    for(int j = 0; j < 255; j++)
                    {
                        String StrOld = String.Format(">u00{0}", Convert.ToString(j, 16).ToLower().PadLeft(2, '0'));
                        byte []byte1 = new byte[1] { (byte)j } ;
                        String StrNew = System.Text.Encoding.Default.GetString(byte1);
                        ESCPOSCommand.data[i] = ESCPOSCommand.data[i].Replace(StrOld, StrNew);
                    }
                    //*/

                    //*
                    ESCPOSCommand.data[i] = UnescapeUnicode(ESCPOSCommand.data[i]);
                    //*/
                }
                //*/

                Thread.Sleep(50);

                string[] m_comports;//= SerialPort.GetPortNames();
                m_comports = SerialPort.GetPortNames();
                if ((m_comports.Length > 0) && (!m_port.IsOpen))
                {
                    m_port.PortName = m_comports[0];
                    m_port.BaudRate = 19200;
                    m_port.DataBits = 8;
                    m_port.StopBits = StopBits.One;
                    m_port.Parity = Parity.None;
                    m_port.ReadTimeout = 1;
                    m_port.ReadTimeout = 3000; //单位毫秒
                    m_port.WriteTimeout = 3000; //单位毫秒
                                                //串口控件成员变量，字面意思为接收字节阀值，
                                                //串口对象在收到这样长度的数据之后会触发事件处理函数
                                                //一般都设为1
                    m_port.ReceivedBytesThreshold = 1;
                    m_port.DataReceived += new SerialDataReceivedEventHandler(CommDataReceived); //设置数据接收事件（监听）
                    m_port.Open();

                    //*
                    for (int i = 0; i < ESCPOSCommand.data.Count; i++)
                    {
                        m_port.Write(Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.data[i]), 0, Encoding.GetEncoding("big5").GetBytes(ESCPOSCommand.data[i]).Length);
                    }
                    //*/
                }
                else
                {
                    m_port.Close();
                }

                Count++;
            } while (Count < 0);

        }
        //---ESC_POS_JS2Data & RS232 Print

        static void add()
        {
            Console.WriteLine("Init Jint...");
            var engine = new Engine();
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "add.js"));

            Console.WriteLine("Create ESC_Command...");
            String StrFunName = "Main";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            String StrResult = StrJsonResult.AsString();
        }
        static void add(int a,int b)
        {
            Console.WriteLine("Init Jint...");
            var engine = new Engine();
            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "add.js"));

            String[] StrVarName = { "intadd01", "intadd02" };
            engine.SetValue(StrVarName[0], a);
            engine.SetValue(StrVarName[1], b);

            Console.WriteLine("Create ESC_Command...");
            String StrFunName = "Main";//"Main()";
            //var StrJsonResult = engine.Execute(StrFunName).GetCompletionValue();//執行範本運算 2.11.58 版本
            var MainFunction = engine.GetValue(StrFunName).AsFunctionInstance();
            var StrJsonResult = MainFunction.Call();//執行範本運算 3.0.1

            String StrResult = StrJsonResult.AsString();
        }

        static void Main(string[] args)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);//載入.net Big5編解碼函數庫(System.Text.Encoding.CodePages)
            //add();
            //add(50, 60);
            //Sum();
            //*
            StreamReader sr = new StreamReader(@"C:\Users\jashv\OneDrive\桌面\Input.json");
            string StrInput = sr.ReadLine();
            sr.Close();// 關閉串流
            sr = new StreamReader(@"C:\Users\jashv\OneDrive\桌面\TemplateVar.json");
            string StrTemplateVar = sr.ReadLine();
            sr.Close();// 關閉串流
            ESCPOS_Receipt_RS232Print(StrInput, StrTemplateVar);
            //ESCPOS_Lable_RS232Print(StrInput, "", StrTemplateVar);
            //*/
            /*
            int Page_Width = 552; //57mm
            int Page_Height = 1180;// 設定紙張長度
            int First_Position = 0;
            int dxL = (Page_Width % 256); // 紙張寬度
            int dxH = (Page_Width / 256);
            int dyL = (Page_Height % 256);// 紙張長度
            int dyH = (Page_Height / 256);
            int nL = 0;
            int nH = 0;
            int pX = 0;


            string strCmd = "";
            string[] m_comports;//= SerialPort.GetPortNames();
            m_comports = SerialPort.GetPortNames();
            if ((m_comports.Length > 0) && (!m_port.IsOpen))
            {
                m_port.PortName = m_comports[0];
                m_port.BaudRate = 19200;
                m_port.DataBits = 8;
                m_port.StopBits = StopBits.One;
                m_port.Parity = Parity.None;
                m_port.ReadTimeout = 1;
                m_port.ReadTimeout = 3000; //单位毫秒
                m_port.WriteTimeout = 3000; //单位毫秒
                                            //串口控件成员变量，字面意思为接收字节阀值，
                                            //串口对象在收到这样长度的数据之后会触发事件处理函数
                                            //一般都设为1
                m_port.ReceivedBytesThreshold = 1;
                m_port.DataReceived += new SerialDataReceivedEventHandler(CommDataReceived); //设置数据接收事件（监听）
                m_port.Open();

                Console.WriteLine("ESC_Command to Printer Start");
                
                //---
                //設定 頁面模式 & 紙張大小	
                strCmd = "\x1B\x4C";//选择页模式 ESC L
                byte[] data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);

                strCmd = "\x1B\x57\x10\x00\x00\x00" + (char)dxL + (char)dxH + (char)dyL + (char)dyH;//在页模式下设置打印区域 ESC W xL(16) xH(0) yL(0) yH(0) dxL(200) dxH(1) dyL(156) dyH(4)
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);

                strCmd = "\x1B\x54\x00";//选择字符代码表 ESC T n ; HEX 1B 54 00	
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);
                //---設定 頁面模式 & 紙張大小

                //---
                //店家名 & LOGO
                nL = 130;
                nH = 0;
                strCmd = "\x1d" + "$" + (char)nL + (char)nH; // 垂直起始位置	(nL+(nH*256))*0.125=60*0.125=7.5mm	
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);

                pX = 12 * 25; // 大字形，每個英數字佔用 25 dot [中英文12字]
                nL = ((Page_Width / 2) - (pX / 2)) % 256;//116
                nH = (((Page_Width / 2) - (pX / 2)) / 256);//0
                strCmd = "\x1B" + "$" + (char)nL + (char)nH; // 水平位置	
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);

                strCmd = "\x1D" + "!" + "\x11" + "VTEAM-茶飲店" + "\x1D" + "!" + "\x00";//店家名稱輸出
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);
                //---店家名 & LOGO

                strCmd = "\x1B" + "\x0C";//打印并回到标准模式（在页模式下）
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);

                strCmd = "\x1B\x53";//Select standard mode [ESC S] 
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);

                strCmd = "\x1D" + "\x56" + "\x41" + "\x00";//切紙
                data = Encoding.GetEncoding("big5").GetBytes(strCmd);
                m_port.Write(data, 0, data.Length);
                
                Console.WriteLine("ESC_Command to Printer End");
            }
            else
            {
                m_port.Close();
            }
            */


             pause();
        }
    }
}
