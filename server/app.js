/*
    用连接池连接数据库
*/
const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie');
//用来读取cookie的
const cookieParser = require('cookie-parser');
//session 是基于 cookie生成的
const cookieSession = require('cookie-session');
const sessionOk = require('./sessionOk.js');
const user = require('./routers/user.js');
const task = require('./routers/task.js');
const workmate = require('./routers/workmate.js')

let pool = require('./mysql/db.js');
const poolP = require('./libs/poolPromise.js');
const myselfSql = require('./mysql.js');
const readFile = require('./libs/readFile');

let server = new express();
var ws = require('nodejs-websocket');


ws.createServer(function(conn){
    var timer;
    let count = 0;
    var sendArr;
    conn.on('text', function(id) {
        timer = setInterval(() => {
            if(id) {
                var asyncMsg = async function(){
                    let selectPerson,selectSql;
                    //判断身份
                    selectPerson = myselfSql.select('user',['user_status','user_learningDirection'],'user_id='+id);
                    let  [{user_status,user_learningDirection}] = await poolP.poolPromise(pool,selectPerson);
                    console.log(user_status);
                    if(user_status==='big_administor'){
                        var mes = {
                            'success' : false,
                            'result' : '用户没有此权限'
                        }
                        conn.sendText(mes);
                        clearInterval(timer);
                        return;
                    }
                    if(count === 0){//第一次读取,获取所有信息
                        count++;
                        console.log('第1次'); 
                        //判断身份
                        //普通用户获得的是被拒绝或者同意的信息
                        if(user_status==="none"){
                            selectSql= myselfSql.select('mes left join user on mes.user_id = user.user_id','*','(mes.mes_agree = 1 or mes.mes_agree = -1) and  mes.user_id='+id+' order by mes_id desc');
                        }else{
                            //管理员获得的是申请的信息
                        selectSql= myselfSql.select('mes left join user on mes.user_id = user.user_id','*','mes.user_id<>'+id+'  and mes.mes_learningDirection=\''+user_learningDirection+'\' order by mes_id desc');
                        }
                    }else{
                        //之后只获得未读取信息,或是未接收信息
                        if(user_status==="none"){
                            selectSql= myselfSql.select('mes left join user on mes.user_id = user.user_id','*','(mes.mes_agree = 1 or mes.mes_agree = -1) and mes.mes_accept = 0 and  mes.user_id='+id+' order by mes_id desc');
                        }else{  
                            selectSql= myselfSql.select('mes left join user on mes.user_id = user.user_id','*','mes.user_id<>'+id+' and mes.mes_send = 0 and mes.mes_learningDirection=\''+user_learningDirection+'\' order by mes_id desc');
                        }    
                    }
                    let updateSql;
                    if(user_status==="none"){
                        updateSql= myselfSql.update('mes left join user on mes.user_id = user.user_id',['mes.mes_accept'],[1],'(mes.mes_agree = 1 or mes.mes_agree = -1) and mes.mes_accept = 0 and  mes.user_id='+id);
                    }else{
                        updateSql = myselfSql.update('mes left join user on mes.user_id = user.user_id',['mes.mes_send'],[1],'user.user_check = 0 and mes.user_id<>'+id+' and mes.mes_send = 0 and mes.mes_learningDirection=\''+user_learningDirection+'\'');
                    }    
                    
                    var result = await poolP.poolPromise(pool,selectSql);
                    console.log(result);
                    for(let i = 0,length=result.length;i<length;i++){
                        console.log("i:"+i);
                        console.log(result[i].user_path)
                        if(result[i].user_path){
                            var cont = await readFile('static/pic/'+result[i].user_path);
                            result[i].pic = 'data:image/png;base64,' +cont.toString('base64');
                        }  
                    }
                    var mes = {
                        'result':result,
                        'msg':'加入信息'
                    }
                    conn.sendText(JSON.stringify(mes));
                    await poolP.poolPromise(pool,updateSql);
                }
                asyncMsg().catch((err)=>{
                    console.log(err);
                });
            }else {
                var mes = {
                    'success':false,
                    'result' : '用户未登录'
                }
                conn.sendText(mes);
                clearInterval(timer);
            }
            },5000);
    })
    conn.on('connect', function(code) {
        console.log('开启连接', code)
    })
    conn.on('close', function(code, res) {
        clearInterval(timer);
    })
    conn.on('error', function(code, res) {
        clearInterval(timer);
    })

}).listen(8090);
//用来解析content-tyoe = "www-form-urlencoded"
server.use(bodyParser.urlencoded({}))
//用来解析content-type = "application/json"
server.use(bodyParser.json({}))

   
server.listen(8084);
server.use(cookieParser('secret'));
//因为session不是独立存在的，是基于cookie的，所以仍然需要解析cookie的工具
//session是必须加入签名的，如果没加签名的话，系统会报错，告诉你Error:.required for signed cookies
(function(){
        let arr = [];
        for(let i = 0;i<10000;i++){
            arr.push('keys_'+Math.random());
        }
        server.use(cookieSession({
            keys:arr,//设置session密钥
            name:'user'//加密的cookie的名字,存储的是一个session_id,最后通过这个来在服务端查找到对应的人
        }))
        server.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            //允许的请求方式
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By",' 3.2.1');
            res.header("Content-Type", "application/json;charset=utf-8");
            //将Access-Control-Allow-Credentials设为true  允许携带cookie
            res.header('Access-Control-Allow-Credentials', true); 
            next();
         });
})();

server.use('/weekly_war/user',user);
server.use('/weekly_war/task',task);
server.use('/weekly_war/workmate',workmate)
