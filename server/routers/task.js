const express = require('express');
let pool = require('../mysql/db.js');
let router = express.Router();
const poolP = require('../libs/poolPromise.js');
const myselfSql = require('../mysql.js');
const sessionOk = require('../sessionOk.js');

let formatDateTime = require('../task/formatDateTime')
let getYearWeek = require('../task/getYearWeek')

router.use(sessionOk())
//获取三周周报接口
router.use('/getTasks.do',function(req,res){
    console.log('快捷');
    console.log(req.query);
    let userId,time = null;
    if(req.query.id==="null"){//自己的
        userId = req.session['user'].id;
    }else{
        userId = req.query.id;//别人的，有可能是选的，有可能是默认的
        time = req.query.timeStamp;
        if(time==='null')time = null;
        else{
            time = formatDateTime(time);
            time = getYearWeek(time);
        }
    }
    console.log(req.session.user);
    let data = {}; 
    //（以往的最新一周的周报）取出这周之前的最上面的那天,计算出它所属的是那一周,然后把那一周的周报按降序取出
    let day = null;
    let lastSQL = null; 
    //本周周报
    let thisSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(curdate(),1) and user_id="+userId)+" and weekly_flag=0 order by weekly_taskData desc";
    //本周计划
    let thisSQL1 = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(curdate(),1) and user_id="+userId)+" and weekly_flag=1 order by weekly_taskData desc";

    //下周计划
    let nextSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = YEARWEEK(curdate(),1)+1 and user_id="+userId)+" and weekly_flag=1 order by weekly_taskData desc";
    
    const asyncDay = async function(){
        try{
            if(!time){
                day = myselfSql.select('content',"weekly_taskData","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) < YEARWEEK(now(),1) and user_id="+userId+" and weekly_flag=0 order by weekly_taskData desc limit 0,1");
                day = await poolP.poolPromise(pool,day);
                console.log(day);
                if(day.length>0){
                    time = formatDateTime(day[0].weekly_taskData);
                    time = getYearWeek(time);
                }else{
                    time = -1;
                }
            }
            console.log(time,userId);
            lastSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = "+time+" and user_id="+userId+" and weekly_flag=0 order by weekly_taskData desc");
            return await Promise.all(poolP.poolPromise(pool,[lastSQL,thisSQL,thisSQL1,nextSQL]));
        }catch(e){
            console.log(e);
        }  
    }
    asyncDay().then(result=>{
        data={
                        msg:"成功",
                        code:2000,
                        success:true,
                        lastTask:result[0],
                        thisTask:result[1],
                        thisPlan:result[2],
                        nextTask:result[3],            
                    }
                    res.send(JSON.stringify(data));
    }).catch(err=>{
        console.log(err)
        data={
            msg:"服务器错误",
            code:5000,
            success:false,
        }
        res.send(JSON.stringify(data));
    });  
})
//获取某一周周报接口
router.use('/getOneTask.do',function(req,res){
    console.log('某一周');
    console.log(req.session);
    console.log(req.query);
    let userId = null;
    if(req.query.userId){
        userId = req.query.userId
    }else{
        userId = req.session["user"].id
    }
    let time = req.query.weektime;
    let data = {};
    let lastSQL = myselfSql.select('content',"*","YEARWEEK(date_format(from_unixtime((weekly_taskData)/1000),'%Y-%m-%d'),1) = "+time+" and user_id="+userId+" and content.weekly_flag = 0 order by weekly_taskData desc");
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
    //如果是别人的,看看自己有没有小组资格
    console.log("checkis"+req.session['user'].check);
    if(req.session['user'].check===0){
        res.send({
            'msg':'你还没有加入任何小组哦',
            'success':false
        })
        return;
    }
    console.log(req.body);
    let msg  = req.body;
    let pageParams = msg.pageParams;
    let data;
    let arr = [];
    let selectSql = myselfSql.select('content left join user on content.user_id=user.user_id',"content.user_id,content.weekly_taskData,user.user_learningDirection,user.user_name,content.weekly_id","content.user_id<>"+req.session['user'].id+" and content.weekly_flag = 0 and user.user_check = 1 and user.user_learningDirection='"+req.session['user'].learningDirection+"'order by content.weekly_taskData desc limit "+(pageParams.page-1)*pageParams.pageSize+","+pageParams.pageSize);
    arr.push(selectSql);
    if(!msg.totalPage){//是第一次请求
        let countSql = myselfSql.select('content left join user on content.user_id=user.user_id','count(*)',"content.user_id<>"+req.session['user'].id+" and content.weekly_flag = 0 and user.user_check = 1 and user.user_learningDirection='"+req.session['user'].learningDirection+"\'");
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
//计划是否完成接口
router.use('/checkFinished',function(req,res){
    let {id,checked} = req.query;
    let updateSql = myselfSql.update('content',['weekly_check'],[checked],'weekly_id='+id);
    let promise = poolP.poolPromise(pool,updateSql);
    promise.then(()=>{
        res.send({
            'msg':'修改成功',
            'success':true
        })
    }).catch((err)=>{
        console.log(err);
        res.send({
            'msg':'服务器错误',
            'success':false
        })
    })
})
module.exports = router;