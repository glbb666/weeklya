function sql_str(){
    var str="and,delete,or,exec,insert,select,union,update,count,*,',join,>,<";
    return str;
}
function filterSqlStr(value){
    var sqlStr=sql_str().split(',');
    var flag=false;
    for(var i=0;i<sqlStr.length;i++){
        if(value.toLowerCase().indexOf(sqlStr[i])!=-1){
            flag=true;
            break;
        }
    }
    return flag;
}
//是否合法
var isLegal = function(str) {
	if(filterSqlStr(str)){
        return false;
    }
    return true;
}

//邮箱
function isMail(mail) {
    var mailreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    if(!mailreg.test(mail)){
        return false;
    }else{
        return true;
    }
}

//是否在有效范围内[min,max]
function isRange(str,min,max) {
	if(str.length > min && str.length <=max) {
		return true;
	}else {
		return false;
	}
}
 //把时间戳转换成日期
 function formatDateTime(timeStamp) {
    var date = new Date();
    if (timeStamp){
        date.setTime(timeStamp);
    }else{
        date.setTime(date)
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    // var h = date.getHours();
    // h = h < 10 ? ('0' + h) : h;
    // var minute = date.getMinutes();
    // var second = date.getSeconds();
    // minute = minute < 10 ? ('0' + minute) : minute;
    // second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d;
 }   

export {
	isMail,
    isRange,
    isLegal,
    formatDateTime
}