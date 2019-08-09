<template>
    <div class="agreeBtn">
        <ul v-show="show">
            <li>
                <button @click="getInfo(userId,mlearningDirection,mesId,1)">同意</button>
            </li>
            <li>
                <button @click="getInfo(userId,mlearningDirection,mesId,-1)">拒绝</button>
            </li>
        </ul>
        <button id="agree" @click="getInfo(userId,mlearningDirection,mesId,1)">
            同意
            <button id = "select" @click.stop="show=true">
                <i class="el-icon-caret-bottom"></i>
            </button>
        </button>
    </div> 
</template>
<script>
import {showPopRight,showPopError} from '../../../../../../static/pop'
import { exit } from '../../../../../assets/common';
import myLocalStorage from '../../../../../assets/myStorage'
import myStorage from '../../../../../assets/myStorage';
export default {
    name:'agreeBtn',
    data(){
        return {
            show:false
        }
    },
    props:['userId','mlearningDirection','mesId',"pi"],
    watch:{
        'show':function(newshow,oldshow){
            var showFunc = ()=>{
                    this.show=false;
            };
            if(newshow){
                document.addEventListener('click',showFunc);
            }else{
                document.removeEventListener('click',showFunc);
            }
        }
    },
    methods:{
        getInfo:function(userId,learningDirection,mesId,agree){
            this.$axios.get('weekly_war/user/admit.do?userId='+userId+'&mlearningDirection='+learningDirection+"&mesId="+mesId+"&agree="+agree).then((res)=>{
                res=res.data;
                if(res.success){
                    this.resetAgree(agree)
                }else{
                    if(res.code===1000){
                        showPopError('未登录',this);
                        exit(this);
                        return;
                    }
                    if(res.agree===2){
                        showPopError('此人已成为别组成员',this);
                        this.resetAgree(agree);
                    }
                    showPopError(res.msg,this);
                }
            })
        },
        resetAgree(agree){
            let list = myStorage.getItem('list');
            list[this.pi].mes_agree = agree;
            myStorage.setItem('list',list,this);
        }
    }
}
</script>

<style scoped>
    .agreeBtn{
        position: relative;
        width: 120px;
    }
    .agreeBtn ul{
       box-shadow:  0 2px 12px 0 rgba(0, 0, 0, 0.1);
       background-color: #fff;
       flex-direction: column;
       position: absolute;
       bottom: -100px;
       z-index: 100px;
       z-index: 100px;
    }
    
    .agreeBtn ul li button{
        display: flex;
        padding: 10px 30px;
        justify-content: center;
        align-items: center;
    }
    .agreeBtn ul li button:hover{
       background-color: rgba(0,0,0,.05);
    }
    #agree{
        padding:5px  15px;
        border-radius: 7px;
        background-color: #686fbf;
        color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.12);
    }
    #agree:hover{
        background-color: rgba(104,111,191,.8);
    }
    #agree #select i{
        display: flex;
        color: #fff;
        font-size: 12px; 
        padding: 1px 3px;
        justify-content: center;
        align-items: center;
    }
    #agree:hover #select{
        background-color:rgba(255,255,255,.6);
        border-radius: 3px;
    }
</style>

