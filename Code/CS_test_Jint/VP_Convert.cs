using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CS_test_Jint
{
    public class VP_Convert
    {
        public static int ToInt32(object objData)
        {
            if ((objData == null) || (objData.ToString().Length == 0))
            {
                return 0;
            }
            else
            {
                return Convert.ToInt32(objData.ToString());
            }
        }

        public static int ToInt32(double dblData)
        {
            return (dblData != null) ? (int)dblData : 0;
        }

        public static int ToInt32(String StrData)
        {
            if ((StrData == null) || (StrData.Length == 0))
            {
                return 0;
            }
            else
            {
                return (int)Convert.ToDouble(StrData);
            }

        }

        public static double ToDouble(object objData)
        {
            if ((objData == null) || (objData.ToString().Length == 0))
            {
                return 0;
            }
            else
            {
                return Convert.ToDouble(objData.ToString());
            }
        }

        public static double ToDouble(String StrData)
        {
            if ((StrData == null) || (StrData.Length == 0))
            {
                return 0;
            }
            else
            {
                return Convert.ToDouble(StrData);
            }
        }

        public static double ToDouble(int intData)
        {
            return (intData != null) ? (double)intData : 0;
        }

        public static DateTime ToDateTime(String StrData, CultureInfo CultureInfoBuf)
        {
            if ((StrData == null) || (StrData.Length == 0))
            {
                return DateTime.Now;
            }
            else
            {
                return Convert.ToDateTime(StrData, CultureInfoBuf);
            }
        }

        public static DateTime ToDateTime(object objData, CultureInfo CultureInfoBuf)
        {
            if ((objData == null) || (objData.ToString().Length == 0))
            {
                return DateTime.Now;
            }
            else
            {
                return Convert.ToDateTime(objData.ToString(), CultureInfoBuf);
            }
        }

        public static DateTime ToDateTime(String StrData)
        {
            if ((StrData == null) || (StrData.Length == 0))
            {
                return DateTime.Now;
            }
            else
            {
                return Convert.ToDateTime(StrData);
            }
        }

        public static DateTime ToDateTime(object objData)
        {
            if ((objData == null) || (objData.ToString().Length == 0))
            {
                return DateTime.Now;
            }
            else
            {
                return Convert.ToDateTime(objData.ToString());
            }
        }

        public static int m_intLineBreaks = 0;
        public static string InsertLineBreaks(string input, int length, string strReplace = "")//字串在固定長度插入換行符號的功能函數
        {
            m_intLineBreaks = 1;
            String StrData = RemoveNewLines(input, strReplace);

            if (string.IsNullOrEmpty(StrData) || length <= 0)
            {
                m_intLineBreaks = 0;
                return StrData;
            }

            StringBuilder sb = new StringBuilder();
            int currentLength = 0;

            foreach (char c in StrData)
            {
                sb.Append(c);
                currentLength += (c > 127) ? 2 : 1; // 中文字符佔兩個單位，英文字符佔一個單位

                if (currentLength >= length)
                {
                    sb.Append(Environment.NewLine);
                    currentLength = 0;
                    m_intLineBreaks++;
                }
            }

            return sb.ToString().TrimEnd('\r', '\n'); // 移除字串最後的換行符號
        }

        public static string RemoveNewLines(string input, string strReplace = "")//自動剔除字串中的所有換行符號
        {
            if (string.IsNullOrEmpty(input))
            {
                return input;
            }

            // 使用正則表達式移除換行符號
            return Regex.Replace(input, @"\r\n|\r|\n", strReplace);
        }

        public static string ReplaceSQLChar(string str)//SQL注入防呆函數
        {
            if ((str == String.Empty) || (str == null))
                return String.Empty;
            str = str.Replace("'", "");
            str = str.Replace(";", "");
            str = str.Replace(",", "");
            str = str.Replace("?", "");
            str = str.Replace("<", "");
            str = str.Replace(">", "");
            str = str.Replace("(", "");
            str = str.Replace(")", "");
            str = str.Replace("@", "");
            str = str.Replace("=", "");
            str = str.Replace("+", "");
            str = str.Replace("*", "");
            str = str.Replace("&", "");
            str = str.Replace("#", "");
            str = str.Replace("%", "");
            str = str.Replace("$", "");

            //删除与数据库相关的词
            str = Regex.Replace(str, "select", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "insert", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "delete from", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "count", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "drop table", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "truncate", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "asc", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "mid", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "char", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "xp_cmdshell", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "exec master", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "net localgroup administrators", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "and", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "net user", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "or", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "net", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "-", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "delete", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "drop", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "script", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "update", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "and", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "chr", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "master", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "truncate", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "declare", "", RegexOptions.IgnoreCase);
            str = Regex.Replace(str, "mid", "", RegexOptions.IgnoreCase);

            return str;
        }

    }

}
