<template>
  <div>
    <div>
      <div class="detail" v-if="flag">
        <div class="time">
          <div class="number adding" @click="addTask">+</div>
        </div>
      </div>
      <div class="detail" v-for="(item,i) in pnextPlan" :key="i">
          <taskBorder :pi="i"
                      :pitem="item"
                      :plist="pnextPlan"
                      :flag="flag"
                      :key="item.weekly_taskData"
                      type="next"
                      color="#686fbf"
                      backgroundColor="#3240dd"
                      taskColor="#f7f7f9"
             ></taskBorder>
      </div>
    </div>
    <empty :plist="pnextPlan"
            backgroundColor='#f7f7f9'
            words='快去填写计划八~'
            width='75%'
    ></empty>
  </div>

</template>

<script>
  import taskBorder from './task/taskBorder'
  import empty from '../../../../empty'

  export default {
    name: "nextWeek",
    inheritAttrs:false,
    props:['pnextPlan','flag'],
    data() {
      return {
      }
    },
    methods: {
      oneWeekAfter(){
        var date =  new Date();
        date.setDate(date.getDate()+7);
        return date.setTime(date);
      },
      addTask(){
        console.log(this.pnextPlan);
        this.pnextPlan.unshift({
          weekly_taskName:[null],
          weekly_completeDegree:[null],
          weekly_content:[null],
          weekly_timeConsuming:[null],
          weekly_taskData:this.oneWeekAfter()
        });
      },
      
    }
    ,
    components:{
      taskBorder,
      empty
    }
  }
</script>

<style scoped>
.detail{
  width: 70%;
}
.detail .time{
    margin-left: 33px;
    height: 39px;
  }
   .detail .time .number{
    border-radius: 50%;
    height: 35px;
    width: 35px;
    border: #686fbf 2px solid;
    line-height: 35px;
    text-align: center;
    font-size: 23px;
    color: #686fbf;
    display:inline-block;
    cursor: default;
  }
  .detail .time .adding{
    cursor: pointer;
  }
  .time div{
    float: left;
  }
 #empty{
  width: 80%;
  margin:10px 33px;
  border-radius: 7px;
  padding: 10px;
}
</style>
