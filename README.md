﻿## weekly-notes项目总结
###  项目简介
一个实验室周报系统
###  所用技术
- html、css、js
- 后台使用express框架
- 数据库使用mysql
### 功能简介
- 注册登录
-  周报界面
    - 快捷周报
        - 以往周报
            - 编辑周报
            - 获取到以往周内最新一周的周报
        - 本周周报
            - 编辑周报
            - 本周周报
            - 本周计划
        - 下周计划
            - 编辑计划
            - 获取到已经书写的下周计划
    - 他人周报
        - 他人最新周报
            - 获取到相应周的周报
-  同事界面
	- 同事信息
-  个人中心
	     - 头像修改
	     - 基本信息修改
	     - 密码修改
         - 用户管理 
                    - 删除成员
                    - 状态权限管理
                    - 密码重置
### 路由布置
- /home 未登录
    - /register 注册
    - /login 登录
- /week 登陆
    - aboutWeek 周报主板面
        - quick 快捷
            - lastWeek 以往
            - thisWeek 本周
            - nextWeek 下周
        - other 最新他人周报
            - quick
                - lastWeek
                - thisWeek
                - nextWeek
    
    - workmate  同事主板面
        - pm
        - ios
        - frontEnd
        - backEnd
        - Andriod
    - person    个人主板面
        - information
        - password
        - administor
### 组件部分
- 我感觉组件和软件工程的模块化开发很类似，我把quick的router-view组件进行了复用,这时产生了问题，就是从other的quick跳转到quick的时候，组件不刷新的问题，这有三种办法可以进行解决
    1. 给router-view设置key值，不同的key值可以表明它们不是同一个组件，这样组件的内容就会进行更新。为了让key值不同，我们可以使用当前时间的时间戳作为key。
    ```
          <router-view id="contain" :key="new Date().getTime()"></router-view>
    ```
    这个方法看上去简单，其实会带来一些麻烦。在router-view中存在子路由，子路由不会自动携带参数，而:key会让组件在点击子路由之后的时候也重新获取一次数据，如果组件是通过url上的参数进行数据的获取，那么在router-view切换子路由的时候，就会导致获取不到数据，或者是获取到错误的数据的情况。
    2. 使用watch检测路由，当发现路由改变，就把信息重新获取一次。
    ```
        watch:{
        $router:"getInfo"
    }，
    methods:{
        getInfo(){}
    }
    ```
    但是这里有一个问题，就是watch检测到路由改变之后，组件不会刷新，只是调用watch中重新获取一下数据，所以一些页面创建时进行的一些初始化的操作最好封装成一个函数里面，在路由更新的时候重新调用。
    3. 导航守卫（ beforeRouteLeave）（官方推荐）
    在检测到路由即将离开的时候，把数据全改完，再离开。
    ```
        beforeRouteLeave(to,from,next){
        this.userId = null;
        this.getInfo();
        next();
        }
    ```
### 布局
采用的是弹性布局
功能模块撰写总结
#### 1、登录注册
##### 思路：
1）注册：采用邮箱注册的方式，后台采用nodemailer模块。由于需要使用SMTP方式发送，需要开启相关功能。首先得登录邮箱，开启这个设置，然后在Node后台中配置相关参数，如下：
```
let nodeMailer = require('nodemailer');		//引入nodemailer
let mailTransport = nodeMailer.createTransport({
		"domains": [
 			"qq.com"    //用的邮箱后缀，这里是qq邮箱
 		],
 		"host": "smtp.qq.com",    //主机
 		"port": 465,   //SMTP 端口
 		"secure": true,   //使用SSL
		"auth" : {    //发邮件的邮箱信息
			user : 'xxxx@qq.com',    //账号
			pass : 'xxxxx'    //不是邮箱密码（也可以使用邮箱密码 但是不安全），最好使用开启SMTP后的邮箱授权码
		}
});
```
> [什么是授权码，它又是如何设置？](http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28)

