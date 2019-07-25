<template>
    <div v-if="listEmpty(plist)">
        <h2>亲亲,这里暂时没有内容哦~</h2>
    </div>
</template>
<script>
export default {
    name:'empty',
    props:['plist'],
    data(){
        return{

        }
    },
    methods:{
        listEmpty(list){
        return list.length===0;
      }
    },
}
</script>

<style scoped>
h2{
    letter-spacing: 2px;
    margin-left: 2%;
    margin-top: 1%;
    color: #6e6e74;
}
</style>
