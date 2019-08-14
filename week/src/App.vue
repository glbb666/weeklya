<template>
  <div id="app">
   <pop v-show="popobj.popif" :words="popobj.words" :type="popobj.type"></pop>
   <router-view></router-view>
  </div>
</template>
<script>
import pop from './components/pop'
export default {
  name: 'App',
  components:{
    pop
  },
  computed:{
    popobj(){
      return this.$store.state.pop;
    }
  }
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
  ul{
    list-style: none;
  }
  a,a:visited,a:hover{
    text-decoration: none;
    color: #000;
    cursor: pointer;
  }
  /*IE*/
  input::-ms-clear, input::-ms-reveal{display: none;}
  input{
    outline: none;
    border: none;
    background: none;
  }
  textarea{
    outline: none;
    resize: none;
    border: none;
    display: inline-block;
  }
  html{
    width: 100%;
    height: 100%;
  }
  body{
    width: 100%;
    height: 100%;
    font-size: 16px;
  }

  /*禁止图片选中*/
  img{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
  select{
    border: none;
    outline: none;
    background:none;
    /*去掉默认的下拉三角*/
   -webkit-appearance: none;   /* google */
    -moz-appearance: none;  /* firefox */
    appearance: none;       /* IE */
  }
  button{
    background: none;
    border: none;
    box-shadow: none;
    outline: none;
    cursor: pointer;
  }
  #app{
     width: 100%;
    height: 100%;
  }
  #main{
    width: 100%;
    height: 100%;
    display: flex;
  }
  /* 复选框初始化 */
 .el-checkbox__inner{
    width: 20px;
    height: 20px;
}
.el-checkbox{
    font-size: 20px;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #a7a7cc;
    border-color: #a7a7cc;
}
.el-checkbox__inner:hover{
    border-color: #a7a7cc;
}
.el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #a7a7cc;
}
.el-checkbox__inner::after{
    height: 14px;
    left: 8px;
}
</style>
