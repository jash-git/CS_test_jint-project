// See https://aka.ms/new-console-template for more information
using Jint;

//出處/原始教學 網站
//https://github.com/sebastienros/jint
//https://www.youtube.com/watch?v=yCs6UmogKEg&t=57s
//https://docs.microsoft.com/zh-tw/shows/code-conversations/sebastien-ros-on-jint-javascript-interpreter-net

//延伸教學 網站
//https://blog.no2don.com/2020/03/cnet-core-c-jint-javascript.html
namespace CS_test_Jint
{
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
        //fun,js
        static int Sum(int x = 19, int y = 46)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "func.js"));

            var result = engine.Execute("GetSum(" + x + "," + y + ")").GetCompletionValue();

            return Convert.ToInt32(result.AsNumber());
        }

        static string Echo(string str = "DONMA")
        {
            //在 javascript 中，Echo  function 裡面並沒有 str 的參數，這樣我直接透過 C# 端定義一個 str 的變數，呼叫後並且取得回傳值。
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "func.js"));

            engine.SetValue("str", str);

            var result = engine.Execute("Echo()").GetCompletionValue();

            return result.AsString();
        }

        static string DoubleCall(string str = "當麻")
        {
            //先建立一個 TestClass ，並且讓 javascript 可以呼叫 TestClass 中 GetStringFromClassFunction 並且在回傳給 C# 端
            var engine = new Engine();

            engine.SetValue("testapi", new TestClass());

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "func.js"));

            var result = engine.Execute("testapi.GetStringFromClassFunction('" + str + "')").GetCompletionValue();


            return result.AsString();
        }

        static String CallSum(int x = 19, int y = 46)
        {
            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "func.js"));

            var result = engine.Execute("JSCallJS(" + x + "," + y + ")").GetCompletionValue();

            return result.AsString();
        }

        static String JS_ParseJson()
        {
            string text = "{ \"sites\" : [" +
                          "{ \"name\":\"Runoob\" , \"url\":\"www.runoob.com\" }," +
                          "{ \"name\":\"Google\" , \"url\":\"www.google.com\" }," +
                          "{ \"name\":\"Taobao\" , \"url\":\"www.taobao.com\" } ]}";

            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "func.js"));

            engine.SetValue("json_data", text);

            var result = engine.Execute("parseJson()").GetCompletionValue();

            return result.AsString();
        }

        static String JS_CreateJsonString()
        {
            string text = "{ \"sites\" : [" +
                          "{ \"name\":\"Runoob\" , \"url\":\"www.runoob.com\" }," +
                          "{ \"name\":\"Google\" , \"url\":\"www.google.com\" }," +
                          "{ \"name\":\"Taobao\" , \"url\":\"www.taobao.com\" } ]}";

            var engine = new Engine();

            engine.Execute(System.IO.File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "Script" +
                Path.DirectorySeparatorChar + "func.js"));

            engine.SetValue("json_data", text);

            var result = engine.Execute("obj2JsonString()").GetCompletionValue();

            return result.AsString();
        }
        //---fun,js

        static void Main(string[] args)
        {
            var engine = new Engine();

            /*
            //單行JS直譯測試，確定Jint Lib可用
            Console.WriteLine(engine.Execute("2+5*12").GetCompletionValue());
            */

            /*
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
                var Result = engine.Execute(Command).GetCompletionValue();
                Console.WriteLine(Result);
            }
            //*/

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

            pause();
        }
    }
}
