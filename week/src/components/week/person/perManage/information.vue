<template>
  <div id="contain">
    <busy2
              width='75%'
              v-show="show"
    ></busy2>
    <div id="person" v-show="!show">
      <div id="ptop">
        <label for="">
        上传头像
        <div id="personImg">
            <input type="file" id="personFile" accept='image/*' @change="upload">
        </div>
      </label>
      </div>
      <div id="pbottom">
          <div id="pleft">
         <label for="">
        姓名<input type="text" id="personName" v-model="username" maxlength="16">
        </label>
        <label for="">
       账户名称<input type="text" id="personEmail" v-model="email">
        </label>
      <label for="">
        <div>学习方向</div>
            <select v-model="learningDirection">
              <option :value="item.text" v-for="(item,index) in directionList" :key="index">{{item.text}}</option>
            </select>
      </label>
      <label for="">
        家庭住址 <input type="text" id="personAdress" v-model="address" placeholder="xx省xx市">
      </label>
      <label for="">
        联系电话 <input type="tel" maxlength="11" id="personTel" v-model="tel">
      </label>
      </div>
      <div id="pright">
          <label for="">
           个人状态
            <select v-model="state">
              <option :value="item.text" v-for="(item,index) in stateList" :key="index">{{item.text}}</option>
            </select>
          </label>
          <label for="">
             专业班级<input type="text" v-model="professionalClass">
          </label>     
      </div>
      </div>
      <button class="btn" @click="modifyInfo">保存</button>
    </div>
  </div>
</template>

<script>
import {showPopError,showPopRight} from '../../../../../static/pop.js'
import busy2 from '../../../busy2'
import {exit} from '../../../../assets/common'

    export default {
        name: "information",
        data () {
          return {
            keywords:'',
            directionList:[
              {text:'前端'},
              {text:'后台'},
              {text:'视觉'},
              {text:'产品'},
              {text:'IOS'},
              {text:'Andriod'}
            ],
            stateList:[
              {text:'在校'},
              {text:'离校'}
            ],
            username:'',
            learningDirection:'',
            state:'',
            professionalClass:'',
            address:'',
            tel:'',
            email:'',
            imageUrl: '',
            show:true
          }
        },
        methods:{     
          getInfo(){
            this.$axios.get('weekly_war/user/getUser.do').then(result => {
              result = result.data;
              let pic = result.pic;
              let user = result.user;
              if(result.success){
                var _this = this;
                setTimeout(function(){
                  _this.show = false;
                },1000);
                if(pic&&pic.length){
                  document.getElementById('personImg').style = "background:"+ 'url(\''+pic+'\') no-repeat'+ ';background-position:center;background-size:auto 100%;background-color: white;'
                  window.localStorage.setItem('pic',pic);
                }else{
                  window.localStorage.removeItem('pic');
                }
                this.username = user.userName;
                this.email = user.email;
                this.learningDirection = user.learningDirection;
                this.state = user.state;
                this.professionalClass =user.professionalClass;
                this.address = user.address;
                this.tel = user.phone;
              }else {
                if(result.code===1000){
                  showPopError('未登录',this)
                  exit(this);
                  return;
                }
                showPopError('获取资料失败',this)
              }
            });
          },
          modifyInfo(){
            this.$axios.get('weekly_war/user/updateUser.do?userName='+this.username+'&professionalClass='+this.professionalClass+'&phone='+this.tel+'&address='+this.address+'&learningDirection='+this.learningDirection+'&state='+this.state+'&email='+this.email).then(res => {
              console.log(res)
              res = res.data;
              if(res.success){
                showPopRight('修改资料成功',this)
                window.localStorage.setItem('username',this.username);
              }else{
                showPopError(res.msg,this)
              } 
            });
          },
          upload(e){
            
            var _this = this;
            var _window = window;
            var files = e.target.files;
            var base64Code;
            var oPic = document.getElementById('personImg');
            var oImg = new Image();

            var reader = new FileReader();
            reader.readAsDataURL(files[0]);

            reader.onload = function (e) {
              console.log(this);
              base64Code = this.result;
              oImg.src = base64Code;
              oPic.style = "background:"+ 'url(\''+base64Code+'\') no-repeat'+ ';background-position:center;background-size:auto 100%;background-color: white;'
            }
            oImg.onload = function() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var originW = oImg.width;
            var originH = oImg.height;

            var maxW = 120, maxH = 120;
            var targW = originW, targH = originH;
            if(originW > maxW || originH > maxH) {
              if(originH/originW > maxH/maxW) {
                targH = maxH;
                targW = Math.round(maxH * (originW / originH));
              }else {
                targW = maxW;
                targH = Math.round(maxW * (originH / originW));
              }
            }
            //对图片进行缩放canvas.toblob
            canvas.width = targW;
            canvas.height = targH;
            //清除画布
            context.clearRect(0,0,targW,targH);
            //图片压缩
            context.drawImage(oImg,0,0,targW,targH);
            var newUrl = canvas.toDataURL('image/jpeg', 0.5);
            //canvas转为blob并上传
            canvas.toBlob(function (blob) {
              var formData = new FormData();
              formData.append("file",blob);
              _this.$axios.post('weekly_war/user/photo.do', formData, {emulateJSON : true, withCredentials : true}).then(function(res) {
                  if(res.data.success) {
                   showPopRight(res.data.msg,_this);
                   window.localStorage.setItem('pic',base64Code);
                  }else {
                    showPopError(res.data.msg,_this);
                  }
              })
            },files.type || 'image/png');
          }
         
        }
      },
      components:{
        busy2
      },
      created(){
        this.getInfo();
      },
      mounted(){
         if(window.localStorage.getItem('pic')){
        var oPic = document.getElementById('personImg');
          oPic.style = "background:"+ 'url(\''+window.localStorage.getItem('pic')+'\') no-repeat'+ ';background-position:center;background-size:auto 100%;background-color: white;'
        }
      }
    }
