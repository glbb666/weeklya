<template>
  <div id="contain">
    <div id="findPart">
      <div id="findContain">
        <table>
          <thead>
          <tr>
            <th>账户名</th>
            <th>组别</th>
            <th v-if="big_administor">管理员</th>
            <th>状态</th>
            <th>重置密码</th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in list" :key="item.user_id">
            <td>
              <input type="email" v-model="item.user_email">
            </td>
            <td>
              <select v-model="item.user_learningDirection">
                <option :value="item" v-for="(item,index) in directionList" :key="index">{{item}}</option>
              </select>
            </td>
            <td v-if="big_administor">
              <select v-model="item.user_status">
                <option :value="item.value" v-for="(item,index) in administorList" :key="index">{{item.text}}</option>
              </select>
            </td>
            <td>
              <select v-model="item.user_state">
                <option :value="item" v-for="(item,index) in stateList" :key="index">{{item}}</option>
              </select>
            </td>
            <td>
              <el-switch
              v-model="item.user_reset"
              active-color="#686fbf"
              inactive-color="#e5e5e6"
              active-text="已重置"
              inactive-text="未重置"
              @change="reset(i)"
              >
              </el-switch>
            </td>
            <td>
              <a @click.prevent="deleteUser(item.user_id)" class="del">删除</a>
            </td>
            <td>
              <a @click.prevent="modifyUser(item.user_id,item.user_email,item.user_learningDirection,item.user_state,item.user_reset,item.user_status)" class="reserve">保存</a>
            </td>
          </tr>  
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {showPopError} from '../../../../../static/pop.js'
import {showPopRight} from '../../../../../static/pop.js'
  export default {
    name: 'administrator',
    data () {
      return {
        big_administor:window.localStorage.getItem('userStatus')==='big_administor' ,
        keywords:'',
        list:[],
        addList:[],
        administorList:[{value:"administor",text:"管理员"},{value:null,text:"非管理员"}],
        stateList:["在校","不在校"],
        directionList:['前端','后台','产品','视觉','IOS','Android']
      }
    },
    methods:{
      getInfo(){
        this.$axios.get('weekly_war/user/getAllUser.do').then(res => {
          res = res.data;
          console.log(res);
          if(res.success){
            console.log('获取成功');
            this.initial(res.user);
            this.list = res.user;

          }else {
            showPopError(res.msg,this);
          }
        });
      },
      modifyUser(id, email,learningDirection,state,reset,status=null){
        console.log(email)
        console.log(state)
        console.log(reset)
        console.log(status)
        this.$axios.get("weekly_war/user/updateUserSim.do?email="+email+'&learningDirection='+learningDirection+'&state='+state+'&reset='+reset+'&status='+status+"&id="+id).then(res=>{
           res = res.data;
          if(res.success){
            showPopRight('修改成功',this);
            this.getInfo();
          }else{
             showPopError(res.msg,this);
          }
        });
      },
      reset(i){
        if(confirm('您确定要重置密码嘛？')){
            
        }else{
            this.list[i].user_reset = !this.list[i].user_reset
        }
      },
      deleteUser(id){
        var str = confirm("确认删除此用户?")
        if(str){
          this.$axios.get('weekly_war/user/deleteUser.do?id='+id).then(res=>{
              res = res.data;
              if(res.success){
                showPopRight('删除成功',this)
                this.getInfo();
              }else 
                showPopError(res.msg,this)
          });
        }
      },
      addUser(){
        this.addList.push({email:'',state:'',status:'',password:''})
      },
      addUserSim(email,status,state,password){
        console.log(email)
        console.log(status)
        console.log(state)
        console.log(password)
        this.$axios.get("weekly_war/user/updateUserSim.do?email="+email+"&state="+state+"&status="+status+"&password="+password).then(res=>{
          console.log(res)
          res = res.data
          if(res.success){
            showPopRight('添加成功',this)
            //重新获取一次用户的数据
            this.getInfo();
          }else{
            showPopError(res.msg,this)
          }
        });

      },
      initial(list){
        for(let item of list){
          item.user_reset = false;
          console.log(item);
        }
      }
    },
    created(){
      this.getInfo();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 #findPart{
    margin-top: 13px;
    margin-left: 68px;
    font-size: 16px;
  }
   /*查找姓名*/
  select{
    font-size: 16px;
  }
  #find img{
    position: absolute;
    right: 20px;
    top: 0px;
  }
  /* 查找到的内容 */
  #findContain{
    padding-top: 22px;
    width: 80%;
  }
  #findContain input{
    font-size: 18px;
    width: 100%;
    margin-left: 20px;
  }
 #findContain table{
    /*border-collapse:collapse和border-radius不兼容，通过以下两行代码达到collapse的效果*/
    border-collapse:separate;
    border-spacing: 0;
    width: 100%;
    font-weight: 500;
  }
  thead tr{
    background-color: #f7f7f9;
    /*设置背景*/
    height: 50px;
    line-height: 50px;
    text-align: center;
    letter-spacing: 2px;
  }
  thead tr th{
    font-weight: 500;
  }
  /*设置表格的圆角边框*/
   thead tr th:first-child{
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
  }
  thead tr th:last-child{
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
  }
  /* 设置鼠标经过动画 */
  tbody tr  {
    transition: all .3s;
  }
  tbody tr:hover{
    background-color:rgba(104,111,191, .2);
  }
  tbody tr:hover a{
    background-color:#686fbf;
    color: #fff;
  }
  tbody tr td {
    text-align: center;
    padding-top: 27px;
    padding-bottom: 27px;
    letter-spacing: 1px;
  }
  tbody tr td{
    position: relative;
  }
  a{
    background-color:#e5e5e6;
    display: block;
    width: 72px;
    height: 36px;
    line-height: 36px;
    border-radius: 17px;
    text-align: center;
  }
</style>
