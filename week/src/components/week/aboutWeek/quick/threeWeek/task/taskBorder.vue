<template>
   <div>
   <div class="time">
          <div class="number">{{pi+1}}</div>
          <div class="quantum">
            <span>{{formatDateTime(pitem.weekly_taskData)}}</span>
            <span @click="writeAble" v-if="flag"><i class="el-icon-edit"></i>
</span>           
            <img @click="deleteTask(pitem.weekly_id,$event)" v-if="flag" src="../../../../../../../static/1/close.png" alt="">
          </div>
    </div>
    <div class="task">
      <!-- pitem.weekly_taskName是一个数组 -->
      <taskContent :pi="i" :pitem="pitem" :preadOnly="readOnly" :ppostAble ="postAble" @update="changeReadOnly()" v-for="(item,i) in pitem.weekly_taskName" :key="i"></taskContent>
      <button class="poBtn" v-if="postAble" @click="postTask($event)">提交</button>
    </div>
  </div>
</template>
<script>
  import {formatDateTime} from '../../../../../../assets/common'
  import taskContent from './taskContent'
  import {showPopError,showPopRight} from '../../../../../../../static/pop.js'
  export default {
    name: "taskBorder",
    props:['plist','pi','pitem','flag'],
    watch:{
      'plist':function(){
          console.log('add');
          if(!this.plist[this.pi].weekly_id){
            this.writeAble();
        }
      }
    },
    data() {
      return {
          readOnly:'readOnly',
          postAble:false
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
         let del = confirm("你确定要删除这条周报吗？")
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
          let button = e.toElement;
          console.log(this.pitem);
          let pitem = this.pitem;
          // if(pitem.weekly_taskName.length===0){
          //   alert('任务名称为必填项目')
          // }else if(pitem.weekly_completeDegree.length!==0&&(isNaN(pitem.weekly_completeDegree)||pitem.weekly_completeDegree<0||pitem.weekly_completeDegree>100)){
          //   // 有值，但是值不准确
          //   alert('完成度必须是一个0到100之间的数字')
          // }else{
            //判断一下weekly_id是否存在,如果weekly_id存在,进行修改操作,如果weekly_id不存在,进行添加操作。
            // console.log(pitem.weekly_taskData)
            if(pitem.weekly_id!==undefined){
                //修改操作
                    console.log(pitem);
                    var url = 'weekly_war/task/updateTask.do?taskName='+JSON.stringify(pitem.weekly_taskName)+'&content='+JSON.stringify(pitem.weekly_content)+'&timeDegree='+JSON.stringify(pitem.weekly_completeDegree)+'&timeConsuming='+JSON.stringify(pitem.weekly_timeConsuming)+'&weekId='+pitem.weekly_id;
            }else{
                  console.log(pitem);
                  var url = 'weekly_war/task/addTask.do?taskDate='+pitem.weekly_taskData+'&taskName='+JSON.stringify(pitem.weekly_taskName)+'&content='+JSON.stringify(pitem.weekly_content)+'&timeDegree='+JSON.stringify(pitem.weekly_completeDegree)+'&timeConsuming='+JSON.stringify(pitem.weekly_timeConsuming)+'&flag=0';
            }
            this.$axios.get(url).then(res=>{
              console.log(res)
              var res = res.data;
              if (res.code==2000){
                showPopRight('提交成功',this);
                this.postAble = false;
                this.readOnly = 'readOnly';
                if(res.weekly_id){
                   this.plist[this.pi].weekly_id = res.weekly_id;
                }
              } else if(res.code==1003){
                showPopError('参数为空',this);
              }else if(res.code===1004){
                showPopError('completeDegree格式出错',this);
              }else{
                showPopError('后端错误',this);
              }
            })
        }
    }
    ,
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
    border: #686fbf 2px solid;
    line-height: 35px;
    text-align: center;
    font-size: 23px;
    color: #686fbf;
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
    background: #3240dd;
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
