<template>
     <div id="bottom">
       <h2>Record your weekly work</h2>
       <div id="form" v-if="show==='l'">
        <label>
          <input type="text" v-model="user" placeholder="UserName" maxlength="16">
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('user',$event)">
        </label>
        <label>
          <input type="password" v-model="password" maxlength="18" id="password" placeholder="PassWord">
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('password',$event)">
        </label>
        <div class="buttonRange">
          <p @click="change('c')" id="fp">忘 记 密 码 ？</p>
          <input type="button" value="登录" class="btn" @click="postInfo($event,'weekly_war/user/login.do')">

          <p>Don't have an account？</p>
          <router-link to="register" class="btn" id="rbtn">注册</router-link>
        </div> 
       </div>   
       <div id="form" v-else-if="show==='c'">
        <label>
          <input type="text" v-model="user" placeholder="UserName">
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('user',$event)">
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
          <input type="button" value="开始验证" class="btn" @click="postfcode($event,'weekly_war/user/fcode.do')">
          <p>remind your password?</p>
          <input @click="change('l')" class="btn" id="rbtn" value="回去登录">
        </div> 
       </div>
       <div id="form" v-else>
        <label>
          <input type="password" v-model="password" placeholder="PassWord">
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('password',$event)">
        </label>
        <label>
          <input type="password" v-model="cpassword" placeholder="Confirm your PassWord">
          <img src="../../../static/1/false.png" alt="" class="false" @click="del('cpassword',$event)">
        </label>
        <div class="buttonRange">
          <input type="button" value="修改密码" class="btn" @click="changePas($event,'weekly_war/user/fpass.do')">
          <p>Don't want to change password?</p>
          <input @click="change('l')" class="btn" id="rbtn" value="回去登录">
        </div> 
       </div>
      </div>
</template>
<script>
import {isMail,isLegal,isRange,enter} from '../../assets/common.js'
import {showPopError,showPopRight} from '../../../static/pop.js'

export default {
  data () {
    return {
        user:'',
        email:'',
        password:'',
        show:'l',
        code:'',
        get:false,
        num:null
    }
  },
  methods:{
    postInfo(e,url){
      console.log(url)
      var data = {}
      data.userName = this.user;
      data.password=this.password;
      if(!(isRange(this.user,0,16))){
        showPopError('用户名长度为4-16位',this);
      }else if(!isRange(this.password,-1,18)){
        showPopError('密码为6-18位',this);
      }else{
      let loading = e.toElement;
      loading.value = "";
      loading.classList.add('loading');
      this.$axios.post(url,this.$qs.stringify(data)).then(result => {
        loading.classList.remove('loading');
        loading.value = "登录";
        console.log(result.data)
        var result = result.data;
        if (result.success) {
          //登录成功后切换到主页面组件
          console.log(result);
          enter(result,this);
          showPopRight('登录成功',this);
        } else {
          showPopError(result.msg,this);
        }
      });
      }
    },
    postfcode(e,url){
      console.log(url)
      var data = {}
      data.name = this.user;
      data.email=this.email;
      data.code = this.code;
      if(!(isRange(this.user,3,16))){
        showPopError('用户名长度4-16',this);
      }else if(!isMail(this.email)){
        showPopError('email不合法',this);
      }else{
      let loading = e.toElement;
      loading.value = "";
      loading.classList.add('loading');
      this.$axios.post(url,this.$qs.stringify(data)).then(result => {
        loading.classList.remove('loading');
        loading.value = "登录";
        console.log(result.data)
        var result = result.data;
        if (!result.error) {
         // this.$store.
          showPopRight('验证成功',this);
          //验证成功后切换到修改密码界面
          this.show='f';
        } else {
          showPopError(result.result,this);
        }
      })
      }
    },
    changePas(e,url){
      console.log(url)
      if(!isRange(this.password,5,18)){
        showPopError('密码6-18',this);
        return;
      }
      if(this.password!==this.cpassword){
        showPopError('两次密码不一致',this);
        return;
      }
      var data = {}
      data.password = this.password;
      let loading = e.toElement;
      loading.value = "";
      loading.classList.add('loading');
      this.$axios.post(url,this.$qs.stringify(data)).then(result => {
        loading.classList.remove('loading');
        loading.value = "登录";
        console.log(result.data)
        var result = result.data;
        if (!result.error) {
          showPopRight('修改成功',this);
          //修改成功后切换到登录界面,并且不进行初始化,这样就可以直接登录了
          this.show='l';
        } else {
          showPopError(result.msg,this);
        }
      })
    },
    del(str,target){
      this[str] = '';
      target.toElement.focus();
    },
    getCode(){
      if(!(isRange(this.user,3,16))){
        showPopError('用户名长度4-16',this);
      }else if(!isMail(this.email)){
        showPopError('email不合法',this);
      }else{
        let url = 'weekly_war/user/regcode.do';
        var data = {}
        data.user = this.user;
        data.email=this.email;
        data.type = "f";
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
    minute(num){
      setTimeout(()=>{
        if(this.num<=0){
          this.get = false;
          return;
        }
        this.num--;
        this.minute(this.num);
      },1000)
    },
    init(){
      this.email = '';
      this.password = '';
      this.cpassword = '';
      this.user= '';
      this.code = '';
    },
    change(mode){
      this.init();
      this.show = mode;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../assets/style/outer.css';
</style>
