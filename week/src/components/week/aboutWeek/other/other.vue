<template>
      <!--主要内容-->
      <div>
        <div id="findPart">
          <label id="find">
            <input type="text" placeholder="按姓名查找" v-model="keywords">
            <img src="../../../../../static/2/find.png" alt="">
          </label>
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
                <!--此处不能用user_id,否则会报错-->
              <tr v-for="item in search(keywords)" :key="item.weekly_id">
                <td>{{item.user_learningDirection}}</td>
                <td>{{item.user_name}}</td>
                <td>{{formatDateTime(item.weekly_taskData)}}</td>
                <td>
                  <router-link :to="{path:'/week/aboutWeek/other/quick/thisWeek',query:{userId:item.user_id}}" class="looking" :userId="123">查看</router-link>
                </td>
              </tr>
              </tbody>
            </table>
            <ul id="findPage">
            <li @click="page=1">第一页</li>
            <li @click="changePage(-1,true)" ref="pre">上一页</li>
            <!-- <li>当前第&nbsp;{{page}}&nbsp;页</li> -->
            <li v-for="item in pageList" @click="page=item" :ref="item">{{item}}</li>
            <li @click="changePage(1,true)" ref="next">下一页</li>
            <li @click="page=totalPage">最末页</li>
          </ul>
          </div>
        </div>
    </div>
</template>

<script>
import {showPopError} from '../../../../../static/pop.js'
import {showPopRight} from '../../../../../static/pop.js'
  export default {
    name: 'other',
    data () {
      return {
        keywords:'',
        list:[],
        page:1,
        totalPage:0,
        pageList: null,
        preLi:null
      }
    },
    watch:{
      'page':function(){
          this.getInfo();       
      }
    },
    methods:{
      getInfo(){
        let msg = {
          "totalPage":this.totalPage,
          "pageParams":{
            "page":this.page,
            "pageSize":7
          }
        };
        this.$axios.post('weekly_war/task/getAllTasksByUserId.do',JSON.stringify(msg),{
          headers:{'Content-Type': 'application/json'}
        }).then(result => {
          var result = result.data;
          if (result.success) {
            //把获取到的全部信息存储到list中
            this.list = result.tasks;
            result.totalPage?this.totalPage = result.totalPage:null;
            this.setPageList(5);
            this.checkPage();
          } else {
            showPopError(result.msg,this)
          }
        });
      },
      search:function(keywords){
        var newList = [];
        // var newList = this.list
        this.list.forEach(item=>{
          if (item["user_name"].indexOf(keywords)!=-1){
            newList.push(item);
          }
        });
        return newList;
      },
      changePage(num){
        var result = this.page + num;
        if(result>this.totalPage||result<=0){
          return;
        }
        this.page+=num;
        this.getInfo();
      },
      //把时间戳转换成日期
      formatDateTime(timeStamp) {
        var date = new Date();
        date.setTime(timeStamp );
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        // var h = date.getHours();
        // h = h < 10 ? ('0' + h) : h;
        // var minute = date.getMinutes();
        // var second = date.getSeconds();
        // minute = minute < 10 ? ('0' + minute) : minute;
        // second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d;
     },
     //分页
     setPageList(liSize){
       //liSize代表每页有多少个
       this.pageList = [];
       for(let i = this.page;i<=this.totalPage&&i<=liSize+this.page-1;i++){
         this.pageList.push(i);
       }
       var beforeLi = liSize-this.pageList.length;
       for(let i = this.page-1;i>=1&&i>=this.page-beforeLi;i--){
         this.pageList.unshift(i);
       }
     },
     checkPage(){
       this.$nextTick(function(){
            if(this.preLi){
              this.preLi.classList.remove('select');
            }
            if(this.$refs[this.page]){
               this.$refs[this.page][0].classList.add('select');
              this.preLi =  this.$refs[this.page][0];
            }  
       })
        if(this.page === 1){
            this.$refs['pre'].classList.add('unClick');
        }else{
            this.$refs['pre'].classList.remove('unClick');
        }
        if(this.page===this.totalPage){
            this.$refs['next'].classList.add('unClick');
        }else{
            this.$refs['next'].classList.remove('unClick');
        }
     },
    
    },
    created(){
      this.getInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*查找部分*/
  #findPart{
    margin-top: 13px;
    margin-left: 68px;
  }
   /*查找姓名*/
  #find{
    position: relative;
    height: 42px;
    line-height: 42px;
  }
  #find input{
    width: 200px;
    height: 45px;
    border: #000 2px solid;
    border-radius: 17px;
    padding-left: 30px;
    line-height: 45px;
    font-size: 16px;
  }
  #find img{
    position: absolute;
    right: 20px;
    top: 0px;
  }
  /* 查找到的内容 */
  #findContain{
    padding-top: 22px;
    width: 80%;
  }
  #findContain input{
    font-size: 18px;
    width: 100%;
  }
  /* 设置表格样式 */
  #findContain table{
    /*border-collapse:collapse和border-radius不兼容，通过以下两行代码达到collapse的效果*/
    border-collapse:separate;
    border-spacing: 0;
    width: 100%;
    font-weight: 500;
  }
  thead tr{
    background-color: #f7f7f9;
    /*设置背景*/
    height: 50px;
    line-height: 50px;
    text-align: center;
    letter-spacing: 2px;
  }
  thead tr th{
    font-weight: 500;
  }
  /*设置表格的圆角边框*/
   thead tr th:first-child{
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
  }
  thead tr th:last-child{
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
  }
  /* 设置鼠标经过动画 */
  tbody tr  {
    transition: all .3s;
  }
  tbody tr:hover{
    background-color:rgba(104,111,191, .2);
  }
  tbody tr:hover a{
    background-color:#686fbf;
    color: #fff;
  }
  tbody tr td {
    text-align: center;
    padding-top: 27px;
    padding-bottom: 27px;
    letter-spacing: 1px;
  }
  tbody tr td{
    position: relative;
  }
  a{
    background-color:#e5e5e6;
    display: block;
    width: 72px;
    height: 36px;
    line-height: 36px;
    border-radius: 17px;
    text-align: center;
  }
  #findPage{
    margin-top: 5%;
    width:100%;
    display: flex;
    text-align: center;
    justify-content: center;
  }
  #findPage li{    
    margin-right: 20px;
    cursor: pointer;
    border:1px solid rgb(221, 221, 221);
    color: #686fbf;
    padding: 10px;
  }
  #findPage li:hover{
    background-color: rgb(238, 238, 238);
    color: rgb(9, 95, 138);
  }
  #findPage .unClick{
    color: #777;
    cursor:not-allowed;
  }
  #findPage .unClick:hover{
    color:#777;
  }
  #findPage .select{
    color: #fff;
    background-color: #686fbf;
  }
  #findPage .select:hover{
    color: #fff;
    background-color: #686fbf;
  }
</style>
