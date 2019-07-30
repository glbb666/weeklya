<template>
      <div id="bottom">
        <div id="form">
        <label>
          <input  type="text" v-model="user" maxlength="16" placeholder="UserName">
          <img src="../../../static/1/false.png" alt=""
               class="false" @click="del('user',$event)">
        </label>
        <label>
          <input type="password" v-model="password" maxlength="18" minlength="4"  placeholder="PassWord"> 
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('password',$event)">
        </label>
        <label>
          <input type="email" v-model="email" placeholder="Email">
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('email',$event)">
        </label>
        <label id="code">
          <input type="text" v-model="code" maxlength='8'  placeholder="verCode">
          <div @click="getCode()" v-show="!get">获取验证码</div>
          <div v-show="get" v-model="num">{{num}}</div>
        </label>
        <div class="buttonRange">
          <input type="button" value="注册" class="btn" @click="postInfo($event)">
          <p>Already has an account ?</p>
          <router-link to="login" class="btn" id="rbtn">登录</router-link>  
        </div> 
        </div> 
      </div>
</template>

<script>
import {isMail,isLegal,isRange} from '../../assets/common.js'
import {showPopError,showPopRight} from '../../../static/pop.js'


export default {
  data () {
    return {
        user:'',
        email:'',
        password:'',
        code:'',
        get:false,
        num:null
    }
  },
  methods:{
    getCode(){
      if(!(isRange(this.user,3,16))){
        showPopError('用户名长度为4-16位',this)
      }else if(!isRange(this.password,5,18)){
        showPopError('密码长度为6-18位',this)
      }else if(!isMail(this.email)){
        showPopError('email不合法',this);
      }else{
        let url = 'weekly_war/user/regcode.do';
        var data = {}
        data.user = this.user;
        data.email=this.email;
        data.type = "r";
        this.$axios.post(url,this.$qs.stringify(data)).then(result => {
          var result = result.data;
          if(!result.error){
            this.get= true;
            this.num = 180;
            this.minute(this.num);
          }else{
            showPopError(result.msg,this);
          }
        });
      }
    },
    postInfo(e){
      if(!(isRange(this.user,3,16))){
        showPopError('用户名长度为4-16位',this)
      }else if(!isRange(this.password,5,18)){
        showPopError('密码长度为6-18位',this)
      }else if(!isMail(this.email)){
        showPopError('email不合法',this);
      }else{
      let loading = e.toElement;
      loading.value = "";
      loading.classList.add('loading');
      let url = 'weekly_war/user/register.do';
      var data = {}
      data.user = this.user;
      data.password=this.password;
      data.email=this.email;
      data.code = this.code;
      this.$axios.post(url,this.$qs.stringify(data)).then(result => {
        loading.classList.remove('loading');
        loading.value = "注册";
        var result = result.data;
        console.log(result);
        if (result.success) {
          //注册成功后跳转到登陆页面
          showPopRight('注册成功',this);
          this.$router.replace('/home/login');
        } else {
          showPopError('注册失败',this);
        }
      });
      }
    },
    del(str,target){
      this[str] = '';
      target.toElement.focus();
    },
    minute(num){
      setTimeout(()=>{
        if(this.num<=0){
          this.get = false;
          return;
        }
        this.num--;
        this.minute(this.num);
      },1000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../assets/style/outer.css';
</style>
