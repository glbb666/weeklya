import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
//登录注册
import home from '@/components/home/home'
import register from '@/components/home/register.vue'
import login from '@/components/home/login.vue'
//快捷周报
import week from '@/components/week/week'
import aboutWeek from '@/components/week/aboutWeek/aboutWeek'
import quick from '@/components/week/aboutWeek/quick/quick'
import lastWeek from '@/components/week/aboutWeek/quick/threeWeek/lastWeek.vue'
import thisWeek from '@/components/week/aboutWeek/quick/threeWeek/thisWeek.vue'
import nextWeek from '@/components/week/aboutWeek/quick/threeWeek/nextWeek.vue'
//他人周报，引用快捷的子模块
import other from '@/components/week/aboutWeek/other/other'
//个人页面
import person from '@/components/week/person/person'
import password from '@/components/week/person/perManage/password'
import information from'@/components/week/person/perManage/information'
import administrator from '@/components/week/person/perManage/administrator'
import mail from '@/components/week/person/perManage/mail'
//同事页面
import workmate from '@/components/week/workmate/workmate'
import aboutWork from '@/components/week/workmate/aboutWork'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      meta:{
        login:['home']
      },
      component:App,
      redirect:'/home',
    },
    {
      path:'/home',
      name:'home',
      meta:{
        login:['home']
      },
      component:home,
      redirect:'/home/login',
      children:[
        {
          path:'login',
          name:'login',
          meta:{
            login:['home']
          },
          component:login
        },
        {
          path:'register',
          name:'register',
          meta:{
            login:['home']
          },
          component:register
        }
      ]
    },
    {
      path:'/week',
      name:'week',
      meta:{
        login:['week']
      },
      component:week,
      children:[
        {
          path:'/week/aboutWeek',
          name:'aboutWeek',
          meta:{
            login:['week']
          },
          component:aboutWeek,
          redirect:'/week/aboutWeek/quick',
          children:[
            {
              path:'quick',
              name:'quick',
              meta:{
                login:['week']
              },
              component:quick,
              redirect:'/week/aboutWeek/quick/thisWeek',
              children: [
                {
                  path:'lastWeek',
                  name:'lastWeek',
                  meta:{
                    login:['week']
                  },
                  component:lastWeek
                },
                {
                 path:'thisWeek',
                 name:'thisWeek',
                 meta:{
                  login:['week']
                },
                 component:thisWeek
                },
                {
                  path:'nextWeek',
                  name:'nextWeek',
                  meta:{
                    login:['week']
                  },
                  component:nextWeek
                }
              ]
            },
            {
              path:'other',
              name:'other',
              meta:{
                login:['week']
              },
              component:other
            },
            {
              path:'other/quick',
              name:'OtherQuick',
              meta:{
                login:['week']
              },
              component:quick,
              redirect:'other/quick/thisWeek',
              children: [
                {
                  path:'lastWeek',
                  meta:{
                    login:['week']
                  },
                  component:lastWeek
                },
                {
                 path:'thisWeek',
                 meta:{
                  login:['week']
                },
                 component:thisWeek
                },
                {
                  path:'nextWeek',
                  meta:{
                    login:['week']
                  },
                  component:nextWeek
                }
              ]
            }
          ]
        },
        {
          path:'person',
          name:'person',
          component:person,
          redirect:'person/information',
          children:[
            {
              path:'password',
              name:'password',
              meta:{
                login:['week']
              },
              component:password
            },
            {
              path:'information',
              name:'information',
              meta:{
                login:['week']
              },
              component:information
            },
            {
              path:'administrator',
              name:'administrator',
              meta:{
                login:['week'],
                administor:['big_administor','administor']
              },
              beforeEnter:(to,from,next)=>{
                var userStatus = window.localStorage.getItem('userStatus');
                if(to.meta.administor.includes(userStatus)){
                  next();
                }else{
                  next('/week');
                }
              },
              component:administrator
            },
            {
              path:'mail',
              name:'mail',
              meta:{
                login:['week'],
                administor:['none','administor']
              },
              beforeEnter:(to,from,next)=>{
                var userStatus = window.localStorage.getItem('userStatus');
                if(to.meta.administor.includes(userStatus)){
                  next();
                }else{
                  next('/week');
                }
              },
              component:mail
            }
          ]
        },
        {
          path: 'workmate',
          name: 'workmate',
          component: workmate,
          meta:{
            login:['week']
          },
          redirect:'workmate/pm',
          children:[
            {
              path:'pm',
              name:'pm',
              meta:{
                login:['week']
              },
              component:aboutWork
            },
            {
              path:'ios',
              name:'ios',
              meta:{
                login:['week']
              },
              component:aboutWork
            },
            {
              path:'frontEnd',
              name:'frontEnd',
              meta:{
                login:['week']
              },
              component:aboutWork
            },
            {
              path:'backEnd',
              name:'backEnd',
              meta:{
                login:['week']
              },
              component:aboutWork
            },
            {
              path:'Android',
              name:'Android',
              meta:{
                login:['week']
              },
              component:aboutWork
            }
          ]
        }
      ],
      redirect:'/week/aboutWeek'
    }
  ]
})
