<template>
    <div id="contain">
        <busy2
              width='75%'
              v-show="show"
        ></busy2>
        <empty
                v-show = "!show"
                v-if="this.$store.state.messageList.length===0"
        ></empty>
       <div id="new" 
                v-show = "!show"
                v-else
        >
           <h3>新的成员</h3>
           <div class="message" v-for="(item,i) in this.$store.state.messageList" :key ="i">
               <img :src="item.pic" alt="">
               <div class="detail">
                    <p id="name">{{item.user_name}}</p>
                    <p>
                        申请加入
                        {{item.mes_learningDirection}}
                        组
                    </p>
               </div>
               <agreeBtn 
                        v-if="item.mes_agree===0"
                        id="agreeBtn"
                        :userId="item.user_id"
                        :mlearningDirection="item.mes_learningDirection"
                        :mesId="item.mes_id"
                        :pi="i"
                >
                </agreeBtn>
               <span class="admitted" v-else-if="item.mes_agree===1">已同意</span>
               <span class="admitted" v-else-if="item.mes_agree===-1">已拒绝</span>
               <span class="admitted" v-else>已处理</span>
           </div>
       </div>
    </div>
</template>
<script>
import busy2 from '../../../busy2'
import empty from '../../../empty'
import agreeBtn from './mail/agreeBtn'
  export default {
    name: 'mail',
    data () {
        return{
            show:true,
            list:[]
        }
    },
    methods:{
        
    },
    components:{ 
        busy2,
        agreeBtn,
        empty
    },
    created(){
        setTimeout(()=>{
            this.show = false;
        },2000)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #new{
        margin:0 1%;
    }
    #new h3{
        padding: 10px 10px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.12);
    }
    .message {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    .message img{
        margin:1% 2%;
        display: inline-block;
        border-radius: 50%;
        width: 55px;
        height: 55px;
    }
    .message #name{
        color: #686fbf;
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 18px;
    }
    .message p{
        font-size: 15px;
    }
    .message .detail{
        display: flex;
        flex: auto;
        flex-direction: column;
        justify-content: flex-start;
    }
    .message .admitted{
        padding:5px  10px;
        margin-right: 3%;
    }
    .message:hover{
        background-color: rgba(104,111,191, .1);
    }
</style>
