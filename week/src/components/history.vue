<template>
  <div id="findContain">
    <table>
      <thead>
      <tr>
        <th>所属组别</th>
        <th>发件人</th>
        <th>发件时间</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in list" :key="item.id">
        <td>{{item.group}}</td>
        <td>{{item.userName}}</td>
        <td>{{formatDateTime(item.meetingDate)}}</td>
        <td>
          <router-link :to="{path:'/week/note/history/meeting',query:{content:item.content,id:item.id,complete:item.complete}}" >查看</router-link>
          <a href="" @click.prevent="delInfo(item.id)">删除</a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import qs from 'qs'
  // Vue.prototype.$qs = qs
  export default {
    name: 'history',
    data () {
      return {
        list:[]
      }
    },
    methods:{
      getInfo(){
        this.$axios.get('weekly_war/meeting/getMeetings.do').then(res => {
          console.log(res)
          res=res.data
          if(res.code==2000){
            // alert('查询成功')
            this.list = res.meetings;
          }else{
            alert('查询失败')
          }
        });
      },
      delInfo(id){
        console.log(id)
        var del = confirm("你确定要删除这条会议记录吗？")
        if(del){
          this.$axios.get('weekly_war/meeting/deleteMeeting.do?id='+id).then(res => {
            console.log(res)
            res=res.data
            console.log(id)
            if(res.code==2000){
              alert('删除成功')
              //再获取一遍数据
              this.getInfo();
            }else{
              alert('删除失败')
            }
          });
        }
      },
      formatDateTime(timeStamp) {
        var date = new Date();
        date.setTime(timeStamp );
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        // var h = date.getHours();
        // h = h < 10 ? ('0' + h) : h;
        // var minute = date.getMinutes();
        // var second = date.getSeconds();
        // minute = minute < 10 ? ('0' + minute) : minute;
        // second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d;
      }
    },
    created(){
      this.name = localStorage.getItem('username');
      this.getInfo();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
