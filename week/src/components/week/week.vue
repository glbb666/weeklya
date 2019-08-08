<template>
  <div id="main">
    <!--导航栏-->
    <div id="nav">
      <ul id="banner">
        <li><router-link to="/week/aboutWeek">周报</router-link></li>
        <!-- <li><router-link to="/week/note">记录</router-link></li> -->
        <li><router-link to="/week/workmate">同事</router-link></li>
        <li><router-link to="/week/person">个人</router-link></li>
      </ul>
      <div id="name">
        <router-link to="/week/person">
          <div id="photo"><span></span></div>
          {{name}}
        </router-link>
        <router-link to="/week/person/mail" v-if="true">
            <el-badge is-dot class="item">
              <i class="el-icon-message"></i>
            </el-badge>
        </router-link>
      </div>
      <button id="dropOut" @click="out"><Icon type="md-exit" title="退出"/></button>
    </div>
    <router-view></router-view>
    </div>
</template>

<script>
import {showPopError,showPopRight} from '../../../static/pop.js'
import {exit} from '../../assets/common'
  export default {
    name: 'week',
    data() {
      return {
        name: '',
        add: false,//默认不显示
        time:''
      }
    },
    methods: {
        out(){
          var dropOut = confirm("你确定要退出登录吗？");
          if(dropOut){     
            this.$axios.get('weekly_war/user/logout.do').then(res=>{  
              res = res.data;
              exit(this);
              showPopRight('退出成功',this)
            })
          }
      },
      WebSocketTest(list) {
          var _this = this;
          if ("WebSocket" in window) {
              // 打开一个 web socket
              var ws = new WebSocket("ws://localhost:8090");
              ws.onopen = function(learning_Direction) {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  var obj = {
                      id:window.localStorage.getItem('userId'),
                      learningDirection:window.localStorage.getItem('userLearningDirection')               
                  }
                  ws.send(JSON.stringify(obj));
              };

              ws.onmessage = function(evt) {
                  var list = JSON.parse(window.localStorage.getItem('list'));
                  var mlist = JSON.parse(evt.data).result;
                  list = [...mlist,...list];
                  window.localStorage.setItem('list',JSON.stringify(list));
                  if(mlist.length>0){

                  }
                  console.log(mlist);
              };
              ws.onclose = function() {
                  // 关闭 websocket
                  alert("连接已关闭...");
              };
          } else {
              // 浏览器不支持 WebSocket
               showPopError('您的浏览器不支持websocket',this);
          }
      }
    },
    mounted(){
      this.name = window.localStorage.getItem('username');
      if(window.localStorage.getItem('pic')&&window.localStorage.getItem('pic').length){
        document.getElementById('photo').style = "background:"+ 'url(\''+window.localStorage.getItem('pic')+'\') no-repeat'+ ';background-position:center;background-size:auto 100%;background-color: white;'
      }
    },
    created(){
        if(window.localStorage.getItem('userStatus')==='administor'){
          var list = [];
          window.localStorage.setItem('list',JSON.stringify(list));
          this.WebSocketTest();
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 /*导航栏*/
  #nav{
    background-color: #686fbf;
    height: 55px;
    width: 100%;
    position: fixed;
    z-index: 3;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
 #banner .router-link-active{
    background-color:#7a80c0;
  }
  #banner{
    margin-left: 200px;
    flex-shrink:3;
    display: inline-flex;
    width: 60%;
    height: 100%;
  }
  #banner li{
    height: 100%;
    width: 110px;
  }
  #banner li a{
    display: inline-flex;
    height: 100%;
    width: 100%;
    color: #fff;
    font-size: 20px;
    justify-content: center;
    align-items: center;
  }
  #name{
    height: 100%;
    display: inline-flex;
    flex:auto;
    margin-right: 20px;
    flex-wrap: nowrap;
    color: #fff;
    font-size: 20px;
    overflow: hidden;
  }
  #name a{
    color: #fff;
    height: 100%;
    width: 100%;
    display: flex;
    /* min-width: 100px; */
    align-items: center;
  }
  #mail{
    flex: auto;
  }
  #mail a{
      color: #fff;
      height: 100%;
      display: inline-flex;
      align-items: center;
  }
  #dropOut{
     color: #fff;
     flex: auto;
     display: inline-block;
     height: 100%;
     font-size: 25px;
  }
  #photo{
    display: inline-block;
    height: 45px;
    width: 45px;
    border-radius: 50%;
    background: url('../../../static/2/man.png') no-repeat center;
    background-size: 'auto 100%';
    margin-right: 5%;
    position: relative;
  }
  .item {
  margin-top: 4px;
  font-size:28px;
  padding: 0 10px;
}
.ivu-icon{
  font-size: 28px;
}
</style>
