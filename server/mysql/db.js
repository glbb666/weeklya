const mysql = require('mysql');

const pool = mysql.createPool({
    //创建的最大连接数
    connectionLimit:10,
    //队列数量限制:在调用getConnection返回错误之前,连接池所允许入队列的最大请求数量
    queueLimit:1,
    //连接等待时间:当无连接可用或连接数达到上限的时候,判定连接池动作.如果为true,连接池将会请求加入队列,待可用之时再触发操作,如为false,连接池将立即返回错误(默认值:true)
    host:'localhost',
    user:'root',
    password:'191026',
    database:'weekly',
    multipleStatements: true		//设置属性为true 允许执行多条sql
})
module.exports = pool;