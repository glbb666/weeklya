<template>
    <div>
      <selectWeek v-on:func="show"
      ></selectWeek>
      <div>
          <taskBorder :pi="i" :pitem="item" :plist="list" class="detail" v-for="(item,i) in list||plastTask" :key="i" :flag="flag"></taskBorder>
      </div>
      <empty :plist="list||plastTask"
              backgroundColor='#f7f7f9'
              words='周报'
      ></empty>
    </div>
</template>

<script>
  import taskBorder from './task/taskBorder'
  import selectWeek from './selectWeek/selectWeek'
  import empty from '../../../../empty'

  export default {
    name: "lastWeek",
    props:['plastTask','flag'],
    data() {
      return {
        list:null
      }
    },
    methods: {
      show(week){
        for(let i = 0;i<week.length;i++){
          week[i].weekly_completeDegree = JSON.parse(week[i].weekly_completeDegree);
          week[i].weekly_content = JSON.parse(week[i].weekly_content);
          week[i].weekly_taskName = JSON.parse(week[i].weekly_taskName);
          week[i].weekly_timeConsuming = JSON.parse(week[i].weekly_timeConsuming);
        }
        this.list = week;
      }
    },
    components:{
      taskBorder,
      selectWeek,
      empty
    }
  }
</script>

<style scoped>
.detail{
    width: 75%;
  }
#empty{
  width: 80%;
  margin:10px 33px;
  border-radius: 7px;
  padding: 10px;
}
</style>
