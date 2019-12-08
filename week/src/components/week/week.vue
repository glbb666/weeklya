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
          <div id="photo"><span></span></div>
          <span>{{name}}</span>
      </div>
      <div id="mail">
        <router-link @click.native="clearZero" to="/week/person/mail" v-if="!isBig">
          <span class="dot" v-show="count>0">
            {{count}}
          </span>
          <i class="el-icon-message"></i>
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
import myStorage from '../../assets/myStorage'
  export default {
    name: 'week',
    data() {
      return {
        name: '',
        add: false,//默认不显示
        time:'',
        isBig:null,
      }
    },
    computed:{
      count(){
        return this.$store.state.messageCount;
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
              ws.onopen = function() {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  var id = myStorage.getItem('userId');
                  ws.send(id);
              };
              ws.onmessage = function(evt) {
                //从服务器接受数据
                try{
                  var list = myStorage.getItem('list');
                  var count = myStorage.getItem('msgCount');
                  var mlist = JSON.parse(evt.data).result;
                  console.log(mlist);
                  var userStatus = myStorage.getItem('userStatus');
                  for(let item of mlist){
                    console.log(item);
                    console.log(item.mes_accept);
                    if(userStatus==='administor'&&item.mes_send === 0){
                      count++;
                    }
                    if(userStatus==='none'&&item.mes_accept === 0){
                      count++;
                    }
                  }
                  list = [...mlist,...list];
                  myStorage.setItem('list',list,_this);
                  myStorage.setItem('msgCount',count,_this);
                }catch(e){
                  ws.close();
                }
              };
              ws.onclose = function(){
                  exit(_this);
              };
              _this.$once('hook:beforeDestroy',function(){
                console.log(ws);
                ws.close();
              })
          } else {
              // 浏览器不支持 WebSocket
               showPopError('您的浏览器不支持websocket',this);
          }
      },
      clearZero(){
        myStorage.setItem('msgCount',0,this);
      }
    },
    mounted(){
      this.name = window.localStorage.getItem('username');
      if(window.localStorage.getItem('pic')&&window.localStorage.getItem('pic').length){
        document.getElementById('photo').style = "background:"+ 'url(\''+window.localStorage.getItem('pic')+'\') no-repeat'+ ';background-position:center;background-size:auto 100%;background-color: white;'
      }
    },
    created(){
     //大管理员不需要消息盒子
      this.isBig = myStorage.getItem('userStatus')==='big_administor';
      if(!this.isBig){
          myStorage.setItem('list',[],this);
          myStorage.setItem('msgCount',0,this);
          this.WebSocketTest();
      }
    },
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
    display:flex;
    flex:auto;
    color: #fff;
    font-size: 20px;
    overflow: hidden;
    align-items: center;
  }
  #name a{
    color: #fff;
    height: 100%;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  #name a span{
      display: inline-flex;
      height: 100%;
      flex:auto;
      flex-wrap: nowrap;
      justify-content: center;
  }
  #mail{
    flex: auto;
    height: 100%;
    margin-right: 2%;
  }
  #mail a{
      position: relative;
      color: #fff;
      height: 100%;
      display: inline-flex;
      align-items: center;
      padding: 0 10px;
  }
  #mail a i{
      font-size: 28px;
      font-weight: 500;
      margin-bottom: -3px;
  }
  #mail a span{
    position: absolute;
    height: 18px;
    line-height: 18px;
    display: block;
    border-radius: 10px;
    background-color: #f56c6c;
    color: #fff;
    font-size: 12px;
    padding: 0 6px;
    border: 1px solid #fff;
    text-align: center;
    white-space:nowrap;
    top: 10px;
    right: -18px;
  }
  #dropOut{
     color: #fff;
     padding: 10px;
     margin-right: 2%;
     display: inline-block;
     height: 100%;
     font-size: 28px;
     line-height: 28px;
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
</style>
