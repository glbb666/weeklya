import Vue from 'vue'//引入vue
import Vuex from 'vuex'//引入vuex
//使用vuex
Vue.use(Vuex);
const store = new Vuex.Store({
    state:{
        pop:{
            popif:false,
            words:'',
            type:0
        },
        pageList:[],
        messageList:[],
        messageCount:0
    },
    getters:{//等于vue的computed
        getStateTime:function(state){
            console.log(state);
           return state.time;
        }
    },
    mutations:{
        //    Vue 建议我们mutation 类型用大写常量表示，修改一下，把mutation 类型改为大写
        SHOWPOP(state,newpop){
            state.pop = newpop;
        },
        SETPAGE(state,newPageList){
            state.pageList = newPageList;
        },
        SETMESSAGE(state,newMessageList){
            state.messageList = newMessageList;
            window.localStorage.setItem('list',JSON.stringify(newMessageList));
        },
        SETMESCOUNT(state,newMessageCount){
            state.messageCount = newMessageCount;
            window.localStorage.setItem('msgCount',JSON.stringify(newMessageCount));
        }
    },
    actions:{
        showpop(context,newpop){
            context.commit('SHOWPOP',newpop);
        },
        setPage(context,newPageList){
            context.commit('SETPAGE',newPageList);
        },
        setMessage(context,newMessageList){
            context.commit('SETMESSAGE',newMessageList)
        },
        setMesCount(context,newMessageCount){
            context.commit('SETMESCOUNT',newMessageCount)
        }
    }
}) 
export default store