配置好之后就可以发邮件了，发送邮件使用自带的sendMail函数，配置好options就可以开始用啦！看代码
```
//这里的options是发送邮件的参数 如下
let options = {
	from : 'xxxx@qq.com',    //发件地址 也就是上面你授权的邮箱
	to : xxx@qq.com,    /收件地址  邮箱号
	// cc : '' ,  //抄送
	// bcc : '' ,   //密送
	subject : '验证码',   //标题
	text : '验证码',   //
	html : '<h4>Hi, xiongdei.</h4>'  //html内容,
	atachments : [   //附件信息（如果没有就可以直接删掉）
					{
						filename : 'img1.png',  //附件名
						path : 'xxx/src/img1.png',  //附件路径
						cid: '0000001'   //cid 可被邮箱使用
					}
	]
};	
//发送邮件
mailTransport.sendMail(options, function(err, data){
	if(err) {
		//出错的话执行操作
	}else {
		//成功执行的操作
	}
})
```
邮箱配置好之后就差不多好了一半啦！剩下的怎么验证验证码？？？
....
在这里我采用的是在收到注册请求时，通过判断邮箱合法，利用随机数生成6位验证码，并把它存在session中（因为session是存在服务器的，比存在cookie里面更安全）而且记录下了当前的时间，在下一次收到验证请求时会对比session上的验证码和请求中的验证码以及当前时间与session中存储的时间之差，如若验证码一致，且时间在3分钟之内则将用户信息存入数据库中，给客户端返回注册成功的响应。前端接收到响应后自动push到登录页面。
> 这里需要注意的是在使用vue-resource时要在请求中带上withCredeneials : true的参数，这样才能带cookie。并在后台中设置响应头,Access-Control-Allow-Credentials : true，才能接收前端发过来的cookie
> 


2）登录：点击登录判断信息合法后切换隐藏登录button换成加载button向后台发送登录请求。后台通过提取用户密码比对相等时，则代表登录成功，在session中加入用户登录信息，最后响应前端请求登录成功。前端接收到响应后自动push到世界页面。
> 封装了一个sessionOk的中间件，通过判断session中是否带有user来判断用户是否登录。

3）加密：后台采用的md5加密
```
let oldPas = crypto.createHash("md5").update(password.oldPassword).digest('hex');
```

#### 2、信息修改
##### 思路：
1）修改头像：进入修改界面会先判断用户是否还处于登录状态，修改头像利用的是input的file属性，通过点击当前头像从文件中选中图片作为头像，然后利用canvas绘制出合适大小中的图片，blob值传给后台，后台存储在固定文件夹下，固定名称为'用户id.jpg'方便之后存取，同时bable值会转成base64传给img 在页面显示。
> [前端上传压缩图片并显示 博客](https://blog.csdn.net/ganlubaba666/article/details/98473458)

2）修改密码：通过核实用户名和邮箱对应之后，再次利用nodemailer发送验证码，和注册一样核实验证码之后session中加入已验证信息，跳转至修改密码页面，前端比较两次密码一致后发送给后台，后台通过判断session中是否有已验证信息，再修改用户密码。前端接收到响应后自动push到登录页面。

3）修改个人信息：用户在当前页面进行修改，当按下保存后前端先判断是否合法，然后发送给后台，后台进行判断后，如果合法，则修改用户信息响应修改成功，并返回用户当前信息，前端重新渲染页面，否则响应为用户信息不合法。

#### 3、发周报
##### 思路：
- 后台：
  - 首先是对周报相关内容的定义，由于要存在数据库中，所以在定义它的内部数据时，定义了一个唯一的周报id，用于在对它进行操作时方便引用，由于周报有多条，所以周报的每一部分内容都用JSON.parse把数组转为字符串存储。
  - 其次，周报还有一个所属人，即user，这里引用的是发周报人的id。
- 前端：
  - 判断周报是添加还是修改，以此防止周报的二次提交，我是在获取周报的时候同时获取到周报的id，如果id存在是修改，id不存在是添加，添加完毕会返回相应的周报id，把他赋值给周报数组的id属性，这样在第二次提交的时候就会判断为修改操作了
  - 周报的删除，我发现利用pop删除数据，不会引起列表数据的同步更新
  官方的解决办法是set和splice
  ```
  for(let item in this.pitem){
            this.pitem[item] instanceof Array?this.pitem[item].splice(this.pi,1):null;
  }
  ```
####  4、周报的可编辑性
#####  思路：
> 新增的周报默认是可编辑的，从后台获取到的周报默认是不可编辑的，我在从后台获取周报的时候，会同时获取到周报的id，利用id是否存在初始化周报的可编辑性。

- 前端
1)一开始用id对可编辑性进行初始化
2)点击笔的按钮，会改变可编辑性
3)内容提交之后，会判断任务内容是否合法，如果合法，变为不可编辑状态，表示内容已经被提交，否则可编辑性不发生改变。

