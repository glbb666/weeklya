<template>
          <ul class="taskTable" >
            <li class="taskName">
              <div>任务名称</div>
              <textarea class="taskAbout"  maxlength="39" v-model="pitem.weekly_taskName[pi]" :readOnly="preadOnly" ref="task"></textarea>
            </li>
            <li class="taskContent">
              <div>任务内容</div>
              <textarea class="taskAbout"  maxlength="1023" v-model="pitem.weekly_content[pi]" :readOnly="preadOnly" ></textarea>
            </li>
            <button class="deBtn" v-if="ppostAble" @click="deleteMessage()">减少</button>
            <button class="adBtn" v-if="ppostAble" @click="addMessage()">添加</button>
          </ul>
</template>

<script>
  import {showPopError} from '../../../../../../../static/pop.js'
  import {showPopRight} from '../../../../../../../static/pop.js'
  export default {
    name: "planContent",
    props:['pi','pitem','preadOnly','ppostAble'],
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
        changeWriteAble(){
          //子组件往父组件中传值，因为子组件不能直接修改父组件的属性
          this.$emit('update','readOnly');
        },
        deleteMessage(){
          if(this.pitem.weekly_taskName.length<=1){
            showPopError("不能再减了哦~试试直接删除",this);
            return;
          }
          let pi = this.pi;
          this.pitem.weekly_taskName.splice(pi,1);
          this.pitem.weekly_content.splice(pi,1);
          this.pitem.weekly_completeDegree.splice(pi,1);
          this.pitem.weekly_timeConsuming.splice(pi,1);
        },
        addMessage(){
          let pi = this.pi;
          this.pitem.weekly_taskName.splice(pi+1,0,null);
          this.pitem.weekly_content.splice(pi+1,0,null);
          this.pitem.weekly_completeDegree.splice(pi+1,0,null);
          this.pitem.weekly_timeConsuming.splice(pi+1,0,null);
        }
  }
  }
</script>

<style scoped>
  .taskTable{
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    color: #6e6e74;
    background-color: rgba(255,215,0,.2);
    margin-left: 33px;
    border-radius: 7px;
    width: 100%;
    height:200px ;
    justify-content: space-around;
  }
  .taskTable li div{
    margin-top: 38px;
    margin-left: -7px;
  }
  .task .taskTable li.taskName{
    width: 30%;
  }
    .task .taskTable li.taskContent{
    width: 60%;
  }
  .task .taskTable li .taskAbout{
    margin-top: 2px;
    background-color: #fff;
    border-radius: 7px;
    height: 100px;
    color: #000;
    padding: 10px 20px;
    width: 95%;
  }
button{
    position: absolute;
    right: -40px;
    bottom: 90px;
    height: 30px;
    width: 40px;
    color: #fff;
    border-radius: 0 7px 7px 0;
    background: #fcaf17;
}
.adBtn{
  bottom: 50px;
}
</style>
