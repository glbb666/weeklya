const poolP = require('../libs/poolPromise.js');
const myselfSql = require('../mysql.js');

var checkLegal = function(pool, email, name, callback) {
	let selectSql1 = myselfSql.select('user',['user_id'],"user_name='"+name+"'");
	let selectSql2 = myselfSql.select('user',['user_id'],"user_email='"+email+"'");
	Promise.all(poolP.poolPromise(pool,[selectSql1,selectSql2])).then(res=>{
		if(res[0].length){
			callback({
				'error':true,
				'msg':'用户名已存在'
			})
		}else if(res[1].length){
			callback({
				'error':true,
				'msg':'邮箱已存在'
			})
		}else{
			callback({
				'error':false,
				'msg':'可以进行注册'
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

module.exports = checkLegal;