//https://blog.no2don.com/2020/03/cnet-core-c-jint-javascript.html

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