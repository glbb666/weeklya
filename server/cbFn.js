const myselfSql = require('./mysql.js');
const poolP = require('./libs/poolPromise.js');
module.exports = {
    register(pool){
        return function(req,res){
            console.log("注册:");
            console.log(req.body);
            let user = req.body;
            let data;
            // 注册成功需要满足以下条件
            // 1.用户名不能为空
            if(!user.email){
                data = {
                    msg:"参数为空",
                    code:1003,
                    success:false
                };
                res.send(JSON.stringify(data));
            }else if(user.password.length<4||user.password.length>18){
             // 2.密码的长度符合要求
               data = {
                        msg:"注册失败,密码长度不对!",
                        code:1004,
                        success:false
                    };
                    res.send(JSON.stringify(data));
            }else{
            // 3.用户名在数据库中不存在
            //在数据库中创建一个user表，保存注册的用户信息
            //当要新添入用户的时候，就查看user表，如果有相同的用户名，那么注册成功，否则注册失败。
            //直接使用连接池
            let addSql = myselfSql.insert('user',['user_id','user_email','user_password','user_phone'],[0,"'"+user.email+"'","'"+user.password+"'","'"+user.phone+"'"])
            //增加成员
            let promise = poolP.poolPromise(pool,addSql);
            promise.then(result=>{
                console.log(result);  
                data = {
                    msg:"注册成功",
                    code:2000,
                    success:true,
                    user:{
                        //id要从数据库中获取
                        "id":result.insertId,
                        "email":null,
                        "password":null,
                    }
                }
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
                    if(err.code==='ER_DUP_ENTRY'){
                        data = {
                            msg:"注册失败,用户名已存在",
                            code:4000,
                            success:false
                        }
                    }else{
                        data = {
                            msg:"未知错误",
                            code:5000,
                            success:false
                        }
                    }
                    res.send(JSON.stringify(data));
            })
            }
            //结束响应
        }
    },
    login(pool){
        return function(req,res){
            console.log("登录:");
            console.log(req.body);
            //当登陆的时候,调取数据库中user表的内容,如果表中的内容存在,那么说明这个用户已经注册过了,那么我们就验证用户输入的密码和数据库中的密码是否匹配,如果匹配的话,那么就让用户登录成功,并且给客户端设置一个cookie,否则用户登陆失败.
            let user = req.body;
            let data = {};
            if(user.email){
                //注意:如果要进行字符串比较,这里的user.email必须被双引号包住
                let searchSql = myselfSql.select('user',['user_email','user_password','user_id','user_status','user_learningDirection'], 'user_email="'+user.email+'"');
                // console.log(searchSql);
                let promise = poolP.poolPromise(pool,searchSql);
                promise.then(result=>{
                     //这里只能判断长度,不能用result!=[],因为数组也是对象,对象默认是不相等的
                     if(result.length!=0){
                        //当不为空,说明用户存在
                        console.log(result);
                        if(result[0].user_password===user.password){
                            data = {
                                msg:"登陆成功",
                                code:2000,
                                success:true,
                                user:{
                                    id:result[0].user_id,
                                    userName:result[0].user_email,
                                    administor:result[0].user_status
                                }
                            };
                            //给跳转之后的页面设置cookie
                            //登陆成功之后,设置cookie
                            // req.secret = 'secret';
                            // res.cookie('user',result[0].user_id,{
                            //     //因为path为绝对路径
                            //     //只有匹配到相应的path,才会设置上cookie
                            //     path:'/',//默认值为'/'
                            //     maxAge:30*24*3600*1000,
                            //     signed:true
                            // }); 
                            // console.log(req.session);
                            // if(!req.session['id']){
                                //问题:旧的session['id']会被新的覆盖
                                req.session['id'] = result[0].user_id;
                                req.session['status'] = result[0].user_status;
                                req.session['learningDirection'] = result[0].user_learningDirection
                                // console.log(req.session,101);
                            // }
                        }else{
                            data = {
                                msg:"账户或密码错误",
                                code:3000,
                                success:false
                            };
                        }
                    }else{
                        //用户不存在
                        data = {
                            msg:"账户或密码错误",
                            code:3000,
                            success:false
                        };
                    }
                    res.send(JSON.stringify(data));
                }).catch(err=>{
                    console.log(err);
                        data = {
                            msg:"服务器错误",
                            code:5000,
                            success:false
                        };
                        res.send(JSON.stringify(data));    
                })
            }else{
                data = {
                    msg:"用户名为空",
                    code:1004,
                    success:false
                };
                res.send(JSON.stringify(data));
            }
        }
    },
    quick(pool){
         //获取某用户三周(上,这,下)周报接口
        //因为每次用if判断session都是一件比较麻烦的事情,所以我就自己写了一个判断session的中间件,当session合法的时候，才会执行下一个use的内容。
        //在一个路径上挂载一个中间件之后，每当请求的路径的前缀部分匹配了这个路由路径，那么这个中间件就会被执行。 由于默认的路径为/，中间件挂载没有指定路径，那么对于每个请求，这个中间件都会被执行。我们还可以在第一个参数中使用正则表达式,对发来的请求进行筛选。
        //sessionOk检测发来的请求有没有session值,如果有的话，才开放对'/weekly_war/task/getTasks.do'接口的请求。 
        return function(req,res){
            console.log('快捷');
            console.log(req.query);
            let userId;
            if(req.query.id==="null"){
                userId = req.session.id;
            }else{
                userId = req.query.id;
            }
            console.log(req.session);
            let data = {};
            // console.log(Object.entries(req.session))
            // if(req.session['id']){
               // Object.keys(req.session).length>1
                //1.如果session存在,说明我们已经通过session_id查到对应的session了
                //2.因为session是一个对象,当session没有值时，是一个空对象，布尔值为false的只有null,undefined,0,"",NaN，所以说空对象的布尔值为true
                //3.为了校验它是不是一个空对象,我们可以用es6的Object.keys()方法,这个方法的返回值是一个由参数对象自身的(不含继承的)可枚举键名组成的数组,我们可以通过判断数组的长度来知道req.session是不是一个空对象。
                //4.它原本还存在一个值_ctx,所以我们判断的条件应该在原本的条件下加一
                    // from_unixtime用来把时间戳转换为日期
                    //这里我进行了改写
                    /* 
                        这里的curdata()取得的一周是从周日开始到周六,而我想获得的一周是从周一开始到周日,也就是curdata()加一天。我首先想到的是,我可以用明天作为一周的基准 ,但是我发现YEARWEEK(DATE_SUB(curdate(),INTERVAL -1 DAY))没有起作用,于是我修改了一下时间戳,因为时间戳的单位为毫秒,所以我让时间戳减去一天等于本周(星期日到星期六)。这样的话,相当于时间戳不减去一天等于本周(星期一到星期天)
                    */
                   //上周周报
                    let lastSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(now(),1)-1 and user_id="+userId+" and weekly_flag=0 order by weekly_taskData desc");
        
                   //本周周报
                    let thisSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(curdate(),1) and user_id="+userId)+" and weekly_flag=0 order by weekly_taskData desc";
                    //本周计划
                    let thisSQL1 = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(curdate(),1) and user_id="+userId)+" and weekly_flag=1 order by weekly_taskData desc";
                
                    //下周计划
                    let nextSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(curdate(),1)+1 and user_id="+userId)+" and weekly_flag=1 order by weekly_taskData desc";
        
                    Promise.all(poolP.poolPromise(pool,[lastSQL,thisSQL,thisSQL1,nextSQL])).then(result=>{
                        //这里面的内容只会执行一次
                        // console.log(result);
                        data={
                            msg:"成功",
                            code:2000,
                            success:true,
                            lastTask:result[0],
                            thisTask:result[1],
                            thisPlan:result[2],
                            nextTask:result[3]
                        }
                        res.send(JSON.stringify(data));
                    }).catch(e=>{
                        console.log(e)
                        data={
                            msg:"服务器错误",
                            code:5000,
                            success:false,
                        }
                        res.send(JSON.stringify(data));
                    });     
                // console.log(data);
        }
    },
    oneTask(pool){
        return function(req,res){
            console.log('某一周');
            console.log(req.session);
            console.log(req.query);
            let id = req.query.id;
            let time = req.query.weektime;
            let data = {};
            let lastSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = "+time+" and user_id="+req.session["id"]+" order by weekly_taskData");
            let promise = poolP.poolPromise(pool,lastSQL);
            promise.then(result=>{
                //这里面的内容只会执行一次
                console.log(result);
                data={
                    msg:"成功",
                    code:2000,
                    success:true,
                    Task:result
                }
                res.send(JSON.stringify(data));
            }).catch(e=>{
                console.log(e)
                data={
                    msg:"服务器错误",
                    code:5000,
                    success:false,
                }
                res.send(JSON.stringify(data));
            });     
            // console.log(data);
        }
    },
    addTask(pool){
        return function(req,res){
            //在数据库中建一张表存储周报
            console.log('添加');
            console.log(req.query);
            let week = req.query;
            let insertSql = myselfSql.insert('content',['weekly_taskData','weekly_taskName','weekly_content','weekly_completeDegree','weekly_timeConsuming','user_id','weekly_flag'],[week.taskDate,"'"+week.taskName+"'","'"+week.content+"'","'"+week.timeDegree+"'","'"+week.timeConsuming+"'",req.session["id"],week.flag]);
            let promise = poolP.poolPromise(pool,insertSql);
            promise.then(result=>{
                data = {
                    msg:"插入成功",
                    code:2000,
                    success:true,
                    weekly_id:result.insertId
                }
                //为了防止重复提交,在提交成功之后,把数据库中的id获取到,这样以后调用的就是修改的接口了
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
                console.log(err.sqlState);
                if(err.sqlState==22007){
                    data = {
                        msg:"日期的格式有问题",
                        code:1004,
                        success:false
                    }
                }else{
                    data = {
                        msg:"服务器错误",
                        code:5000,
                        success:false
                    }
                }
                res.send(JSON.stringify(data));
            })
    }
    },
    updateTask(pool){
        return function(req,res){
            //在数据库中建一张表存储周报
            console.log('修改');
            console.log(req.query);
            let week = req.query;
            week.taskDate = Date.parse(week.taskDate);
            let updateSql = myselfSql.update('content',['weekly_taskName','weekly_content','weekly_completeDegree','weekly_timeConsuming'],[week.taskName,week.content,week.timeDegree,week.timeConsuming],'user_id='+req.session['id']+' and weekly_id='+week.weekId);
            console.log(updateSql);
            let promise = poolP.poolPromise(pool,updateSql);
            promise.then(result=>{
                data = {
                    msg:"插入成功",
                    code:2000,
                    success:true
                }
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
                console.log(err.sqlState);
                if(err.sqlState==22007){
                    data = {
                        msg:"日期的格式有问题",
                        code:1004,
                        success:false
                    }
                }else{
                    data = {
                        msg:"服务器错误",
                        code:5000,
                        success:false
                    }
                }
                res.send(JSON.stringify(data));
            })
        }
    },
    allTasks(pool){
        return function(req,res){
            console.log("所有:")
            console.log(req.body);
            let msg  = req.body;
            let pageParams = msg.pageParams;
            let data;
            let arr = [];
            let selectSql = myselfSql.select('content left join user on content.user_id=user.user_id',"content.user_id,content.weekly_taskData,user.user_learningDirection,user.user_name,content.weekly_id","content.user_id<>"+req.session.id+" and content.weekly_flag = 0 and user.user_learningDirection='"+req.session['learningDirection']+"'order by content.weekly_taskData desc limit "+(pageParams.page-1)*pageParams.pageSize+","+pageParams.pageSize);
            arr.push(selectSql);
            if(!msg.totalPage){//是第一次请求
                let countSql = myselfSql.select('content left join user on content.user_id=user.user_id','count(*)',"content.user_id<>"+req.session.id+" and content.weekly_flag = 0 and user.user_learningDirection='"+req.session['learningDirection']+"'order by content.weekly_taskData desc");
                arr.push(countSql);
            }            
            Promise.all(poolP.poolPromise(pool,arr)).then(result=>{
                console.log(result);
                data = {
                    msg:"获取成功",
                    code:2000,
                    success:true,
                    tasks:result[0]
                }
                if(!msg.totalPage){
                   data.totalPage = Math.ceil(result[1][0]["count(*)"]/pageParams.pageSize);
                //   console.log(data);
                }
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
            })
        }
    },
    deleteTask(pool){
        return function(req,res){
            let deleteSql = myselfSql.del('content','weekly_id='+req.query.id);
            let promise = poolP.poolPromise(pool,deleteSql);
            let data = {};
            promise.then(result=>{
                data = {
                    msg:"成功",
                    code:2000,
                    success:true
                };
                res.send(JSON.stringify(data))
            }).catch(err=>{
                console.log(err);
                data = {
                    msg:"失败",
                    code:5000,
                    success:false
                };
                res.send(JSON.stringify(data));
            })
        }
    },
    logout(){
        return function(req,res){
            try{
                req.session.id = null;
                res.clearCookie('user');
                data = {
                    msg:"成功",
                    code:2000,
                    success:true
                };
            }catch{
                data = {
                    msg:"失败",
                    code:1000,
                    success:false
                };
            }
           
            res.send(JSON.stringify(data));        
        }
    }, 
    getInfo(pool){
        return function(req,res){
            let data = {};
            console.log(req.session)
            console.log(req.cookies)
            let searchSql = myselfSql.select('user','*','user_id='+req.session.id);
            let promise = poolP.poolPromise(pool,searchSql);
            promise.then(result=>{
                let user = result[0];
                data = {
                    msg:"获取成功",
                    code:2000,
                    success:true,
                    user:user
                }
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
                data = {
                    msg:"获取失败",
                    code:5000,
                    success:false
                }
                res.send(JSON.stringify(data));
            })
            
        }
    },
    modifyInfo(pool){
        return function(req,res){
            console.log(req.query);
            let user = req.query;
            let updateSql = myselfSql.update('user',['user_email','user_phone','user_state','user_professionalClass','user_learningDirection','user_address','user_name'],[user.email,user.tel,user.state,user.professionalClass,user.learningDirection,user.address,user.userName],'user_id='+req.session.id);
            let promise = poolP.poolPromise(pool,updateSql);
            let data;
            promise.then(result=>{
                data = {
                    success:true,
                    code:2000,
                    msg:'插入成功'
                }
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
                data = {
                    success:false,
                    code:5000, 
                    msg:'插入失败'
                }
                res.send(JSON.stringify(data));
            })
        }
    },
    modifyPassword(pool){
        return function(req,res){
            let password = req.query;
            console.log(req.query);
            let updateSql = myselfSql.update('user',['user_password'],[password.newPassword],'user_id='+req.session.id+' and user_password='+password.oldPassword);
            console.log(updateSql);
            let promise = poolP.poolPromise(pool,updateSql);
            let data;
            promise.then(result=>{
                console.log(result);
                if(result.changedRows === 0 && result.affectedRows===1){
                    data = {
                        success:false,
                        code:3000,
                        msg:'新密码和原密码一致，无需修改'
                    }
                }else if(result.changedRows === 0 && result.affectedRows===0){
                    data = {
                        success:false,
                        code:3000,
                        msg:'原密码错误'
                    }
                }else{
                    data = {
                        success:true,
                        code:2000,
                        msg:'修改成功'
                    };
                    console.log('修改成功');
                }
                res.send(JSON.stringify(data));
            }).catch(err=>{
                console.log(err);
                data = {
                    success:false,
                    code:5000,
                    msg:'修改失败'
                }
                res.send(JSON.stringify(data));
            })
        }
    },
    getAllUser(pool){
        return function(req,res){
            //获取全部的用户
            let keys = [];
            let where;
            let data;
            if(req.session.status==='big_administor'){
                keys = ['user_id','user_email','user_state','user_status','user_learningDirection'];
                console.log('大管理员');
                where = 'user_id<>'+req.session.id;
            }else if(req.session.status === 'administor'){
                keys = ['user_id','user_email','user_state','user_learningDirection'];
                console.log('管理员');
                where = 'user_status is null and user_learningDirection=\''+req.session['learningDirection']+'\'';
            }else{
                data={
                    success:false,
                    msg:'没有权限访问',
                    code:'1002'
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
                        code:'2000',
                        user:result
                    }
                    res.send(JSON.stringify(data))
                }).catch(err=>{
                data={
                        success:false,
                        msg:'服务器错误',
                        code:'5000'
                    }
                    res.send(JSON.stringify(data))
                    console.log(err);
            })
        }
    },
    updateUser(pool){
        return function(req,res){
            console.log(req.query);
            let user = req.query;
            let data;
            let keys;
            let values;
            if(req.session['status']==='big_administor'){
                //大管理员可以设置管理员
                keys = ['user_email','user_status','user_state','user_password'];
                values = [user.email,user.status,user.state,'123456'];
            }else if(req.session['status']==='administor'){
                keys = ['user_email','user_state','user_password'];
                values = [user.email,user.state,'123456'];
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
        }
    },
    deleteUser(pool){
        return function(req,res){
            console.log(req.query);
            let user = req.query;
            let data;
            if(req.session['status']==='big_administor'){ 
                //大管理员可以删除所有人
                where = 'user_id='+user.id;
            }else if(req.session['status']==='administor'){
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
                    code:'5000',
                    msg:'服务器错误'
                }
                res.send(JSON.stringify(data))
            })
        }
    }
}