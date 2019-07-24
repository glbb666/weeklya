<template>
  <div>
    <div id="title">记录</div>
    <div id="content">
      <!--侧边栏-->
      <div id="sidebar">
        <ul>
          <li><router-link to="/week/note/history"><img src="../../static/2/note.png" alt=""><span>会议记录</span></router-link></li>
        </ul>
      </div>
      <!--主要内容-->
      <div id="contain">
        <div id="history">
          <ul id="week">
            <li ><router-link to="/week/note/history">历史会议记录</router-link></li>
            <li ><img src="../../static/2/point.png" alt=""></li>
            <li><router-link to="/week/note/write" >编写会议记录</router-link></li>
          </ul>
            <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'note',
    data () {
      return {
        name:'',
        keywords:'',
        list:[]
      }
    },
    methods:{

    },
    created(){
      this.name = localStorage.getItem('username');
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
