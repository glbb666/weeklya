<template>
    <div 
        v-if="listEmpty(this.plist)" 
        id="empty"
        :style="{'backgroundColor':this.backgroundColor,'width':this.width}"
    >
            <h2>欸？(⊙﹏⊙)内容为空</h2>
            <h3>{{words}}</h3>
    </div>
</template>
<script>
export default {
    name:'empty',
    props:{
        'plist':Array,
        'backgroundColor':String,
        'words':String,
        'width':String
    },
    data(){
        return{
        }
    },
    methods:{
        listEmpty(list){
        return list.length===0;
      }
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
