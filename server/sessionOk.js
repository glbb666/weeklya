/*
    这是一个判断session是否存在的中间件
*/
module.exports = function(){
    return function(req, res, next) {
        if (req.session['user']){
            next();
        }else{
            res.send({
                'msg':'session不存在',
                'success':false,
                'code':1000
            })
        }
        
    }   
}