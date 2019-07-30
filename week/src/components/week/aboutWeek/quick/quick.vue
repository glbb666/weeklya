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
              width='75%'
              v-if="show"
        ></busy2>
        <router-view :plastTask="lastTask" :pthisTask="thisTask" :pthisPlan="thisPlan" :pnextPlan="nextPlan" id="weekBox" :flag="flag"    v-if="!show"
></router-view>     
    </div>
</template>

<script>
import {showPopError,showPopRight} from '../../../../../static/pop.js'
  import busy2 from '../../../busy2'

  export default {
    name: 'quick',
    data() {
      return {
        add: false,//默认不显示
        time:'',
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
            this.lastTask = result.lastTask;
            this.thisTask = result.thisTask;
            this.thisPlan = result.thisPlan;
            this.nextPlan = result.nextTask;
            this.init([this.lastTask,this.thisTask,this.thisPlan,this.nextPlan]);
          } else {
            showPopError('请求数据失败',this)
          }
        });
      },
      init(week){
        console.log(week);
        for(let i = 0;i<week.length;i++){
            for(let j = 0;j<week[i].length;j++){
              week[i][j].weekly_completeDegree = JSON.parse(week[i][j].weekly_completeDegree);
              week[i][j].weekly_content = JSON.parse(week[i][j].weekly_content);
              week[i][j].weekly_taskName = JSON.parse(week[i][j].weekly_taskName);
              week[i][j].weekly_timeConsuming = JSON.parse(week[i][j].weekly_timeConsuming);
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