- 后台 
均为接受相应参数，存储数据库操作。
####  5、获取对应周的周报（日历）
#####  思路：
- 前端：
- 先使用当前年月初始化日历，当前年月之后的数据是不能够被选择的
- 当前年月发生改变的时候，会重新计算日历的日期
- 当选择相应的周数的时候给后台返回相应的周数，并且在日历上把相应的周数进行标记
- 把后台返回的数据渲染到当前页面中
- 后台：
根据请求的参数，查询数据库，返回相应的数据
####  6、获取三周的周报
#####  思路：
- 前端：
- 因为三周周报的模块被快捷周报和他人周报进行了复用，所以我们要区分一下周报是从哪里来的，而他人周报在跳转的时候存在路由参数，为了防止刷新之后参数消失，在跳转之后我用参数判断类型之后，把类型传入子组件中。
- 后台：
- 在以往周报中，我们需要取出非本周的最新周报，这就需要两次数据库请求，一个是非本周的最新周报，一个是获取到最新周报所在的那一周的所有周报，这两者是有先后顺序的，用promise控制异步肯定要进行嵌套，比较麻烦，我就用async改写了异步请求
```
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
```
#### 7、路由跳转
##### 思路
- 前端
在main.js中设置了路由守卫，通过localStorage中的数据进行登录态的判断
```
router.beforeEach((to,from,next)=>{
  console.log(to);
  var isLogin = !!window.localStorage.getItem('userId');
  if(isLogin){
    if(to.matched[0].name==='week'){
      next();
    }else{
      next('/week'); 
    }
  }else{
    if(to.matched[0].name==='home'){
      next();
    }else{
      next('/home'); 
    }
  }
})
```
- 后台
设置了sessionOk中间件,拒绝不合法的请求
```
module.exports = function(){
    return function(req, res, next) {
        if (req.session['user']){
            next();
        }else{
            res.send({
                'msg':'session不存在'
            })
        }
        
    }   
}
```
#### 8、分页器
- 前端
    在第一次进行请求的时候，totalPage值为空
    利用后台返回的总页数对前端的页数对totalPage进行初始化，在翻页的时候请求相应页数的内容
    ```
         let msg = {
            "totalPage":this.totalPage,
            "pageParams":{
              "page":this.page,
              "pageSize":this.pageSize
            }
          };

          ...

         result.totalPage?this.totalPage=result.totalPage:null;

    ```
- 后台
    通过判断前端的totalPage值是否为空来判断是否是第一次请求页数
    在mysql中用limit(count*(page-1),count*(page-1)+pageSize)从数据库中获取相应页数的数据
    ```
    where = 'user_id<>'+req.session['user'].id+' limit '+(pageParams.page-1)*pageParams.pageSize+","+pageParams.pageSize;
    ```
### 待改进地方
1. 后台传出图片的操作有点蠢，最好的办法是使用url路径，而不是传输二进制的文件
2. 上传头像的部分没有裁剪功能
3. 代码复用部分较少，命名格式不够规范    
