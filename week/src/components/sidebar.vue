<template>
  <div class="about">
    <div id="title">{{title}}</div>
    <div id="content">
      <!--侧边栏-->
      <div id="sidebar">
        <ul>
          <li v-for="(item,i) in ableTo" :key="i">
            <router-link :to="item">
             <i class="el-icon-message" v-if="i===2&&notBig&&className==='quick'"></i>
            <span
              :class=[className]
              v-if="i!==2||!notBig||className!=='quick'"
            >  
            </span>{{nameArr[i]}}</router-link>
          </li>
        </ul>
      </div>
      <router-view id="contain"></router-view>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  // Vue.prototype.$qs = qs
  export default{
    name: 'sidebar',
    props:['title','toArray','name','ok','className','notBig'],
    data () {
      return {
        'nameArr':[]
      }
    },
    computed:{
        ableTo:function(){
            let arr = [];
            let length = this.toArray.length;
            for(let i = 0;i<length;i++){
                if(this.ok[i]){
                    arr.push(this.toArray[i]);
                    this.nameArr.push(this.name[i]);
                }
            }
            return arr;
        }
    },
    created(){
        console.log(this.toArray);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.about{
  width: 100%;
  margin-top: 55px;
}
 #title{
    height: 33px;
    font-size: 18px;
    line-height: 33px;
    background-color: #fff;
    margin-left: 35px;
    position: fixed;
  }
 #content{
    display: flex;
    width: 100%;
    margin-top: 32px;
  }
  #content h3{
    margin-left: 80px;
  }
  #sidebar{
    display: block;
    width: 200px;
    background-color: #f7f7f9;
    position: fixed;
    height: 100%;
    border-radius: 7px 7px 0 0;
  }
  #sidebar .router-link-exact-active,#sidebar .router-link-active{
    color: #686fbf;
    border-left:3px solid #686fbf;
  }
 
  #sidebar ul{
    width:200px;
  }
  #sidebar ul li{
    height: 55px;
    line-height: 55px;
    font-size: 18px;
  }
  #sidebar ul li a{
    height: 100%;
    width: 100%;
    display: block;
  }
  .click{
    border-left:3px solid #686fbf;
  }
  .select{
    color: #686fbf;
  }
  #sidebar ul li span{
    margin-left: 15px;
    display: inline-block;
     width: 30px;
     height: 24px;
     margin-bottom: -5px;
     margin-right: 10px;
  }
 #sidebar li a .workmate{
    background: url('../../static/2/workmate.png') no-repeat;
 }
 #sidebar li a.router-link-active .workmate{
    background: url('../../static/2/workmated.png') no-repeat;
 }
 #sidebar li:nth-child(1) .quick{
     background: url('../../static/2/quick.png') no-repeat;
 }
 #sidebar li:nth-child(1) a.router-link-active .quick{
     background: url('../../static/2/quicked.png') no-repeat;
 }
 #sidebar li:nth-child(2) .quick{
     background: url('../../static/2/other.png') no-repeat;
 }
 #sidebar li:nth-child(2) a.router-link-active .quick{
     background: url('../../static/2/othered.png') no-repeat;
 }
  #sidebar li:nth-child(3) .quick{
     background: url('../../static/2/my.png') no-repeat;
 }
 #sidebar li:nth-child(3) a.router-link-active .quick{
     background: url('../../static/2/myed.png') no-repeat;
 }
 #sidebar li:nth-child(4) .quick{
     background: url('../../static/2/my.png') no-repeat;
 }
 #sidebar li:nth-child(4) a.router-link-active .quick{
     background: url('../../static/2/myed.png') no-repeat;
 }
  #sidebar li:nth-child(3) i{
    color: #000;
    font-size: 28px;
    margin-left: 12px;
    margin-right: 9px;
 }
 #sidebar li:nth-child(3) a.router-link-active i{
    color: #686fbf;
 }
 #contain{
   width:100%;
   margin-left: 200px;
 }
  #contain a.router-link-exact-active{
    color: #686fbf;
  }
</style>
