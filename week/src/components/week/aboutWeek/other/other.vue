<template>
      <!--主要内容-->
      <div>
        <div id="findPart">
          <div id="findContain">
            <table>
              <thead>
              <tr>
                <th>所属组别</th>
                <th>姓名</th>
                <th>同步时间</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
                <!--此处不能用user_id,否则会报错-->
              <tr v-for="item in this.$store.state.pageList" :key="item.weekly_id">
                <td>{{item.user_learningDirection}}</td>
                <td>{{item.user_name}}</td>
                <td>{{formatDateTime(item.weekly_taskData)}}</td>
                <td>
                  <router-link :to="{path:'/week/aboutWeek/other/quick/thisWeek',query:{userId:item.user_id}}" class="looking" :userId="123">查看</router-link>
                </td>
              </tr>
              </tbody>
            </table>
            <dpage 
              url='weekly_war/task/getAllTasksByUserId.do'
              pageSize=7
              type='task'
            ></dpage>
          </div>
        </div>
    </div>
</template>

<script>
import {formatDateTime} from '../../../../assets/common'
import {showPopError} from '../../../../../static/pop.js'
import {showPopRight} from '../../../../../static/pop.js'
import dpage from '../../../dpage'
  export default {
    name: 'other',
    data () {
      return {
        keywords:'',
      }
    },
    
    methods:{
      formatDateTime(timeStamp){
        return formatDateTime(timeStamp);
      } 
    },
    components:{
      dpage
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*查找部分*/
  #findPart{
    margin-top: 13px;
    margin-left: 68px;
  }
   /*查找姓名*/
  #find{
    position: relative;
    height: 42px;
    line-height: 42px;
  }
  #find input{
    width: 200px;
    height: 45px;
    border: #000 2px solid;
    border-radius: 17px;
    padding-left: 30px;
    line-height: 45px;
    font-size: 16px;
  }
  #find img{
    position: absolute;
    right: 20px;
    top: 0px;
  }
  /* 查找到的内容 */
  #findContain{
    padding-top: 22px;
    width: 80%;
  }
  #findContain input{
    font-size: 18px;
    width: 100%;
  }
  /* 设置表格样式 */
  #findContain table{
    /*border-collapse:collapse和border-radius不兼容，通过以下两行代码达到collapse的效果*/
    border-collapse:separate;
    border-spacing: 0;
    width: 100%;
    font-weight: 500;
  }
  thead tr{
    background-color: #f7f7f9;
    /*设置背景*/
    height: 50px;
    line-height: 50px;
    text-align: center;
    letter-spacing: 2px;
  }
  thead tr th{
    font-weight: 500;
  }
  /*设置表格的圆角边框*/
   thead tr th:first-child{
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
  }
  thead tr th:last-child{
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
  }
  /* 设置鼠标经过动画 */
  tbody tr  {
    transition: all .3s;
  }
  tbody tr:hover{
    background-color:rgba(104,111,191, .1);
  }
  tbody tr:hover a{
    background-color:#686fbf;
    color: #fff;
  }
  tbody tr td {
    text-align: center;
    padding-top: 27px;
    padding-bottom: 27px;
    letter-spacing: 1px;
  }
  tbody tr td{
    position: relative;
  }
  a{
    background-color:#e5e5e6;
    display: block;
    width: 72px;
    height: 36px;
    line-height: 36px;
    border-radius: 17px;
    text-align: center;
  }
  
</style>
