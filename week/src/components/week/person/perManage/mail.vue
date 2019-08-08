<template>
    <div id="contain">
        <busy2
              width='75%'
              v-if="list.length===0"
        ></busy2>
       <div id="new" v-else>
           <h3>新的成员</h3>
           <div class="message" v-for="(item,i) in list" :key ="i">
               <img :src="item.pic" alt="">
               <div>
                    <p id="name">{{item.user_name}}</p>
                    <p>
                        申请加入
                        {{item.mes_learningDirection}}
                        组
                    </p>
               </div>
               <button v-if="!item.mes_agree"@click="getInfo(item.user_id,item.mes_learningDirection,item.mes_id)">同意</button>
               <span v-else>已同意</span>
           </div>
       </div>
    </div>
</template>
<script>
import busy2 from '../../../busy2'
  export default {
    name: 'mail',
    data () {
        return{
            show:false
        }
    },
    computed:{
        list:function(){
            console.log(window.localStorage.getItem('list'));
            return JSON.parse(window.localStorage.getItem('list'));
        }
    },
    methods:{
        getInfo:function(userId,learningDirection,mesId){
            this.$axios.get('weekly_war/user/admit.do?userId='+userId+'&mlearningDirection='+learningDirection+"&mesId="+mesId).then((res)=>{
                console.log(res);
            })
        }
    },
    components:{ 
        busy2
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
    .message div{
        display: flex;
        flex: auto;
        flex-direction: column;
        justify-content: flex-start;
    }
    .message button{
        padding:5px  10px;
        margin-right: 2%;
        border-radius: 7px;
        border: 1px solid rgba(0, 0, 0, 0.12);
    }
    .message span{
        padding:5px  10px;
        margin-right: 2%;
    }
    .message:hover{
        background-color: rgba(104,111,191, .1);
    }
</style>
