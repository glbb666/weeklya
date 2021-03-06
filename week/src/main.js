// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import store from './store'
import ElementUI from 'element-ui';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(iView);


Vue.config.productionTip = false
// 配置axios
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
/* eslint-disable no-new */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';//配置全局请求头信息
axios.defaults.withCredentials=true;//允许携带cookie
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to,from,next)=>{
  var isLogin = window.localStorage.getItem('login');
  if(isLogin==='true'){
    to.meta.login[0]==='week'?next():next('/week');
  }else{
    to.meta.login[0]==='home'?next():next('/home')
    window.localStorage.clear();
  }
})


