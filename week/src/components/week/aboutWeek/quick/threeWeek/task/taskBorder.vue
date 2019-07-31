<template>
   <div>
   <div class="time">
          <div class="number"
              :style="{
                color:color,
                border:'2px solid '+color
              }"
          >{{pi+1}}</div>
          <div class="quantum">
            <span v-if="type!=='next'">{{formatDateTime(pitem.weekly_taskData)}}</span>
            <span @click="writeAble" v-if="flag">
              <i 
                class="el-icon-edit"
                :style="{
                  color:color
                }"
              ></i>
            </span>           
            <img @click="deleteTask(pitem.weekly_id,$event)" v-if="flag" src="../../../../../../../static/1/close.png" alt="">
          </div>
    </div>
    <div class="task"
         :style="{
           borderColor:color
         }"
    >
      <!-- pitem.weekly_taskName是一个数组 -->
      <!-- 能不能提交的状态由笔和是不是新创建的同时决定，只要满足一个即可 -->
      <taskContent 
                  :pi="i"
                  :pitem="pitem"
                  :preadOnly="pitem.weekly_id?readOnly:null"
                  :ppostAble ="postAble||(type!=='last'&&!plist[pi].weekly_id)"
                  v-for="(item,i) in pitem.weekly_taskName" 
                  :key="i"
                  v-if="update"
                  :type="type"
                  :color="color"
                  :backgroundColor="backgroundColor"
                  :taskColor="taskColor"
      ></taskContent>
      <button class="poBtn"
              v-show="postAble||(type!=='last'&&!plist[pi].weekly_id)"
              @click="postTask($event)"
              :style="{
                backgroundColor:backgroundColor
              }" 
               >提交
      </button>
    </div>
  </div>
</template>
<script>
  import {formatDateTime} from '../../../../../../assets/common'
  import taskContent from './taskContent'
  import {showPopError,showPopRight} from '../../../../../../../static/pop.js'
  export default {
    name: "taskBorder",
    props:['plist','pi','pitem','flag','type','color','backgroundColor','taskColor'],
    data() {
      return {
          readOnly:'readOnly',
          postAble:false,
          update:true
      }
    },
    computed:{
      cpostAble:function(){
        if(this.type==='last'){
          return this.postAble;
        }else{
          return !this.plist[this.pi].weekly_id||this.postAble;
        }
      }
    },
    methods: {
      //把时间戳转换成日期
      writeAble(){
          this.readOnly = null;
          this.postAble = true;
      },
      changeReadOnly(val){
        console.log(val);
        this.readOnly = val;
      },
      deleteTask(id,event){
        let del = confirm("确定删除这条记录吗？")
         if(del){
          if(id){
              this.$axios.get('weekly_war/task/deleteTask.do?id='+id).then(result=>{
              result = result.data;
              console.log(result)
              if (result.code==2000){
                showPopRight('删除成功',this);
                //对之前得到的数据进行同步修改
                this.plist.splice(this.pi,1);
              } else{
                showPopError('删除失败',this);
              }
            })
          }else{
                this.plist.splice(this.pi,1);
                showPopRight('删除成功',this);
          }
        }
      },
      formatDateTime(timeStamp) {
        return formatDateTime(timeStamp)
      },
      postTask(e){
          // 当没有值的时候,这里用空字符串不行，只能用长度判断
          var flag = this.type==='next'?1:0;
          let button = e.toElement;
          console.log(this.pitem);
          let pitem = this.pitem;
            for(let item of pitem.weekly_taskName){
              if(item===null){
                    showPopError('任务名称不能为空',this);
                    return;       
              }
              console.log(item);
            }
             for(let item of pitem.weekly_content){
              if(item===null){
                    showPopError('任务内容不能为空',this);
                    return;     
              }
            }
            // console.log(pitem.weekly_taskName[0]);
            //判断一下weekly_id是否存在,如果weekly_id存在,进行修改操作,如果weekly_id不存在,进行添加操作。
            if(pitem.weekly_id!==undefined){
                //修改操作
                    console.log(pitem);
                    var url = 'weekly_war/task/updateTask.do?taskName='+JSON.stringify(pitem.weekly_taskName)+'&content='+JSON.stringify(pitem.weekly_content)+'&timeDegree='+JSON.stringify(pitem.weekly_completeDegree)+'&timeConsuming='+JSON.stringify(pitem.weekly_timeConsuming)+'&weekId='+pitem.weekly_id;
            }else{
                  console.log(pitem);
                  var url = 'weekly_war/task/addTask.do?taskDate='+pitem.weekly_taskData+'&taskName='+JSON.stringify(pitem.weekly_taskName)+'&content='+JSON.stringify(pitem.weekly_content)+'&timeDegree='+JSON.stringify(pitem.weekly_completeDegree)+'&timeConsuming='+JSON.stringify(pitem.weekly_timeConsuming)+'&flag='+flag;
            }
            this.$axios.get(url).then(res=>{
              console.log(res)
              var res = res.data;
              if (res.code==2000){
                showPopRight('提交成功',this);        
                if(res.weekly_id){
                  // this.plist[this.pi].weekly_id = res.weekly_id; 
                    Object.assign(this.plist[this.pi],{weekly_id:res.weekly_id});
                  }
                  this.postAble = false;
                  this.readOnly = 'readOnly';       
                  this.update = false
                  // 在组件移除后，重新渲染组件
                  // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
                  this.$nextTick(() => {
                      this.update = true
                  })
              } else if(res.code==1003){
                showPopError('参数为空',this);
              }else if(res.code===1004){
                showPopError('completeDegree格式出错',this);
              }else{
                showPopError('后端错误',this);
              }
            })
        }
    },
    components:{
        taskContent
    }
  }
</script>

<style scoped>
.detail .time{
    margin-left: 33px;
    height: 39px;
    display: flex;
    position: relative;
  }
  .time img{
    width: 30px;
    height: 30px;
    position: absolute;
    right: -95px;
    bottom: -100%;
    z-index: 1;
    cursor: pointer;
  }
  .detail .time .number{
    border-radius: 50%;
    height: 35px;
    width: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 23px;
    display:inline-block;
    cursor: default;
    position: -webkit-sticky;
    position: sticky;
    top:150px;
    flex-shrink: 0;
  }
  .detail .time .adding{
    cursor: pointer;
  }
  .time div{
    float: left;
  }
  .time .quantum{
    font-size: 16px;
    margin-left: 37px;
  }
  .detail .time span{
    margin-right: 22px;
    display: inline-block;
    margin-top: 18px;
  }
.task{
  position: relative;
  width: 100%;
}
button{
    position: absolute;
    right: -73px;
    bottom: 30px;
    height: 30px;
    width: 40px;
    color: #fff;
    border-radius: 0 7px 7px 0;
  }
  .task{
    margin-left: 50px;
    padding-top: 18px;
    padding-bottom: 18px;
    border-left: 2px solid #686fbf;
  }
  .detail:last-child .task{
    border-left: none;
  }
  .el-icon-edit{
    color: #686fbf;
    font-weight: bold;
    font-size: 23px;
    cursor: pointer;
  }
</style>
