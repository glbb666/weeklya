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
          <router-view :plastTask="lastTask" :pthisTask="thisTask" :pthisPlan="thisPlan" :pnextPlan="nextPlan" id="weekBox" :flag="flag" ></router-view>
    </div>
</template>

<script>
import {showPopError} from '../../../../../static/pop.js'
import {showPopRight} from '../../../../../static/pop.js'
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
        flag:true
      }
    },
    methods: {
       getInfo() {
        this.$axios.get('weekly_war/task/getTasks.do?id='+this.userId).then(result => {
          // console.log(result)
          result = result.data
          console.log(result);
          if (result.success) {
            this.lastTask = result.lastTask;
            this.thisTask = result.thisTask;
            this.thisPlan = result.thisPlan;
            this.nextPlan = result.nextTask;
            this.init(this.lastTask);
            this.init(this.thisTask);
            this.init(this.thisPlan);
            this.init(this.nextPlan);
            // console.log(this.lastTask);
            // console.log(this.thisTask);
            // console.log(this.nextPlan);
            // alert(JSON.stringify(this.list));
            // alert('请求数据成功')
          } else {
            showPopError('请求数据失败',this)
            // this.$router.replace('/login');
          }
        });
      },
      init(week){
        for(let i = 0;i<week.length;i++){
          week[i].weekly_completeDegree = JSON.parse(week[i].weekly_completeDegree);
          week[i].weekly_content = JSON.parse(week[i].weekly_content);
          week[i].weekly_taskName = JSON.parse(week[i].weekly_taskName);
          week[i].weekly_timeConsuming = JSON.parse(week[i].weekly_timeConsuming);
        }
      }
    }
  ,
    created(){
      if(this.$route.query.userId){
          this.userId = this.$route.query.userId;
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
    color: #fcaf17;
  }
</style>
