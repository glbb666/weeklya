<template>
  <div>
      <!--主要内容-->
      <div id="contain">
        <div id="findPart">
          <div id="find">
            <!--此处用div盒子把select选项包围起来，再把select设置为none，就可以把图片覆盖在select上面，更改select的样式了-->
            <div id="year">
              <div>年份</div>
              <div>
                <div>
                  <select v-model="curYear" >
                    <option v-for="i in 50">{{Number(year)+i-1}}</option>
                  </select>
                  <img src="../../static/2/arrow.png" alt="">
                </div>
              </div>
            </div>
            <div id="month">
              月份
              <ul>
                <li  v-for="moon in 12" @click="click(moon,$event)">
                  {{moon}}
                </li>
              </ul>
            </div>
          </div>
          <div id="findContain">
            <table>
              <thead>
              <tr>
                <th>所属组别</th>
                <th>姓名</th>
                <th>同步时间</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in sliceList" :key="item.weekly_id">
                <td>{{item.user_learningDirection}}</td>
                <td>{{item.user_name}}</td>
                <td>{{formatDateTime(item.weekly_taskData)}}</td>
                <td>
                  <router-link :to="{path:'/week/aboutWeek/my/content',query:{content:item.weekly_content,time:formatDateTime(item.weekly_taskData
                  ),completeDegree:item.weekly_completeDegree,taskName:item.weekly_taskName,timeConsuming:item.weekly_timeConsuming}}">查看</router-link>
                  <a @click.prevent="del(item.weekly_id)">删除</a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <ul id="findPage">
            <li @click="changePage(-1,true)">上一页</li>
            <li>当前第&nbsp;{{page}}&nbsp;页</li>
            <li>
              到
              <select name="" id="page" v-model="page">
                <option v-for="i in totalPage">{{i}}</option>
              </select>
              页
            </li>
            <li>共&nbsp;{{totalPage}}&nbsp;页</li>
            <li @click="changePage(1,true)">下一页</li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  export default{
    name: 'my',
    data(){
      return {
        list:[],
        year:new Date().getFullYear(),
        curYear:new Date().getFullYear(),
        moon:'',
        page:'',
        pageSize:10,
        curList:[],
        sliceList:[],
        totalPage:0,
        beforeLi:false
      }
    },
    watch:{
      'curYear':function(){
        this.initial(this.search(this.curYear));
      },
      'moon':function(){
        this.initial(this.search(this.curYear));
      },
      'page':function(){
        this.sliceList = this.curList.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
      }
    },
    methods:{
      search(year){
        var newList = [];
        // var reg = /\d/g
        var reg = /\d{4}-(((0[1-9])|(1[0-2])))(-((0[1-9])|([1-2][0-9])|(3[0-1])))?/
        this.list.forEach(item=>{
          //判断：
          //我们筛选出相应的年月
          if(this.moon)
          {
            if (this.formatDateTime(item.weekly_taskData).indexOf(year)!=-1&&reg.exec(this.formatDateTime(item.weekly_taskData))[1]==this.moon){
              newList.push(item);
            }
          }else{
            //我们筛选出相应的年
            if (this.formatDateTime(item.weekly_taskData).indexOf(year)!=-1){
              newList.push(item);
            }
          }
        });
        //把每一个月份的页数进行返回
        return newList;
      },
      del(id){
        // 1、post请求发送id
        // 2、重新获得消息列表
        let del = confirm("你确定要删除这条周报吗？")
        if(del){
          this.$axios.get('weekly_war/task/deleteTask.do?id='+id).then(result=>{
            result = result.data;
            console.log(result)
            if (result.code==2000){
              this.postInfo()
            } else{
              alert('删除失败')
            }
          })
        }

      },
      changePage(num){
        let curPage = this.page +num;
        if(curPage>0&&curPage<=this.totalPage){
          this.page=parseInt(this.page)+num;
        }else{
          alert('到尽头了哦~');
        }
      },
      postInfo(){
        let userId = {
          userId:window.localStorage.getItem('userId'),
        }
        //这里应该用局部请求头,而不是全局请求头
        this.$axios.post('weekly_war/task/getAllTasksByUserId.do',JSON.stringify(userId),{
          headers:{'Content-Type': 'application/json'}
        }).then(result => {
          var result = result.data;
          if (result.code == 2000) {
            //把获取到的全部信息存储到list中
            this.list = result.tasks;
            //页面的当前列表其实都是全部的信息。
            this.initial(this.search(this.curYear));
          } else {
            alert('获取失败')
          }
        });
      },
      click(num,e){
        var li = e.toElement;
        //重复点击取消
        if(li.className == 'moon'){
          li.className = '';
          this.moon = '';
        }else{
              if(this.beforeLi){
                this.beforeLi.className = '';
              }
              li.className = 'moon'
              this.moon = num;
              this.beforeLi= li;
          }
      },
      formatDateTime(timeStamp) {
        var date = new Date();
        if (timeStamp){
          date.setTime(timeStamp );
        } else {
          date.setTime(date)
        }
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
      },
      initial(nowList){
        this.page = 1;
        this.curList = nowList;
        this.sliceList = this.curList.slice((this.page-1)*this.pageSize,this.page*this.pageSize);
        this.totalPage = Math.ceil(nowList.length/this.pageSize);
      }
    },
    created(){
      //获取第一页的内容
      this.postInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
  /*查找年份*/
  #find #year{
    /*height: 38px;*/
    float: left;
    margin-right: 38px;
  }
  #find #month{
    display: inline-block;
  }
  #find #year>div{
    float: left;
    height: 100%;
  }
  /*包在select最外面的边框*/
  #find #year>div:nth-child(2){
    border: #000 2px solid;
    border-radius: 17px;
    width: 125px;
    height: 38px;
  }
  #find #year>div:first-child{
    margin-right: 20px;
  }
  /*隐藏select的箭头*/
  #find #year>div:nth-child(2)>div{
    width: 110px;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  #find #year img{
    position: absolute;
    top: 16px;
    left:90px;
  }
  #find select{
    /*设置的更宽，这样下拉箭头就会在盒子外面，被隐藏掉*/
    width: 115%;
    height: 100%;
    padding-left: 25px;
    font-size: 16px;
    color:#6e6e74;
    cursor: pointer;
  }
  /*查找月份*/
  #find #month{
    float: left;
    height: 38px;
    width: 800px;
  }
  #find #month>div:first-child{
    margin-right: 20px;
    /*line-height: 38px;*/
  }
  #find #month>div{
    line-height: 38px;
  }
  #find #month ul{
    float: right;
    margin-right: 80px;
  }
  #find #month ul li{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    line-height: 35px;
    border: 2px solid #000;
    float: left;
    text-align: center;
    margin-left: 18px;
    cursor: pointer;
    /*禁止文字被鼠标选中*/
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  #find #month ul li.moon{
    background-color: #686fbf;
    width: 39px;
    height: 39px;
    line-height: 39px;
    color: #fff;
    border: none;
  }
</style>
