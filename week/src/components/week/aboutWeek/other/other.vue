<template>
      <!--主要内容-->
      <div>
        <busy2
              width='65%'
              v-show="show"
        ></busy2>
        <div id="findPart" v-show="!show">
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
                  <router-link :to="{path:'/week/aboutWeek/other/quick/'+week(formatDateTime(item.weekly_taskData)),params:{userId:item.user_id,timeStamp:week(formatDateTime(item.weekly_taskData))==='lastWeek'?item.weekly_taskData:null}}" class="looking" >查看</router-link>
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
import {formatDateTime,getYearWeek} from '../../../../assets/common'
import {showPopError,showPopRight} from '../../../../../static/pop.js'
import dpage from '../../../dpage'
import busy2 from '../../../busy2'

  export default {
    name: 'other',
    data () {
      return {
        keywords:'',
        show:true
      }
    },
    methods:{
      formatDateTime(timeStamp){
        return formatDateTime(timeStamp);
      },
      getYearWeek(weekTime){
        return getYearWeek(weekTime)
      },
      week(time){
          time = new Date(time);
          let curWeek = getYearWeek(time)
          var now = getYearWeek(new Date());
          return curWeek===now?'thisWeek':'lastWeek';
        }
    } ,
    created(){
      var _this = this;
      setTimeout(function(){
              _this.show = false;
      },2000);
    },
    beforeRouteLeave(from,to,next){
      this.$store.dispatch('setPage',null)
      next();
    },
    components:{
      dpage,
      busy2
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 @import '../../../../assets/style/table.css'
</style>
