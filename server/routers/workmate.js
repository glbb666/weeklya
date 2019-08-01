const express = require('express');
let pool = require('../mysql/db.js');
let router = express.Router();
const poolP = require('../libs/poolPromise.js');
const myselfSql = require('../mysql.js');
const sessionOk = require('../sessionOk.js');

let formatDateTime = require('../task/formatDateTime')
let getYearWeek = require('../task/getYearWeek')

router.use(sessionOk())
//获取全部同事
router.use('/getWorkmate.do',function(req,res){
    console.log('全部');
    let data;
    let keys = ['user_id','user_email','user_state','user_professionalClass','user_phone','user_address'];
    let where = 'user_id<>'+req.session['user'].id;
    let arr = ['前端','后台','ios','Android','产品'];
    let searchSql = []
    for(let i = 0,length = arr.length;i<length;i++){
        searchSql[i] = myselfSql.select('user',keys,where+' and user_learningDirection=\''+arr[i]+'\'');
    }
    Promise.all(poolP.poolPromise(pool,searchSql)).then(result=>{
        console.log(result);
        data = {
            msg:"获取成功",
            code:2000,
            success:true,
            frontEnd:result[0],
            backEnd:result[1],
            ios:result[2],
            Android:result[3],
            pm:result[4]
        }
        res.send(JSON.stringify(data));
    }).catch(err=>{
        console.log(err);
    })
})
module.exports = router;