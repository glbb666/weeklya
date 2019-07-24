<template>
  <div>
    <div>
      <div class="detail" v-if="flag">
        <div class="time">
          <div class="number adding" @click="addTask">+</div>
        </div>
      </div>
      <div class="detail" v-for="(item,i) in pnextPlan" :key="i">
          <planBorder :pi="i" :pitem="item" :plist="pnextPlan" :flag="flag"></planBorder>
      </div>
    </div>
    <empty :plist="pnextPlan"></empty>
  </div>

</template>

<script>
  import planBorder from './plan/planBorder'
  import empty from '../../../../empty'

  export default {
    name: "nextWeek",
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
      planBorder,
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
    border: #fcaf17 2px solid;
    line-height: 35px;
    text-align: center;
    font-size: 23px;
    color: #fcaf17;
    display:inline-block;
    cursor: default;
  }
  .detail .time .adding{
    cursor: pointer;
  }
  .time div{
    float: left;
  }
 
</style>
