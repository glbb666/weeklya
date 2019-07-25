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
import {isMail} from '../../assets/common.js'
import {isLegal} from '../../assets/common.js'
import {isRange} from '../../assets/common.js'
import {showPopError} from '../../../static/pop.js'
import {showPopRight} from '../../../static/pop.js'


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
          // console.log(result);   
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
#right #bottom{
    width: 100%;
    height: 65%;
}
#form{
  width: 55%;
  margin: 0 auto;
}
.false{
    position: absolute;
    right: 0;
    top: 30%;
    cursor: pointer;
}
label{
  position: relative;
  display: block;
  margin-bottom: 15px;
}
label input{
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    font-size: 21px;
    line-height:42px;
    padding: 10px;
    width: 90%;
    padding-left: 50px;
    letter-spacing: 2px;
    transition-duration: 0.2s;
  }
  label input:hover,label input:focus{
    border-bottom: 1px #686fBF solid;
}
#code{
  display: flex;
}
#code input{
  width: 50%;
  margin-right: 10%;
}
#code div{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  border:2px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 5px;
  font-size: 18px;
  color: #535353;
  letter-spacing: 2px;
  cursor: pointer;
  font-size: 20px;
  padding: 10px;
  font-weight: bold;
  border-radius: 7px;
}
.buttonRange{
  width: 100%;
  margin-top: 8%;
  height: 50px;
}
.btn{
  display: block;
  width: 90%;
  min-width: 80px;
  margin: 0 auto;
  text-align: center;
  line-height: 50px;
  background:#686fbf;
  color:#fff;
  cursor: pointer;
  font-size: 27px;
  font-weight: 700;
  height: 50px;
  border-radius: 20px;
  letter-spacing: 10px;
  margin-bottom: 20px;
}
p{
  font-size: 18px;
  display: block;
  color: #535353;
  text-align: center;
  margin: 20px;
}
#rbtn{
    background: none;
    color:#686fbf;
    border: 2px solid #686fbf;
}
.loading{
  background: url('../../../static/2/loading.gif') center no-repeat #686fbf;
}
</style>
