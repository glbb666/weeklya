<template>
  <div>
    <div id="title">同事</div>
    <div id="content">
      <!--侧边栏-->
      <div id="sidebar">
        <ul>
          <li><a href="#" @click="" class="click select"><img src="../../static/2/workmated.png" alt=""><span>在职视觉组</span></a></li>
          <li><a href="#" @click=""><img src="../../static/2/workmate.png" alt=""><span>在职产品组</span></a></li>
          <li><a href="#" @click=""><img src="../../static/2/workmate.png" alt=""><span>在职前端组</span></a></li>
          <li><a href="#" @click=""><img src="../../static/2/workmate.png" alt=""><span>在职后台组</span></a></li>
          <li><a href="#" @click=""><img src="../../static/2/workmate.png" alt=""><span>在职运营组</span></a></li>
          <li><a href="#" @click=""><img src="../../static/2/workmate.png" alt=""><span>其他成员</span></a></li>
        </ul>
      </div>
      <!--主要内容-->
      <div id="contain">
        <div id="findPart">
          <div id="find">
            <input type="text" placeholder="按姓名查找" v-model="keywords">
            <img src="../../static/2/find.png" alt="">
          </div>
          <div id="findContain">
            <table>
              <thead>
              <tr>
                <th>所属组别</th>
                <th>姓名</th>
                <th>状态</th>
                <th>专业班级</th>
                <th>联系电话</th>
                <th>家庭住址</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in search(keywords)" :key="item.id">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'workmate',
    data () {
      return {
        name:'',
        keywords:'',
        list:[]
      }
    },
    methods:{
      getInfo(){
        this.$axios.get('/user/getAllUser.do').then(res => {
          console.log(res)
        });
      },
      search:function(keywords){
        var newList = [];
        this.list.forEach(item=>{
          if (item.name.indexOf(keywords)!=-1){
            newList.push(item);
          }
        });
        return newList;
      }
    },
    created(){
      this.name = localStorage.getItem('username');
      // this.getInfo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
