<template>
    <div id="thisPlan">
      <h1>本周计划</h1>
      <div class="inner" >
        <div v-for="(item,i) in pthisPlan" :key="item.weekly_taskData">
          <checkPlan 
            :item="item"
          ></checkPlan>
        </div>
      </div>
      <empty :plist="pthisPlan"
             words='记得制定计划哦~'
      ></empty>
    </div>
</template>
<script>
import empty from '../../../../../empty'
import checkPlan from './checkPlan/checkPlan'
export default {
    name:'planBox',
    data(){
        return{

        }
    },
    props:['pthisPlan'],
    components:{
      empty,
      checkPlan
    },
    created(){
      console.log(this.pthisPlan); 
    }
}
</script>

<style scoped>
#thisPlan{
   position: fixed;
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
  font-weight: 500;
   letter-spacing: 3px;
 }
 #thisPlan .inner{
  width: 100%;
 }

  #empty{
  border-radius: 7px;
  padding: 10px;
}
</style>

