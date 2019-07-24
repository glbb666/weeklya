let nodeMailer = require('nodemailer');		//引入nodemailer
let mailTransport = nodeMailer.createTransport({
		"domains": [
 			"qq.com"    //用的邮箱后缀，这里是qq邮箱
 		],
 		"host": "smtp.qq.com",    //主机
 		"port": 465,   //SMTP 端口
 		"secure": true,   //使用SSL
		"auth" : {    //发邮件的邮箱信息
			user : '1079491464@qq.com',    //账号
			pass : 'fiqxzsaehscrhjaj'    //不是邮箱密码（也可以使用邮箱密码 但是不安全），最好使用开启SMTP后的邮箱授权码
		}
});

//发送邮件
mailTransport.sendMail(options, function(err, data){
	if(err) {
		//出错的话执行操作
	}else {
		//成功执行的操作
	}
})