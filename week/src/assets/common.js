import myStorage from './myStorage'
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
 function getYearWeek(time) {
    //date1是当前日期
    //date2是当年第一天
    //d是当前日期是今年第多少天
    //用d + 当前年的第一天的周差距的和在除以7就是本年第几周
    var a = time.getFullYear();
    var b = time.getMonth();
    var c = time.getDate();
    var date1 = new Date(a, parseInt(b), c), date2 = new Date(a, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    return ''+a+Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
}
function enter(result,_this){
    if(result.pic){
        window.localStorage.setItem("pic", result.pic);
       }
       window.localStorage.setItem("username", result.user.userName);
       window.localStorage.setItem("userId",result.user.id)
       window.localStorage.setItem("userStatus",result.user.administor)
       window.localStorage.setItem("userLearningDirection",result.user.learningDirection)
       myStorage.setItem("list",[],_this);
       _this.$router.replace('/week');
}
function exit(_this){
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userLearningDirection");
    window.localStorage.removeItem('list');
    window.localStorage.removeItem("userStatus");
    if(window.localStorage.getItem('pic')){
        window.localStorage.removeItem("pic");
    }
    _this.$router.push('/');
}
export {
	isMail,
    isRange,
    isLegal,
    formatDateTime,
    getYearWeek,
    enter,
    exit
}