</script>

<style scoped>
 #person{
    margin-left: 5%;
    margin-top: 3%;
  }
  #person label{
    display: flex;
    color: #6e6e74;
    margin-bottom: 50px;
    align-items: center;
    position: relative;
    height: 50px;
  }
  #person input{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 7px;
    font-size: 18px;
    margin-left: 10px;
    padding-left: 10px;
    flex-shrink: 0;
    background: none;
    z-index: 1;
    height: 100%;
  }
  #person #pbottom{
    display: flex;
  }
  #person #pleft{
    width: 33%;
  }
  #person #personFile{
    width: 100%;
    height: 100%;
    margin:0;
    border-radius: 50%;
    padding: 0;
    cursor: pointer;
    opacity:0;
  }
  #personImg{
    margin-left:20px;
    width: 82px;
    height: 82px;
    border-radius: 50%; 
    background: url('../../../../../static/2/add.png') no-repeat center;
    background-size: 'auto 100%';
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  #person #personName{
    margin-left: 50px;
    width:80px;
  }
  #person #personEmail{
    width: 280px;
  }
 .personBorder{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 7px;
    width: 135px;
    margin-left: 10px;
    margin-right: 100px;
    height: 100%;
  }
  .personBorder>div{
    width: 100px;
    height: 100%;
    overflow: hidden;
  }
  select{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 7px;
    font-size: 18px;
    margin-left: 10px;
    padding:0 10px;
    display: block;
    border: none;
    height: 100%;
    cursor: pointer;
  }
  #personAdress{
    width: 300px;
  }
  #personTel{
    width: 150px;
  }
  .btn{
    font-size: 17px;
    background-color:#e5e5e6;
    width: 72px;
    height:36px;
    border-radius: 17px;
    transform:rotate(0);
  }
  .btn:hover{
    background-color: #686fbf;
    color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    padding: 4px;
  }
</style>
