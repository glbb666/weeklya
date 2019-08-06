<template>
    <div>  
      <!--主要内容-->
        <div id="week">
          <router-link to='lastWeek'>以往周报</router-link>
          <img src="../../../../../static/2/point.png" alt="">
          <router-link to='thisWeek'>本周周报</router-link>
          <img src="../../../../../static/2/point.png" alt="">
          <router-link to='nextWeek'>下周计划</router-link>
        </div>
        <busy2
              width='65%'
              v-show="show"
        ></busy2>
        <router-view :plastTask="lastTask" :pthisTask="thisTask" :pthisPlan="thisPlan" :pnextPlan="nextPlan" id="weekBox" :flag="flag"  v-show="!show" :userId="userId"
        :timeStamp="timeStamp"
        ></router-view>     
    </div>
</template>
<script>
import {showPopError,showPopRight} from '../../../../../static/pop.js'
import busy2 from '../../../busy2'
import {exit} from '../../../../assets/common'  

  export default {
    name: 'quick',
    data() {
      return {
        add: false,//默认不显示
        lastTask:'',
        thisTask:'',
        thisPlan:'',
        nextPlan:'',
        userId:null,
        timeStamp:null,
        flag:true,
        show:true
      }
    },
    components:{
      busy2
    },
    methods: {
       getInfo() {
        this.$axios.get('weekly_war/task/getTasks.do?id='+this.userId+"&timeStamp="+this.timeStamp).then(result => {
          result = result.data
          console.log(result);
          if (result.success) {
            var _this = this;
            setTimeout(function(){
              _this.show = false;
            },1000);
            let {lastTask='',thisTask='',thisPlan='',nextPlan=''} = result;
            Object.assign(this,{lastTask,thisTask,thisPlan,nextPlan})
            this.init([this.lastTask,this.thisTask,this.thisPlan,this.nextPlan]);
          } else {
            if(result.code===1000){
              showPopError('未登录',this);
              exit();
              return;
            }
            showPopError('请求数据失败',this)
          }
        });
      },
      init(week){
        console.log(week);
        for(let i = 0;i<week.length;i++){
            for(let j = 0;j<week[i].length;j++){
              for(let item in week[i][j]){
                let test =/^\[.+\]$/;
                if(test.test(week[i][j][item])){
                    week[i][j][item] = JSON.parse( week[i][j][item]);
                }
              }
          }
        }
      }
    }
  ,
    created(){
      //是判断从哪里来的,如果是从他人来的话flag就是false
      if(this.$route.query.userId){
          this.userId = this.$route.query.userId;
          this.timeStamp = this.$route.query.timeStamp;
          this.flag = false;
      }
      this.getInfo();
    }
    ,
    beforeRouteLeave(to,from,next){
      //如果是跳回快捷页面
      if(to.path==="/week/aboutWeek/quick/thisWeek"){
        this.userId = null;
        this.flag = true;
        this.getInfo();
      }
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
#week{
    padding-left: 0px;
    margin-left: -10px;
  }
#week a{
    color: #6e6e74;
  }
  #week{
    padding-left: 30px;
    height: 37px;
    color:#6e6e74;
  }
  #week a,#week img{
    float: left;
    font-size: 18px;
    color: #6e6e74;
  }
  #week div{
    cursor: pointer;
  }
  #week img{
    margin: 10px 10px 0 10px;
  }
  #week .router-link-active{
    color: #686fbf;
  }
  #week a:last-child.router-link-active{
    color: #3385ff;
  }
</style>
