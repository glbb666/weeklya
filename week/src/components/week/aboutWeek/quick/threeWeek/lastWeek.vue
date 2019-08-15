<template>
    <div>
      <selectWeek 
       v-on:func="show"
        :pyear=year
        :pmoon=moon
        :userId=userId
      ></selectWeek>
      <div>
      <taskBorder :pi="i"
                  :pitem="item" 
                  :plist="list" 
                  class="detail" 
                  v-for="(item,i) in list||plastTask" 
                  :key="item.weekly_taskData"
                  :flag="flag"
                  type='last'
                  color="#686fbf"
                  backgroundColor="#3240dd"
                  taskColor="#f7f7f9"
      ></taskBorder>
      </div>
      <empty :plist="list||plastTask"
              backgroundColor='#f7f7f9'
              words='快去填写周报八~'
              width='75%'
      ></empty>
    </div>
</template>

<script>
  import taskBorder from './task/taskBorder'
  import selectWeek from './selectWeek/selectWeek'
  import empty from '../../../../empty'
  import {formatDateTime} from '../../../../../assets/common'
  export default {
    name: "lastWeek",
    inheritAttrs:false,
    props:['plastTask','flag','userId','timeStamp'],
    data() {
      return {
        list:null,
        year:null,
        moon:null
      }
    },
    methods: {
      show(week){
        for(let i = 0;i<week.length;i++){
          for(let item in week[i]){
            typeof week[i][item] === 'string'?week[i][item] = JSON.parse(week[i][item]):null;
          }
        }
        this.list = week;
      }
    },
    components:{
      taskBorder,
      selectWeek,
      empty,
    },
    created(){
        //检测是不是从他人页面跳转的,如果是的话,就会带有时间戳
        // console.log(this.userId);
        let time = this.timeStamp?formatDateTime(this.timeStamp):formatDateTime();
        let arr = time.split('-');
        this.year = parseInt(arr[0]);
        this.moon = parseInt(arr[1]);
    }
  }
</script>

<style scoped>
.detail{
    width: 75%;
}
#busy{
   width:1000px;
   height: 200px;
}
#empty{
  width: 80%;
  margin:10px 33px;
  border-radius: 7px;
  padding: 10px;
}
</style>
