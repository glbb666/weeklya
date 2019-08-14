<template>
    <div class="checkPlan">
        <el-checkbox 
            v-model="checked" 
            @change="getInfo(item.weekly_id)"
        >
        </el-checkbox>
        <div>
            <div ref="checkTask" class="checkTask" v-for="(task,j) in item.weekly_taskName">
                <h3>{{item.weekly_taskName[j]}}</h3>
                <p>{{item.weekly_content[j]}}</p>    
            </div>
        </div>      
    </div>
</template>
<script>
import {showPopError} from '../../../../../../../../static/pop'
export default {
    name:'checkPlan',
    props:['item'],
    data:function(){
        return{
            checked:''
        }
    },
    methods:{
        getInfo(id){
            console.log(id);
            var ck;
            ck = this.checked?1:0;
            this.$axios.get('weekly_war/task/checkFinished?id='+id+'&checked='+ck).then(result=>{
                result = result.data;
                if (result.success) {
                    this.changeCheck('toggle');
                    this.$set(this.item,'weekly_check',ck);
                } else {
                    if(result.code===1000){
                    showPopError('未登录',this);
                    exit(this);
                    return;
                    }
                    showPopError('请求数据失败',this)
                }    
            })

        },
        changeCheck(type){
            for(let item of this.$refs.checkTask){
                if(type==="add"){
                    item.classList.add("delete");
                }else{
                    item.classList.toggle("delete");
                }
            }
        }
    },
    mounted(){
        this.checked = this.item.weekly_check===1;
        if(this.checked){
            this.changeCheck('add')
        }
    }
}
</script>
<style scoped>
.checkPlan{
    display: flex;
    padding: 20px 0;
    border-bottom:1px solid rgb(247, 247, 249);
    align-items: center;
}
.checkTask{
    padding-top: 10px;
}
.delete{
    text-decoration: line-through;
    color: #999;
}
</style>