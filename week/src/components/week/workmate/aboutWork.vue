<template>
    <mateTable
        :personList=clist
        :key="new Date().getTime()"
    ></mateTable>
</template>
<script>
import mateTable from './mateTable/mateTable'
import '../../../assets/common'
export default {
    name:'aboutWork',
    data(){
        return{
            list:null,
            type:null
        }
    },
    components:{
        mateTable
    },
    computed:{
        clist:function(){
            if(this.list){
                return this.list[this.type];
            }
        }
    },
    methods:{
        getInfo(){
            this.$axios.get('weekly_war/workmate/getWorkmate.do').then(result => {
            result = result.data
            this.list = result;
            if (result.success) {
                var _this = this;
                setTimeout(function(){
                _this.show = false;
                },1000);
               
            } else {
                showPopError('请求数据失败',this)
            }
            });
        }
    },
    created(){
        this.getInfo();
    },
    beforeRouteEnter(to,from,next){
        console.log(to);
        next(vm=>{
            vm.type = to.name;
        })
    }
}
</script>
