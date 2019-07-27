<template>
    <div v-if="listEmpty(plist)" id="empty">
        <h2>欸？(⊙﹏⊙)内容为空</h2>
        <h3>快去填写{{words}}吧！</h3>
    </div>
</template>
<script>
export default {
    name:'empty',
    props:['plist','backgroundColor','words'],
    data(){
        return{

        }
    },
    methods:{
        listEmpty(list){
        return list.length===0;
      }
    },
    mounted(){
        document.getElementById('empty').style.backgroundColor = this.backgroundColor;
    }
}
</script>

<style scoped>
h2,h3{
    letter-spacing: 2px;
    margin: 1% 2%;
    color: #6e6e74;
}
</style>
