<template>
          <ul class="taskTable"
              :style="{
                backgroundColor:taskColor
              }"
          >
            <li class="taskName">
              <div>任务名称</div>
              <textarea class="taskAbout"  maxlength="39" v-model="pitem.weekly_taskName[pi]" :readOnly="preadOnly" ref="task"></textarea>
            </li>
            <li class="taskContent">
              <div>任务内容</div>
              <textarea class="taskAbout"  maxlength="1023" v-model="pitem.weekly_content[pi]" :readOnly="preadOnly" ></textarea>
            </li>
            <li class="taskSchedule" v-if="type!=='next'">
              <div>完成度</div>
              <textarea class="taskAbout"  maxlength="3" v-model="pitem.weekly_completeDegree[pi]" :readOnly="preadOnly" onkeyup="this.value=this.value.replace(/[^\r\n0-9]/g,'' );" placeholder="只能填0-100之间的数字" ></textarea>
            </li>
            <li class="taskTime" v-if="type!=='next'">
              <div>用时</div>
              <textarea class="taskAbout"  maxlength="39" v-model="pitem.weekly_timeConsuming[pi]" :readOnly="preadOnly" ></textarea>
            </li>
            <button 
                  class="deBtn"
                  v-show="ppostAble"
                  @click="deleteMessage()"
                  :style="{
                    backgroundColor:backgroundColor
                  }"
            >减少</button>
            <button 
                  class="adBtn"
                  v-show="ppostAble"
                  @click="addMessage()"
                  :style="{
                      backgroundColor:backgroundColor
                  }"
            >添加</button>
          </ul>
</template>

<script>
  import {showPopError,showPopRight} from '../../../../../../../static/pop.js'
  export default {
    name: "taskContent",
    props:['pi','pitem','preadOnly','ppostAble','type','color','backgroundColor','taskColor'],
    data() {
      return {
      }
    },
    watch:{
        //当可以写的时候自动聚焦
        'preadOnly':function(newValue,oldValue){
        //ref可以标记的是组件中唯一的元素，而id标记的是全局中唯一的元素
          this.$refs.task.focus();
        }
    },
    methods: {
        deleteMessage(){
          if(this.pitem.weekly_taskName.length<=1){
            showPopError("不能再减了哦~试试直接删除",this);
            return;
          }
          for(let item in this.pitem){
            this.pitem[item] instanceof Array?this.pitem[item].splice(this.pi,1):null;
          }
        },
        addMessage(){
          for(let item in this.pitem){
            this.pitem[item] instanceof Array?this.pitem[item].splice(this.pi+1,0,null):null;
          }
        }
  }
  }
</script>

<style scoped>
  .task .taskTable{
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    color: #6e6e74;
    background-color: #f7f7f9;
    margin-left: 33px;
    width: 100%;
    /* height:200px ; */
    justify-content: space-around;
  }
  .task .taskTable:first-child{
    border-radius: 7px 7px 0 0;
  }
  .task .taskTable:nth-last-child(2){
    border-radius: 0 0 7px 7px;
    padding-bottom: 38px;
  }
  .task .taskTable li{
    margin-left: 3%;
  }
  .task .taskTable:first-child li div{
    margin-top: 38px;
  }
  .task .taskTable li div{
    margin-left: -7px;
    letter-spacing: 2px;
    font-size: 16px;
  }
  .task .taskTable li.taskName{
        flex-grow: 1.5;
  }
    .task .taskTable li.taskContent{
        flex-grow: 4;
  }
    .task .taskTable li.taskSchedule{
        flex-grow: 1.5;
  }
    .task .taskTable li.taskTime{
        flex-grow: 1.5;
  }
  .task .taskTable li .taskAbout{
    margin-top: 2px;
    background-color: #fff;
    border-radius: 7px;
    height: 100px;
    color: #000;
    padding: 10px 20px;
    width: 90%;
    letter-spacing: 2px;
    font-size: 14px;
  }
button{
    position: absolute;
    right: -40px;
    bottom: 90px;
    height: 30px;
    width: 40px;
    color: #fff;
    border-radius: 0 7px 7px 0;
}
.adBtn{
  bottom: 50px;
}
</style>
