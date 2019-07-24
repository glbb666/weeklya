const express = require('express');
let pool = require('../mysql/db.js');
let router = express.Router();
const poolP = require('../libs/poolPromise.js');
const myselfSql = require('../mysql.js');
const sessionOk = require('../sessionOk.js');

router.use(sessionOk())
//获取三周周报接口
router.use('/getTasks.do',function(req,res){
    console.log('快捷');
    console.log(req.query);
    let userId;
    if(req.query.id==="null"){
        userId = req.session['user'].id;
    }else{
        userId = req.query.id;
    }
    console.log(req.session.user);
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
})
//获取某一周周报接口
router.use('/getOneTask.do',function(req,res){
    console.log('某一周');
    console.log(req.session);
    console.log(req.query);
    let id = req.query.id;
    let time = req.query.weektime;
    let data = {};
    let lastSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = "+time+" and user_id="+req.session["user"].id+" order by weekly_taskData");
    let promise = poolP.poolPromise(pool,lastSQL);
    promise.then(result=>{
        //这里面的内容只会执行一次
        console.log(result);
        data={
            msg:"成功",
            success:true,
            Task:result
        }
        res.send(JSON.stringify(data));
    }).catch(e=>{
        console.log(e)
        data={
            msg:"服务器错误",
            success:false,
        }
        res.send(JSON.stringify(data));
    });     
    // console.log(data);
})
//添加周报接口
router.use('/addTask.do',function(req,res){
    //在数据库中建一张表存储周报
    console.log('添加');
    console.log(req.query);
    let week = req.query;
    let insertSql = myselfSql.insert('content',['weekly_taskData','weekly_taskName','weekly_content','weekly_completeDegree','weekly_timeConsuming','user_id','weekly_flag'],[week.taskDate,"'"+week.taskName+"'","'"+week.content+"'","'"+week.timeDegree+"'","'"+week.timeConsuming+"'",req.session["user"].id,week.flag]);
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
})
//修改周报接口
router.use('/updateTask.do',function(req,res){
    //在数据库中建一张表存储周报
    console.log('修改');
    console.log(req.query);
    let week = req.query;
    week.taskDate = Date.parse(week.taskDate);
    let updateSql = myselfSql.update('content',['weekly_taskName','weekly_content','weekly_completeDegree','weekly_timeConsuming'],[week.taskName,week.content,week.timeDegree,week.timeConsuming],'user_id='+req.session['user'].id+' and weekly_id='+week.weekId);
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
})
//获取所有周报接口
router.use('/getAllTasksByUserId.do',function(req,res){
    console.log("所有:")
    console.log(req.body);
    let msg  = req.body;
    let pageParams = msg.pageParams;
    let data;
    let arr = [];
    let selectSql = myselfSql.select('content left join user on content.user_id=user.user_id',"content.user_id,content.weekly_taskData,user.user_learningDirection,user.user_name,content.weekly_id","content.user_id<>"+req.session['user'].id+" and content.weekly_flag = 0 and user.user_learningDirection='"+req.session['user'].learningDirection+"'order by content.weekly_taskData desc limit "+(pageParams.page-1)*pageParams.pageSize+","+pageParams.pageSize);
    arr.push(selectSql);
    if(!msg.totalPage){//是第一次请求
        let countSql = myselfSql.select('content left join user on content.user_id=user.user_id','count(*)',"content.user_id<>"+req.session['user'].id+" and content.weekly_flag = 0 and user.user_learningDirection='"+req.session['user'].learningDirection+"'order by content.weekly_taskData desc");
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
})
//删除周报接口
router.use('/deleteTask.do',function(req,res){
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
})
module.exports = router;