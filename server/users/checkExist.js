const poolP = require('../libs/poolPromise.js');
const myselfSql = require('../mysql.js');

var checkExist = function(pool,email,name,callback){
    let selectSql = myselfSql.select('user',['user_id'],"user_name='"+name+"' and user_email='"+email+"'");
    let promise = poolP.poolPromise(pool,selectSql);
	promise.then(res=>{
		if(res.length){
			callback({
				'error':false,
				'msg':'用户名已存在'
			})
		}else{
			callback({
				'error':true,
				'msg':'不存在该用户'
			})
		}
	}).catch(err=>{
		console.log(err);
		callback({
			'error': true,
			'result': '服务器错误'
		})
	})
}
module.exports = checkExist;