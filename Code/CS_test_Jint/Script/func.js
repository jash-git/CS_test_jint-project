//https://blog.no2don.com/2020/03/cnet-core-c-jint-javascript.html
function JSCallJS(a, b) {
    return "" + (GetSum(a, b) + 10);
}
//-----------

function GetSum(a, b) {
    return a + b;
}


function Echo() {
    return str + " From Javascript";
}

function CallServerFunc(name) {
    return name + " From Javascript - CallServerFunc";
}

function CallServerFunc2(name) {
    return testapi.GetStringFromClassFunction(name) + " From Javascript - CallServerFunc";

}

function parseJson() {
    obj = JSON.parse(json_data);

    var data = '';
    for (var i = 0; i < obj.sites.length; i++) {
        data += obj.sites[i].name + " : " + obj.sites[i].url+"\n";
    }

    return data;
}

function obj2JsonString() {
    input = JSON.parse(json_data);

    var output = [];
    for (var i = 0; i < input.sites.length; i++) {
        var obj = {};
        obj.ShowName = input.sites[i].name;
        obj.Url = input.sites[i].url;
        output.push(obj);
    }

    data = '{"obj":'+JSON.stringify(output)+'}';
    return data;
}
