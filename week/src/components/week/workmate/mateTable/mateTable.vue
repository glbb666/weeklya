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
            <th>状态</th>
            <th>专业班级</th>
            <th>联系电话</th>
            <th>家庭住址</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in personList" :key="item.user_id">
            <td>
              {{item.user_email}}
            </td>
            <td>
                {{item.user_state}}
            </td>
            <td>
               {{item.user_professionalClass}}
            </td>
            <td>
              {{item.user_phone}}
            </td>
            <td>
              {{item.user_address}}
            </td>
          </tr>  
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {showPopError,showPopRight} from '../../../../../static/pop'
import busy2 from '../../../busy2'

  export default {
    name: 'mateTable',
    props:['personList'],
    data () {
      return {
        show:true
      }
    },
    components:{
      busy2
    },
    created(){
      var _this = this;
      setTimeout(function(){
              _this.show = false;
      },2000);
    },
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../../../assets/style/table.css'
</style>
