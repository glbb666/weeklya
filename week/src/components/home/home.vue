 <template>
      <div id="main">
        <div id="left">
        <img src="../../../static/1/intelligence.png" alt="">
        </div>
        <div id="right">
        <div id="top">
            <img src="../../../static/2/wn.png" alt="">
        </div>
        <router-view></router-view>
        </div>
    </div>
 </template>
<script>
export default {
  name: 'home'
}
</script>
<style scoped>
  #left{
    width: 50%;
    height: 100%;
    background-color: #e5e6f4;
    flex-grow: 1;
  }
  #left img{
    margin-left: 15%;
    margin-top: 12%;
    width: 65%;
  }
  #right{
    height: 100%;
    width: 50%;
  }
  #right #top{
    width: 100%;
    flex-shrink: 0;
  }
  #right #top img{
    margin-left: 20%;
    margin-top: 20%;
    width: 60%;
  }

</style>
