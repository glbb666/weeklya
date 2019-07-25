<template>
    <div id="thisPlan">
      <h1>本周计划</h1>
      <div class="inner" >
        <div v-for="(item,i) in pthisPlan" :key="i">
          <h2>{{i+1}}.</h2>
          <div v-for="(item,j) in pthisPlan[i].weekly_taskName">
            <h3>{{pthisPlan[i].weekly_taskName[j]}}</h3>
            <p>{{pthisPlan[i].weekly_content[j]}}</p>    
          </div>
        </div>
      </div>
      <empty :plist="pthisPlan"></empty>
    </div>
</template>
<script>
import empty from '../../../../../empty'

export default {
    name:'planBox',
    data(){
        return{

        }
    },
    props:['pthisPlan'],
    components:{
      empty
    }
}
</script>

<style scoped>
#thisPlan{
   position: fixed;
   /* background-color: rgba(255,215,0,.2); */
   width: 26%;
   height: 80%;
   right: 0;
   bottom: 10%;
   padding:10px 30px;
   border-radius: 7px 0 0 7px ;
   overflow-y: auto;
   z-index: 2;
         box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

   color: #6e6e74;
  transition: all .2s linear;
 }
 #thisPlan:hover{
      transform: translate3d(0,-2px,0);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

 }
 #thisPlan h1{
   text-align: center;
   height: 55px;
   line-height: 55px;
 }
 #thisPlan .inner{
  width: 100%;
  /* height: 90%; */
 }
 #thisPlan .inner p{
    width: 100%;
    background-color: #fff;
    border-radius: 7px;
    padding: 10px;
    margin-bottom: 5px;
    word-wrap: break-word;
    position: sticky;
    top: 500px;
    background-color: #f7f7f9;
 }
 h3{
   /* height: 55px; */
   line-height: 55px;
   width: 100%;
   word-wrap: break-word;
 }
</style>

