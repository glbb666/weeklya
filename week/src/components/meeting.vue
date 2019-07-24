<template>
  <div id="write">
    <div id="editor">
      <div id="editorElem" style="text-align:left" v-html="this.$route.query.content"></div>
      <div id="img"><img src="../../static/2/right.png" alt=""></div>
      <div id="menuList">
        <h1 id="menuPerson">联系人</h1>
        <ul id="menu">
          <li>
            <label for="" ></label>
            <input type="checkbox">
            在职所有成员
            <img src="../../static/2/arrowDown.png" alt="" @click = list(0)>
          </li>
          <ul class="menuUl">
            <li>
              <label for="" ></label>
              <input type="checkbox">
              在职产品组
              <img src="../../static/2/arrowDown.png" alt="" @click = list(1)>
            </li>
            <ul class="menuUl">
              <li>
                <label for=""></label>
                <input type="checkbox" name="send" value="806938139@qq.com">
                爸爸
              </li>
              <li>
                <label for="" ></label>
                <input type="checkbox" name="send" value="806938139@qq.com">
                爸爸
              </li>
            </ul>
            <li>
              <label for="" ></label>
              <input type="checkbox">
              在职视觉组
              <img src="../../static/2/arrowDown.png" alt="" @click="list(2)">
            </li>
            <ul class="menuUl">
              <li>
                <label for=""></label>
                <input type="checkbox" name="send" value="806938139@qq.com">
                妈妈
              </li>
              <li>
                <label for="" ></label>
                <input type="checkbox" name="send" value="806938139@qq.com">
                妈妈
              </li>
            </ul>
            <li>
              <label for="" ></label>
              <input type="checkbox" name="send" value="806938139@qq.com">
              在职前端组
              <img src="../../static/2/arrowDown.png" alt="" @click="list(3)" >
            </li>
            <ul class="menuUl">
              <li>
                <label for="" ></label>
                <input type="checkbox" name="send" value="806938139@qq.com">
                白白
              </li>
              <li>
                <label for="" ></label>
                <input type="checkbox" name="send" value="806938139@qq.com">
                白白
              </li>
            </ul>
          </ul>
          <li>
            <label for="" ></label>
            <input type="checkbox" name="send" value="806938139@qq.com">
            其他成员
            <img src="../../static/2/arrowDown.png" alt="" @click="list(4)">
          </li>
          <ul class="menuUl">
            <li>
              <label for="" ></label>
              <input type="checkbox" name="send" value="806938139@qq.com">
              啊啊
            </li>
          </ul>
        </ul>
      </div>
    </div>
    <div>
      <button class="btn" @click="shareInfoAll">分享</button>
      <button class="btn" @click="updateInfo">保存</button>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import E from 'wangeditor'

  export default {
    name: 'meeting',
    data () {
      return{
        editorContent: '',
        peopleList:[]
      }
    },
    methods:{
      updateInfo(){
        console.log(this.editorContent)
        var data = {}
        data.content=this.editorContent
        data.id = this.$route.query.id
        this.$axios.post('weekly_war/meeting/updateMeeting.do',this.$qs.stringify(data)).then(res => {
          console.log(res)
          var res = res.data;
          if(res.code==2000){
            alert('提交成功！')
            //提交成功之后才能分享
            console.log(document.getElementsByClassName('btn')[0])
            document.getElementsByClassName('btn')[0].style.display = 'inline-block'
          }else {
            alert('提交失败')
          }
        });
      },
      shareInfoAll(){
        //分享会议给所有的在校成员
        var people = document.getElementsByName('send');
        var flag = true
        for(var i = 0;i<people.length;i++){
          people[i].checked == true?this.peopleList.push(people[i].value):flag=false;
        }
        if(flag){
          this.$axios.get('weekly_war/meeting/sendMeetings.do?id='+window.localStorage.getItem('meetingNum')).then(res => {
            console.log(res)
            res = res.data;
            if(res.code==2000){
              alert('分享成功！')
            }else {
              alert('分享失败')
            }
          });
        }else {
          //分享会议给指定的成员
          this.$axios.get('weekly_war/meeting/sendMeetingsByUser.do?emailList='+this.peopleList+'&id='+window.localStorage.getItem('meetingNum')).then(res => {
            console.log(this.peopleList)
            console.log(res)
            res = res.data;
            if(res.code==2000){
              alert('提交成功！')

            }else {
              alert('提交失败')
            }
          });
        }
      },
      list(num){
        var uls = document.getElementsByClassName('menuUl')
        var menu = document.getElementById('menu')
        var images = menu.getElementsByTagName('img')
        uls[num].style.display == 'none'||uls[num].style.display == ''? (uls[num].style.display = 'block',images[num].src = "../../static/2/arrowUp.png"):(uls[num].style.display = 'none',images[num].src= "../../static/2/arrowDown.png")
      },
      selected(num){
        var labels = document.getElementsByTagName('label');
        var menu = document.getElementById('menu')
        var checks = document.getElementsByTagName('input')
        //判断有没有点击过
        var flag;
        labels[num].style.background=="url(\"../../static/2/select.png\") -2px -2px rgb(255, 255, 255)"||labels[num].style.background =='' ?(labels[num].style.background = "url(\"../../static/2/selected.png\") -2px -2px rgb(255,255,255)",checks[num].checked = true,flag=true):(labels[num].style.background = "url(\"../../static/2/select.png\") -2px -2px rgb(255, 255, 255)",checks[num].checked = false,flag=false);
        var lis = menu.getElementsByTagName('li');
        //判断是不是ul元素
        if(lis[num].nextElementSibling&&lis[num].nextElementSibling.className == 'menuUl'){
          var inputs = lis[num].nextElementSibling.getElementsByTagName('input')
          var labelss = lis[num].nextElementSibling.getElementsByTagName('label')
          for(var i = 0;i<inputs.length;i++){
            // console.log('ok')
            flag==true?(inputs[i].checked = true,labelss[i].style.background = "url(\"../../static/2/selected.png\") -2px -2px rgb(255,255,255)"):(inputs[i].checked = false,labelss[i].style.background = "url(\"../../static/2/select.png\") -2px -2px rgb(255, 255, 255)")
            //同时设置图片选中
          }
        }
      }
    },
    created(){
      this.name = localStorage.getItem('username');
    },
    mounted(){
      var editor = new E('#editorElem')
      editor.customConfig.showLinkImg = false;
      // editor.customConfig.uploadImgServer = 'http://47.95.244.73/weekly_war';  // 上传图片到服务器
      // editor.customConfig.uploadImgServer = 'http://47.95.244.73/weekly_war/meeting/sendMeetings.do?id=\'+window.localStorage.getItem(\'meetingNum\')';  // 上传图片到服务器
      editor.customConfig.uploadImgServer = 'weekly_war/meeting/sendMeetings.do?id='+window.localStorage.getItem('meetingNum')
      editor.customConfig.withCredentials = true;
      editor.customConfig.uploadImgParamsWithUrl = true;
      editor.customConfig.uploadFileName = 'file';

      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }
      editor.create()
      var labels = document.getElementsByTagName('label')
      for(let num = 0;num<labels.length;num++){
        var _this = this
        labels[num].onclick = function () {
          // console.log(labels[num])
          _this.selected(num)
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #write{
    margin-top: 36px;
  }
  #editor{
    width: 100%;
    height: 330px;
    margin-bottom: 10px;
  }
  #editor div{
    float: left;
  }
  #editorElem {
    width: 720px;
  }
  #img{
    margin:150px 30px 0 30px ;
  }
  .btn{
    margin-top: 20px;
    margin-right: 20px;
  }
  #menuList{
    height: 100%;
    width: 250px;
    border: 2px solid #000;
    border-radius: 7px;
    overflow-y: auto;
  }
  #menu{
    margin-left: 20px;
    font-size: 14px;
  }
  #menu input{
    margin-right: 5px;
    width: 14px;
    height: 14px;
  }
  #menuPerson{
    text-align: center;
    line-height: 45px;
    font-size: 16px;
    height: 45px;
  }
  #menu ul{
    display: none;
  }
  #menu {
    /*width: 100%;*/
    /*height: 30px;*/
    display: block;
  }
  #menu img{
    cursor: pointer;
    display: inline-block;
    margin-bottom: -2px;
  }
  .show{
    display: block;
  }
  .menuUl{
    margin-left: 15px;
  }
  #menu>.menuUl{
    margin-top: 5px;
    margin-bottom: 8px;
  }
  #menu li{
    height: 20px;
    line-height: 20px;
    position: relative;
  }
  #menu label{
    position: absolute;
    display: block;
    width: 12px;
    height: 12px;
    background-color: #fff;
    cursor: pointer;
    top: 1px;
    border: 1px solid #6e6e74;
    border-radius: 2px;
    background: url("../../static/2/select.png") -2px -2px rgb(255, 255, 255);
  }
</style>
