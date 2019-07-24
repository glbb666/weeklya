let checkEqual = require('./checkEqual.js')
let isMail = require('../libs/isMail.js')
let checkEmail = function(email,em,callBack){
    if(!isMail(email)){
        callBack({
			'error' : true,
			'result' : '邮箱不合法！'
		})
		return ;
    }
    if(!checkEqual(em,email)){
        callBack({
			'error' : true,
			'result' : '前后邮箱不一致！'
		});
		return ;
    }
}
module.exports = checkEmail;