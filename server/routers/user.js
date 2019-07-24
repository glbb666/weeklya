const express = require('express');
let pool = require('../mysql/db.js');
let router = express.Router();
let fs = require('fs');
const poolP = require('../libs/poolPromise.js');
const myselfSql = require('../mysql.js');
const sessionOk = require('../sessionOk.js');
let multer = require('multer');
let upload = multer({dest : './static/pic'});

//导入加密模块
const crypto = require("crypto");
//发邮箱
let nodeMailer = require('nodemailer');
let mailTransport = nodeMailer.createTransport({
		"domains": [
 			"qq.com"
 		],
 		"host": "smtp.qq.com",
 		"port": 465,
 		"secure": true,
		"auth" : {
			user : '1079491464@qq.com',
			pass : 'fiqxzsaehscrhjaj'
		}
});
let sendMail = require('../libs/sendEmails.js');
//检测邮箱的合法性
let isMail = require('../libs/isMail.js');
//检测邮箱的合法性和一致性
let checkEmail = require('../users/checkEmail.js');
//检测邮箱合法性和用户名合法性
let checkLegal = require('../users/checkLegal.js')
//检测密码相等
let checkEqual = require('../users/checkEqual.js')
//检测用户名和邮箱是否属于同一个用户
let checkExist = require('../users/checkExist.js')
//获取验证码
router.use('/regcode.do', function(req, res) {
    //核实用户名是否存在
    console.log('获取验证码');
    console.log(req.body);
    let {email,user,type} = req.body;
	if(!isMail(email)){
		res.send({
			'error' : true,
			'result' : '邮箱不合法！'
		});
		return ;
    }
    let vercode = '';
    //随机生成六位验证码
    for(let i = 0; i < 6; i ++) {
        vercode = vercode + parseInt(Math.random()*10);
    }
    //检测一下是注册还是修改密码发来的验证码
    if(type === "r"){
        //检查邮箱和用户名是否合法
        checkLegal(pool,email,user,function(result){
            console.log(result);
            if(result.error){
                res.send(result);
            }else {
                options = {
                    from : '1079491464@qq.com',
                    to : email,
                    subject : '验证码',
                    text : '验证码',
                    html : '<h4>您的验证码为 ：' + vercode +', 请及时输入,验证码将在发送后3分钟以后失效。</h4>'
                };
                sendMail(mailTransport, options, function(mailRes) {
                    console.log(mailRes);
                    if(mailRes.error){
                        res.send(mailRes);
                    }else {
                            req.session.vcode = {
                                em: email,
                                vc: vercode,
                                date: Date.now()
                            }
                        res.send(mailRes);
                    }
                });
            }
        })
    }else{
        checkExist(pool,email,user,function(result){
            console.log(result);
            if(result.error){
                res.send(result);
            }else {
                options = {
                    from : '1079491464@qq.com',
                    to : email,
                    subject : '验证码',
                    text : '验证码',
                    html : '<h4>您正在修改您的密码,有效验证码为 ：' + vercode +', 请不要告诉他人并及时输入,验证码将在发送后3分钟以后失效。</h4>'
                };
                sendMail(mailTransport, options, function(mailRes) {
                    console.log(mailRes);
                    if(mailRes.error){
                        res.send(mailRes);
                    }else {
                            req.session.fcode = {
                                em: email,
                                vc: vercode,
                                date: Date.now()
                            }
                        res.send(mailRes);
                    }
                });
            }
        })
    }
	
})
//用户注册(带验证码)
router.use('/register.do',function(req,res){
    console.log("注册:",req.body);
    let{vcode} = req.session;
    if(!vcode) {
		res.send({
			'error' : true,
			'result' : '请先获取验证码'
		})
		return ;
    }
    let {em,date,vc} = vcode;
    let {email,user,code,password} = req.body;
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest('hex');
    let time = Date.now() - date;
    let data;
    //检测邮箱的合法性和邮箱的一致性
    checkEmail(email,em,function(result){
        res.send(result);
    });
    checkLegal(pool, email, user, function(result) {
		if(result.error) {
			res.send(result);
		}else {
			if(checkEqual(code,vc)&&time<=3*60*1000) {
				 //直接使用连接池
                 let addSql = myselfSql.insert('user',['user_id','user_email','user_password','user_name'],[0,"'"+email+"'","'"+newPas+"'","'"+user+"'"])
                 //增加成员
                 let promise = poolP.poolPromise(pool,addSql);
                 promise.then(result=>{
                     console.log(result);  
                     data = {
                         msg:"注册成功",
                         success:true,
                         user:{
                             //id要从数据库中获取
                             "id":result.insertId,
                             "email":email,
                             "user":user,
                         }
                     }
                     res.send(JSON.stringify(data));
                 }).catch(err=>{
                     console.log(err);
                    data = {
                        msg:"未知错误",
                        success:false
                    }
                    res.send(JSON.stringify(data));
                    
                    });
          }else{
                if(!checkEqual(code,vc)) {
                    res.send({
                        'error' : true,
                        'result' : '验证码错误'
                    })
                }else {
                    res.send({
                        'error' : true,
                        'result' : '验证码填写超时'
                    })
                }
            }
        }
    })
})
//忘记密码(核实验证码)
router.use('/fcode.do',function(req,res){
    console.log("核实:",req.body);
    const {fcode} = req.session;
    if(!fcode) {
		res.send({
			'error' : true,
			'result' : '请先获取验证码'
		})
		return ;
    }
    const {email,name,code} = req.body;
    let {date,vc,em} = fcode;
    let time = Date.now() - date;
    let data;
    //检测邮箱的合法性和邮箱的一致性
    checkEmail(email,em,function(result){
        res.send(result);
    });
    //检测邮箱和用户名是否存在
    checkExist(pool, email, name, function(result) {
		if(result.error) {
			res.send(result);
		}else {
			if(checkEqual(code,vc)&& time <= 3*60*1000) {
                req.session['flag'] = {
                    'email':em,
                    'name':name,
		            'checked': true
                }
				res.send({
                    'error' : false,
                    'result' : '验证成功,请及时修改密码'
                })
          }else{
                if(!checkEqual(code,vc)){
                    res.send({
                        'error' : true,
                        'result' : '验证码错误'
                    })
                }else {
                    res.send({
                        'error' : true,
                        'result' : '验证码填写超时'
                    })
                }
            }
        }
    })
})
//忘记密码(验证过了修改密码)
router.use('/fpass.do',function(req,res){
    console.log("忘记:",req.body);
    const {fcode} = req.session;
    const {flag} = req.session;
    const {vc,date,em} = fcode;
    const {email,name} = flag;
    //过验身份不存在
    if(!flag) {
		res.send({
			'error' : true,
			'result' : '请先获取验证码'
		})
		return;
    }
    //验证过验身份和修改密码是否是同一个人
    if(!checkEqual(email,em)){
        res.send({
			'error' : true,
			'result' : '验证码中的邮箱和先前验证过的邮箱不一致'
		})
		return;
    }
    let {password} = req.body;
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(password).digest("hex");
    let data;
    //复查邮箱存在性，
    checkExist(pool, email, name, function(result) {
		if(result.error) {
			res.send(result);
		}else {
                 let updateSql = myselfSql.update('user',['user_password'],[newPas],"user_email='"+email+"' and user_name='"+name+"'");
                 //增加成员
                 let promise = poolP.poolPromise(pool,updateSql);
                 promise.then(result=>{
                     console.log(result);  
                     data = {
                         msg:"修改成功",
                         success:true,
                     }
                     res.send(JSON.stringify(data));
                 }).catch(err=>{
                     console.log(err);
                    data = {
                        msg:"未知错误",
                        success:false
                    }
                    res.send(JSON.stringify(data));
            });
        }
    })
})
//用户登录(使用内置crypto模块,md5加密)
router.use('/login.do',function(req,res){
    console.log("登录:",req.body);
    //当登陆的时候,调取数据库中user表的内容,如果表中的内容存在,那么说明这个用户已经注册过了,那么我们就验证用户输入的密码和数据库中的密码是否匹配,如果匹配的话,那么就让用户登录成功,并且给客户端设置一个cookie,否则用户登陆失败.
    let user = req.body;
    let data = {};
    let md5 = crypto.createHash("md5");
    let newPas = md5.update(user.password).digest("hex");
    if(user.userName){
        //注意:如果要进行字符串比较,这里的user.email必须被双引号包住
        let searchSql = myselfSql.select('user','*', 'user_name="'+user.userName+'"');
        // console.log(searchSql);
        let promise = poolP.poolPromise(pool,searchSql);
        promise.then(result=>{
             //这里只能判断长度,不能用result!=[],因为数组也是对象,对象默认是不相等的
             if(result.length!=0){
                //当不为空,说明用户存在
                console.log(result);
                if(result[0].user_password===newPas){
                    req.session['user']={
                        id:result[0].user_id,
                        email:result[0].user_email,
                        password:result[0].user_password,
                        phone:result[0].user_phone,
                        state:result[0].user_state,
                        professionalClass:result[0].user_professionalClass,
                        learningDirection:result[0].user_learningDirection,
                        address:result[0].user_address,
                        status:result[0].user_status,
                        userName:result[0].user_name,
                        path:result[0].user_path
                    }
                    let data = {
                        msg:'登录成功',
                        user:{
                            userName:req.session['user'].userName,
                            id:req.session['user'].id,
                            administor:req.session['user'].status
                        },
                        success:true
                    }
                    var path = './static/pic/'+result[0].user_path;
                    if(path){
                        fs.readFile(path,function(err,cont){
                            if(err){
                                console.log(err);
                                res.send(JSON.stringify(data));
                                return;
                            }else{
                                data.pic = 'data:image/png;base64,' + (cont.toString && cont.toString("base64"));
                                res.send(JSON.stringify(data));
                                return;
                            }
                        })
                    }else{
                        res.send(JSON.stringify(data));
                        return;
                    }
                }else{
                    data = {
                        msg:"账户或密码错误",
                        success:false
                    };
                    res.send(JSON.stringify(data));
                    return;
                }
            }else{
                //用户不存在
                data = {
                    msg:"账户或密码错误",
                    success:false
                };
                res.send(JSON.stringify(data));
                return;
            }
        }).catch(err=>{
            console.log(err);
                data = {
                    msg:"服务器错误",
                    success:false
                };
                res.send(JSON.stringify(data));    
        })
    }else{
        data = {
            msg:"用户名为空",
            success:false
        };
        res.send(JSON.stringify(data));
    }
})
router.use(sessionOk())
//用户退出
router.use('/logout.do',function(req,res){
    try{
        req.session['user']=null;
        res.clearCookie('user');
        data = {
            msg:"成功",
            success:true
        };
    }catch{
        data = {
            msg:"失败",
            success:false
        };
    }
    res.send(JSON.stringify(data));        
})
//获取个人信息
router.use('/getUser.do',function(req,res){
    let path = './static/pic/'+req.session.user.path;
    let searchSql = myselfSql.select('user','*','user_id='+req.session['user'].id);
    let promise = poolP.poolPromise(pool,searchSql);
    promise.then(result=>{
        
        fs.readFile(path,function(err,cont){
            console.log(cont);
            let user={
                id:result[0].user_id,
                email:result[0].user_email,
                phone:result[0].user_phone,
                state:result[0].user_state,
                professionalClass:result[0].user_professionalClass,
                learningDirection:result[0].user_learningDirection,
                address:result[0].user_address,
                status:result[0].user_status,
                userName:result[0].user_name,
                path:result[0].user_path
            }
            data = {
                msg:"获取成功",
                success:true,
                user:user,
                pic:'data:image/png;base64,'+cont.toString('base64')
            }
            res.send(JSON.stringify(data));
        });
    }).catch(err=>{
        console.log(err);
            data = {
                msg:"获取失败",
                success:false
            }
            res.send(JSON.stringify(data));
            return;
    })
})
//修改个人信息
router.use('/updateUser.do',function(req,res){
    console.log(req.query);
    let user = req.query;
    let updateSql = myselfSql.update('user',['user_email','user_phone','user_state','user_professionalClass','user_learningDirection','user_address','user_name'],[user.email,user.tel,user.state,user.professionalClass,user.learningDirection,user.address,user.userName],'user_id='+req.session['user'].id);
    let promise = poolP.poolPromise(pool,updateSql);
    let data;
    promise.then(result=>{
        data = {
            success:true,
            msg:'插入成功'
        }
        res.send(JSON.stringify(data));
    }).catch(err=>{
        console.log(err);
        data = {
            success:false,
            msg:'插入失败'
        }
        res.send(JSON.stringify(data));
    })
})
//修改头像
// upload.single('photo')每次上传单个照片的配置信息
router.use('/photo.do',upload.single('file'),function(req,res){
        let id = req.session.user.id;
		let npath = 'pics'+req.session.user.id;
		fs.rename('./static/pic/'+req.file.filename, './static/pic/' + npath,function(err) {
			if(err) {
			}else {
                let updateSql = 'UPDATE `user` SET `user_path` = \''+ npath +'\' WHERE `user_id` = '+ id;
                let promise = poolP.poolPromise(pool,updateSql);
                promise.then(result=>{
                    res.send({
                        'success':true,
                        'msg':'上传成功'
                    })
                }).catch(err=>{
                    res.send({
                        'success':false,
                        'msg':上传失败
                    })
                })
			}
		})
})
//修改密码接口
router.use('/updateUserPassword.do',function(req,res){
    console.log(req.query);
    let password = req.query;
    //一个crypto实例只能调用digest一次,创建两个不会报错Digest already called
    let oldPas = crypto.createHash("md5").update(password.oldPassword).digest('hex');
    let newPas = crypto.createHash("md5").update(password.newPassword).digest('hex');
    if(!checkEqual(oldPas,req.session['user'].password)){
        res.send({
            'success':false,
            'msg':'原密码错误'
        })
    }else if(checkEqual(req.session['user'].password,newPas)){
        res.send({
                'success':false,
                'msg':'新密码和原密码一致，无需修改'
        })
    }else{
    let updateSql = myselfSql.update('user',['user_password'],[newPas],'user_id='+req.session['user'].id+" and user_password='"+req.session['user'].password+"'");
    console.log(updateSql);
    let promise = poolP.poolPromise(pool,updateSql);
    let data;
    promise.then(result=>{
        console.log(result);
            data = {
                success:true,
                msg:'修改成功'
            };
            console.log('修改成功');
        res.send(JSON.stringify(data));
    }).catch(err=>{
        console.log(err);
        data = {
            success:false,
            msg:'修改失败'
        }
        res.send(JSON.stringify(data));
    })
    }
})
//获取全部用户
router.use('/getAllUser.do',function(req,res){
    let keys = [];
    let where;
    let data;
    if(req.session['user'].status==='big_administor'){
        keys = ['user_id','user_email','user_state','user_status','user_learningDirection'];
        console.log('大管理员');
        where = 'user_id<>'+req.session['user'].id;
    }else if(req.session['user'].status === 'administor'){
        keys = ['user_id','user_email','user_state','user_learningDirection'];
        console.log('管理员');
        where = 'user_status is null and user_learningDirection=\''+req.session['user'].learningDirection+'\'';
    }else{
        data={
            success:false,
            msg:'没有权限访问',
        }
        res.send(JSON.stringify(data))
        return;
    }
    let searchSql = myselfSql.select('user',keys,where);
    let promise = poolP.poolPromise(pool,searchSql);
    promise.then(result=>{
            data={
                success:true,
                msg:'获取成功',
                user:result
            }
            res.send(JSON.stringify(data))
        }).catch(err=>{
        data={
                success:false,
                msg:'服务器错误',
            }
            res.send(JSON.stringify(data))
            console.log(err);
    })
})
//重置密码
router.use('/resetPassword.do',function(req,res){
    let id = req.query.id;
    let md5 = crypto.createHash("md5");
    let initPas = md5.update('123456').digest('hex');
    let updateSql = myselfSql.update('user',['user_password'],[initPas],'user_id='+id);
    let promise = poolP.poolPromise(pool,updateSql);
    promise.then(result=>{
        res.send({
            'msg':'重置密码成功',
            'success':true
        })
    }).catch(err=>{
        res.send({
            'msg':'重置密码成功',
            'success':false            
        })
    })
})
//修改用户
router.use('/updateUserSim.do',function(req,res){
    console.log(req.query);
    let user = req.query;
    let data;
    let keys;
    let values;
    if(req.session['user'].status==='big_administor'){
        //大管理员可以设置管理员
        keys = ['user_email','user_learningDirection','user_status','user_state'];
        values = [user.email,user.learningDirection,user.status,user.state];
    }else if(req.session['user'].status==='administor'){
        keys = ['user_email','user_learningDirection','user_state'];
        values = [user.email,user.learningDirection,user.state];
    }else{
        //非管理员身份无法调用接口
        res = res.data;
        if(res.code==='2000'){
          console.log('获取成功');
          this.list = res.user;
          this.initial(this.list);
        }else if(res.code === '1002'){
          alert('非管理员');
        }else if(res.code === '5000'){
          alert('服务器错误');
        }
        res.send(JSON.stringify(data));
        return;
    }
    if(user.reset==='false'){
        //重设密码
        keys.pop();
        values.pop();
    }
    let updateSql = myselfSql.update('user',keys,values,'user_id='+user.id)
    let promise = poolP.poolPromise(pool,updateSql);
    promise.then(result=>{
        data = {
            success:true,
            code:"2000",
            msg:'修改成功'
        }
        res.send(JSON.stringify(data));
    }).catch(err=>{
        console.log(err);
        data = {
            success:false,
            code:"5000",
            msg:'服务器错误'
        }
        res.send(JSON.stringify(data));
    })
})
//删除用户
router.use('/deleteUser.do',function(req,res){
    console.log(req.query);
    let user = req.query;
    let data;
    if(req.session['user'].status==='big_administor'){ 
        //大管理员可以删除所有人
        where = 'user_id='+user.id;
    }else if(req.session['user'].status==='administor'){
        //普通管理员可以删除同组非管理员的人
        where = 'user_id='+user.id+' and user_learningDirection=\''+req.session['learningDirection']+'\''
    }else{
        //非管理员身份无法调用接口
        data = {
            code:"1002",
            success:false,
            msg:'非管理员'
        }
        res.send(JSON.stringify(data));
        return;
    }
    let deleteSql = myselfSql.del('user',where);
    let promise = poolP.poolPromise(pool,deleteSql);
    promise.then(result=>{
        data = {
            success:true,
            msg:'删除成功',
            code:'2000'
        }
        res.send(JSON.stringify(data));
    },err=>{
        console.log(err);
        data = {
            success:false,
            msg:'服务器错误'
        }
        res.send(JSON.stringify(data))
    })
})
module.exports = router;