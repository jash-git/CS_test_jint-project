//----
var intadd01=10;
var intadd02=20;
var intresult=0;
//----
function Main() {
var Result = {};//最終結果物件
intresult=intadd01+intadd02;

Result.state_code = 0;
Result.value = intresult;

return JSON.stringify(Result);
}