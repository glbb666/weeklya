<template>
    <div>
      <empty
        :words="pwords"
        :plist="spageList"
        width="100%"
        backgroundColor="#f7f7f9"
      >
      </empty>
      <ul id="findPage" v-show="spageList.length">
          <li @click="page=1">第一页</li>
          <li @click="changePage(-1,true)" ref="pre">上一页</li>
          <li v-for="item in pageList" @click="page=item" :ref="item">{{item}}</li>
          <li @click="changePage(1,true)" ref="next">下一页</li>
          <li @click="page=totalPage">最末页</li>
      </ul>
    </div>
</template>
<script>
import {showPopError,showPopRight,showPopJoin} from '../../static/pop.js'
import {exit} from '../assets/common'
import empty from './empty'
export default {
    name:'dpage',
    props:['url','pageSize','type','pwords'],
    data(){
        return{
            list:[],
            page:1,
            totalPage:0,
            preLi:null,
            pageList:null
        }
    },
    computed:{
      spageList:function(){
        return this.$store.state.pageList;
      }
    },
    watch:{
      'type':function(){
          this.getInfo();       
      },
      'page':function(){
          this.getInfo();       
      }
    },
    methods:{
        getInfo(){
          let msg = {
            "totalPage":this.totalPage,
            "pageParams":{
              "page":this.page,
              "pageSize":this.pageSize
            }
          };
          this.$axios.post(this.url,JSON.stringify(msg),{
            headers:{'Content-Type': 'application/json'}
          }).then(result => {
            var result = result.data;
            if (result.success) {
              //把获取到的全部信息存储到list中
              if(this.type==='user'){
                 this.initial(result.tasks);
              }
              this.$store.dispatch('setPage',result.tasks);
              result.totalPage?this.totalPage=result.totalPage:null;
              this.setPageList(5);
              this.checkPage();
            } else {
              if(result.code===1000){
                   showPopError('未登录',this);
                   exit(this);
                   return;
              }
              if(this.type==='task'){
                  this.$router.go(-1);
                  showPopJoin(result.msg,this);
                  return;
              }
              showPopError(result.msg,this);
            }
          });
        },
        changePage(num){
          var result = this.page + num;
          if(result>this.totalPage||result<=0){
            return;
          }
          this.page+=num;
          this.getInfo();
        },
        checkPage(){
          this.$nextTick(function(){
                  if(this.preLi){
                    this.preLi.classList.remove('select');
                  }
                  if(this.$refs[this.page]){
                    this.$refs[this.page][0].classList.add('select');
                    this.preLi =  this.$refs[this.page][0];
                  }  
          })
            if(this.page === 1){
                this.$refs['pre'].classList.add('unClick');
            }else{
                this.$refs['pre'].classList.remove('unClick');
            }
            if(this.page>=this.totalPage){
                this.$refs['next'].classList.add('unClick');
            }else{
                this.$refs['next'].classList.remove('unClick');
            }
        },
        setPageList(liSize){
          //liSize代表每页有多少个
          this.pageList = [];
          for(let i = this.page;i<=this.totalPage&&i<=liSize+this.page-1;i++){
              this.pageList.push(i);
          }
          var beforeLi = liSize-this.pageList.length;
          for(let i = this.page-1;i>=1&&i>=this.page-beforeLi;i--){
              this.pageList.unshift(i);
          }
        },
        initial(list){
          for(let item of list){
            item.user_reset = false;
            console.log(item);
          }
        }
    },
    components:{
      empty
    },
    created(){
      this.getInfo();
    }
}
</script>

<style scoped>
#findPage{
    margin-top: 3%;
    width:100%;
    display: flex;
    text-align: center;
    justify-content: center;
  }
  #findPage li{    
    margin-right: 20px;
    cursor: pointer;
    border:1px solid rgb(221, 221, 221);
    color: #686fbf;
    padding: 10px;
  }
  #findPage li:hover{
    background-color: rgb(238, 238, 238);
    color: rgb(9, 95, 138);
  }
  #findPage .unClick{
    color: #777;
    cursor:not-allowed;
  }
  #findPage .unClick:hover{
    color:#777;
  }
  #findPage .select{
    color: #fff;
    background-color: #686fbf;
  }
  #findPage .select:hover{
    color: #fff;
    background-color: #686fbf;
  }
  #empty{
    margin: -10px -33px;
    border-radius: 7px;
    padding: 10px;
 }
</style>

