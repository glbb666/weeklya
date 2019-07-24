<template>
      <!--主要内容-->
      <div id="contain">
        <div id="passwordModify">
          <label for="">
            <div>原密码</div>
            <input type="password" minlength="4" maxlength="18" v-model="oldPassword">
            <img src="../../../../../static/2/false.png" alt="" @click="del(1)">
          </label>
          <label for="">
            <div>新密码</div>
            <input type="password" minlength="4" maxlength="18" v-model="newPassword">
            <img src="../../../../../static/2/false.png" alt="" @click="del(2)">
          </label>
          <label for="">
            <div>确认密码</div>
            <input type="password" minlength="4" maxlength="18" v-model="confirmPassword">
            <img src="../../../../../static/2/false.png" alt="" @click="del(3)">
          </label>
          <button class="btn" @click="modifyPassword">保存</button>
        </div>
      </div>
</template>
<script>
import { isRange } from '../../../../../static/common';
import {showPopError} from '../../../../../static/pop.js'
import {showPopRight} from '../../../../../static/pop.js'
export default {
    name: 'password',
    data () {
      return {
        name:'',
        oldPassword:'',
        newPassword:'',
        confirmPassword:''
      }
    },
    methods:{
      getInfo(){
        if(!this.oldPassword){
          showPopError('密码不能为空',this);
          return;
        }
        if(!isRange(this.newPassword,0,18)){
          showPopError('密码为6-18位',this);
          return;
        }
        this.$axios.get('weekly_war/user/updateUserPassword.do?oldPassword='+this.oldPassword+'&newPassword='+this.newPassword).then(res => {
          res = res.data;
          if(res.success){
            showPopRight('修改成功！',this)
            this.oldPassword=''
            this.newPassword=''
            this.confirmPassword=''
          }else {
            showPopError(res.msg,this)
          }
        });
      },
      modifyPassword(){
        if(!this.oldPassword){
          showPopError('密码不能为空',this);
          return;
        }
        if(this.confirmPassword===this.newPassword){
          this.getInfo();
        }else{
          showPopError('新密码需要和确认密码保持一致',this);
        }
      },
      del(num){
        if(num==1){
          this.oldPassword = ''
        }else if(num==2){
          this.newPassword = ''
        }else{
          this.confirmPassword = ''
        }
      }
    },
    created(){
      this.name = localStorage.getItem('username');
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  label input{
    display: inline-flex;
  }
  #passwordModify{
    box-shadow:0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 7px;
    width: 45%;
    height: 55%;
    display: flex;
    flex-direction: column;
    margin: 12% auto;
    justify-content: center;
    align-items: center;
    transition: all .2s linear;
  }
  #passwordModify:hover{
    box-shadow:0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translate3d(0,-2px,0);
  }
  #passwordModify label{
    display: flex;
    height: 50px;
    line-height: 50px;
    color: #6e6e74;
    margin-bottom: 20px;
  }
  #passwordModify label>div{
    margin-right: -80px;
    display: inline-block;
    height: 100%;
    width: 70px;
    flex-shrink: 0;
  }
  #passwordModify input{
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    font-size: 40px;
    height:50px;
    padding-left: 80px;
    width:320px;
    transition-duration:.2s;
  }
  #passwordModify img{
    display: inline-block;
    margin-left: -30px;
    margin-top: 20px;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
  #passwordModify button{
    margin-top: 20px;
  }
  #passwordModify input:hover,#passwordModify input:focus{
    border-bottom: 1px #686fBF solid;
  }
  .btn{
    font-size: 17px;
    background-color:#e5e5e6;
    width: 72px;
    height:36px;
    border-radius: 17px;
  }
  .btn:hover{
    background-color: #686fbf;
    color: #fff;
  }
</style>
