using Jint.Native;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CS_test_Jint
{
    /*
    {
        "command_type":"SET/TEXT/QRCODE",
        "data":"",
        "coordinate_x":0,
        "coordinate_y":0,
        "text_size":0,
        "font_name":"Arial",
        "qr_mul":0,
        "qr_mode":0,
        "qr_type":0,
        "qr_mask":0,
        "qr_deg":0
        "qr_errorlevel":"M"
        "qr_encoding":0
    }
    */
    public class GodexPrinterCommand
    {
        public string command_type { get; set; }
        public string data { get; set; }
        public int coordinate_x { get; set; }
        public int coordinate_y { get; set; }
        public int text_size { get; set; }
        public string font_name { get; set; }
        public int qr_mul { get; set; }
        public int qr_mode { get; set; }
        public int qr_type { get; set; }
        public int qr_mask { get; set; }
        public int qr_deg { get; set; }
        public string qr_errorlevel { get; set; }
        public int qr_encoding { get; set; }

        public GodexPrinterCommand()
        {
            command_type = "SET";//SET/TEXT/QRCODE
            data = "";
            coordinate_x = 0;
            coordinate_y = 0;
            text_size = 30;//30,45
            font_name = "Arial";
            qr_mul = 5;//5,4,3,2
            qr_mode = 3;
            qr_type = 2;
            qr_mask = 8;
            qr_deg = 0;
            qr_errorlevel = "M";
            qr_encoding = 0;
        }
    }

    public class GodexPrinterJSOutput
    {
        public int state_code { get; set; }
        public List<Object> value { get; set; }
        public List<string> log { get; set; }
    }
}
