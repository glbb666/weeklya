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
        task:{
            lastTask:null,
            thisTask:null,
            nextTask:null
        }
    },
    getters:{//等于vue的computed
        
    },
    mutations:{
        //    Vue 建议我们mutation 类型用大写常量表示，修改一下，把mutation 类型改为大写
        SHOWPOP(state,newpop){
            state.pop = newpop;
        },
        SETPAGE(state,newPageList){
            state.pageList = newPageList;
        }
    },
    actions:{
        showpop(context,newpop){
            context.commit('SHOWPOP',newpop);
        },
        setPage(context,newPageList){
            context.commit('SETPAGE',newPageList);
        },

    }
}) 
export default store