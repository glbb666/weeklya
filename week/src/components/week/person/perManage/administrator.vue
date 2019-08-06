<template>
  <div id="contain">
    <busy2
              width='75%'
              v-show="show"
    ></busy2>
    <div id="findPart" v-show="!show">
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
          <tr v-for="(item,i) in this.$store.state.pageList" :key="item.user_id">
            <td>
              {{item.user_email}}
            </td>
            <td>
              {{item.user_learningDirection}}
            </td>
            <td v-if="big_administor">
              <Select v-model="item.user_status" size="large">
                <Option :value="item.value" v-for="(item,index) in administorList" :key="index">{{item.text}}</Option>
              </Select>
            </td>
            <td>
              <Select v-model="item.user_state" size="large">
                <Option :value="item" v-for="(item,index) in stateList" :key="index">{{item}}</Option>
              </Select>
            </td>
            <td>
              <el-switch
                v-model="item.user_reset"
                active-color="#686fbf"
                inactive-color="#e5e5e6"
                active-text="已重置"
                inactive-text="未重置"
                @change="reset(i,item.user_id)"
              >
              </el-switch>
            </td>
            <td>
              <a @click.prevent="deleteUser(item.user_id)" class="del">删除</a>
            </td>
            <td>
              <a @click.prevent="modifyUser(item.user_id,item.user_state,item.user_status)" class="reserve">保存</a>
            </td>
          </tr>  
          </tbody>
        </table>
        <dpage
          url='weekly_war/user/getAllUser.do'
          pageSize=7
          type='user'
        ></dpage> 
      </div>
    </div>
  </div>
</template>

<script>
import dpage from '../../../dpage'
import {showPopError,showPopRight} from '../../../../../static/pop.js'
import busy2 from '../../../busy2'
import {exit} from '../../../../assets/common'

  export default {
    name: 'administrator',
    data () {
      return {
        big_administor:window.localStorage.getItem('userStatus')==='big_administor' ,
        list:[],
        administorList:[{value:"administor",text:"管理员"},{value:"none",text:"非管理员"}],
        stateList:["在校","不在校"],
        show:true
      }
    },
    methods:{
      modifyUser(id,state,status='none'){
        this.$axios.get('weekly_war/user/updateUserSim.do?state='+state+'&status='+status+"&id="+id).then(res=>{
           res = res.data;
          if(res.success){
            showPopRight('修改成功',this);
          }else{
             showPopError(res.msg,this);
          }
        });
      },
      reset(i,id){
        if(this.$store.state.pageList[i].user_reset===false){
          this.$store.state.pageList[i].user_reset = !this.$store.state.pageList[i].user_reset;
          showPopError('您已重置过密码',this);
          return;
        }
        if(confirm('您确定要重置密码嘛？')){
            this.$axios.get('weekly_war/user/resetPassword.do?id='+id).then(result=>{
              result = result.data;
              if(result.success){
                showPopRight('重置成功',this);
              }else{
                showPopError('重置失败',this);
              }
            })
        }else{
            this.$store.state.pageList[i].user_reset = !this.$store.state.pageList[i].user_reset
        }
      },
      deleteUser(id){
        var str = confirm("确认删除此用户?")
        if(str){
          this.$axios.get('weekly_war/user/deleteUser.do?id='+id).then(res=>{
              res = res.data;
              if(res.success){
                showPopRight('删除成功',this);
                this.$router.go(-1);
              }else{
                if(result.code===1000){
                  showPopError('未登录',this)
                  exit(this);
                  return;
                }
                showPopError(res.msg,this)
              } 
          });
        }
      },  
    },
    components:{
      dpage,
      busy2
    },
    created(){
      var _this = this;
      setTimeout(function(){
              _this.show = false;
      },2000);
    },
    beforeRouteLeave(from,to,next){
      this.$store.dispatch('setPage',null)
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../../../assets/style/table.css'
</style>
