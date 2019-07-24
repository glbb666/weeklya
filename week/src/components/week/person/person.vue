<template>
  <div class="about">
    <div id="title">个人</div>
    <div id="content">
      <!--侧边栏-->
      <div id="sidebar">
        <ul>
          <li><router-link to="/week/person/information"><span class="img img1"></span>信息修改</router-link></li>
          <li><router-link to="/week/person/password"><span class="img img2"></span>密码修改</router-link></li>
          <li v-if='administor'><router-link to="/week/person/administrator"><span class="img img3"></span>用户管理</router-link></li>
        </ul>
      </div>
      <!--主要内容-->
      <router-view id="contain"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'person',
    data () {
      return {
        administor:window.localStorage.getItem('userStatus').indexOf('administor')!=-1,
      }
    },
    methods:{
    },
    created(){
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
  .router-link-exact-active span,.router-link-active span{
    color: #686fbf;
  }
  .router-link-active{
    border-left:3px solid #686fbf;
  }
  .img{
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-bottom: -7px;
  }
  .img1{
    background: url("../../../../static/2/info.png");
  }
  .img2{
    background: url("../../../../static/2/password.png");
  }
  .img3{
    background: url("../../../../static/2/administrator.png");
  }
  .router-link-active .img1{
    background: url("../../../../static/2/infoed.png");
  }
  .router-link-active .img2{
    background: url("../../../../static/2/passworded.png");
  }
  .router-link-active .img3{
    background: url("../../../../static/2/administratored.png");
  }
</style>
