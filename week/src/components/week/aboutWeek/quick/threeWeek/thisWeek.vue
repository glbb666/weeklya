<template>
  <div>
    <div>
      <div class="detail" v-if="flag">
        <div class="time">
          <div class="number adding" @click="addTask">+</div>
        </div>
      </div>
      <div class="detail" v-for="(item,i) in pthisTask" :key="i">
          <taskBorder :pi="i"
                      :pitem="item"
                      :plist="pthisTask" 
                      :flag="flag"
                      :key="item.weekly_taskData"
                      type='this'
                      color="#686fbf"
                      backgroundColor="#3240dd"
                      taskColor="#f7f7f9"
          ></taskBorder>
      </div>
    </div>
    <planBox :pthisPlan="pthisPlan"
    ></planBox>
   
    <empty :plist="pthisTask"
            words='快去填写周报八~'
            backgroundColor='#f7f7f9'
            width='65%'
    ></empty>
  </div>

</template>

<script>
  import taskBorder from './task/taskBorder'  
  import planBox from './plan/planBox'
  import empty from '../../../../empty'

  export default {
    name: "thisWeek",
    inheritAttrs:false,
    props:['pthisTask','flag','pthisPlan'],
    data() {
      return {
      }
    },
    watch:{
      'pthisTask':function(){
        if(this.pthisTask.length===0){
          this.$emit('func',null);
        }
      }
    },
    methods: {
      addTask(){
        this.pthisTask.unshift({
          weekly_taskName:[null],
          weekly_completeDegree:[null],
          weekly_content:[null],
          weekly_timeConsuming:[null],
          weekly_taskData:new Date().getTime()
        });
      },  
    }
    ,
    created(){

    }
    ,
    components:{
      taskBorder,
      planBox,
      empty
    }
  }
</script>

<style scoped>
  .detail{
    width: 60%;
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
