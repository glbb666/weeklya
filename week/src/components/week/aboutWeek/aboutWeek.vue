<template>
  <div class="about">
    <div id="title">周报</div>
    <div id="content">
      <!--侧边栏-->
      <div id="sidebar">
        <ul>
          <li><router-link to="/week/aboutWeek/quick"><span></span>快捷周报</router-link></li>
          <li><router-link to="/week/aboutWeek/other"><span></span>他人周报</router-link></li>
          <!-- <li><router-link to="/week/aboutWeek/my"><span></span>我的周报</router-link></li> -->
        </ul>
      </div>
      <router-view id="contain"></router-view>
    </div>
  </div>

</template>

<script>
  import qs from 'qs'
  // Vue.prototype.$qs = qs
  export default{
    name: 'my',
    data () {
      return {
        name:'',
        id:null
      }
    },
    created(){
      this.name = localStorage.getItem('username');
      this.id = localStorage.getItem('userId');
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.about{
  width: 100%;
  margin-top: 55px;
}
 #title{
    height: 33px;
    font-size: 18px;
    line-height: 33px;
    background-color: #fff;
    margin-left: 35px;
    position: fixed;
  }
 #content{
    display: flex;
    width: 100%;
    margin-top: 32px;
  }
  #content h3{
    margin-left: 80px;
  }
  #sidebar{
    display: block;
    width: 200px;
    background-color: #f7f7f9;
    position: fixed;
    height: 100%;
    border-radius: 7px 7px 0 0;
  }
  #sidebar .router-link-exact-active,#sidebar .router-link-active{
    color: #686fbf;
    border-left:3px solid #686fbf;
  }
 
  #sidebar ul{
    width:200px;
  }
  #sidebar ul li{
    height: 55px;
    line-height: 55px;
    font-size: 18px;
  }
  #sidebar ul li a{
    height: 100%;
    width: 100%;
    display: block;
  }
  .click{
    border-left:3px solid #686fbf;
  }
  .select{
    color: #686fbf;
  }
  #sidebar ul li img{
    margin-left: 29px;
    margin-bottom: -4px;
  }
  #sidebar ul li span{
    margin-left: 15px;
  }
 #sidebar li span{
    display: inline-block;
     width: 30px;
     height: 24px;
     margin-bottom: -5px;
     margin-right: 10px;
 }
 #sidebar li:nth-child(1) span{
     background: url(../../../../static/2/quick.png) no-repeat;
 }
 #sidebar li:nth-child(1) a.router-link-active span{
     background: url(../../../../static/2/quicked.png) no-repeat;
 }
 #sidebar li:nth-child(2) span{
     background: url(../../../../static/2/other.png) no-repeat;
 }
 #sidebar li:nth-child(2) a.router-link-active span{
     background: url(../../../../static/2/othered.png) no-repeat;
 }
 #sidebar li:nth-child(3) span{
     background: url(../../../../static/2/my.png) no-repeat;
 }
 #sidebar li:nth-child(3) a.router-link-active span{
     background: url(../../../../static/2/myed.png) no-repeat;
 }
 #contain{
   width:100%;
   margin-left: 200px;
 }
  #contain a.router-link-exact-active{
    color: #686fbf;
  }
</style>
