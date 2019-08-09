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
      component:App,
      redirect:'/home',
    },
    {
      path:'/home',
      name:'home',
      component:home,
      redirect:'/home/login',
      children:[
        {
          path:'login',
          name:'login',
          component:login
        },
        {
          path:'register',
          name:'register',
          component:register
        }
      ]
    },
    {
      path:'/week',
      name:'week',
      component:week,
      children:[
        {
          path:'/week/aboutWeek',
          name:'aboutWeek',
          component:aboutWeek,
          redirect:'/week/aboutWeek/quick',
          children:[
            {
              path:'quick',
              name:'quick',
              component:quick,
              redirect:'/week/aboutWeek/quick/thisWeek',
              children: [
                {
                  path:'lastWeek',
                  name:'lastWeek',
                  component:lastWeek
                },
                {
                 path:'thisWeek',
                 name:'thisWeek',
                 component:thisWeek
                },
                {
                  path:'nextWeek',
                  name:'nextWeek',
                  component:nextWeek
                }
              ]
            },
            {
              path:'other',
              name:'other',
              component:other
            },
            {
              path:'other/quick',
              component:quick,
              redirect:'other/quick/thisWeek',
              children: [
                {
                  path:'lastWeek',
                  component:lastWeek
                },
                {
                 path:'thisWeek',
                 component:thisWeek
                },
                {
                  path:'nextWeek',
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
              component:password
            },
            {
              path:'information',
              name:'information',
              component:information
            },
            {
              path:'administrator',
              name:'administrator',
              component:administrator
            },
            {
              path:'mail',
              name:'mail',
              component:mail
            }
          ]
        },
        {
          path: 'workmate',
          name: 'workmate',
          component: workmate,
          redirect:'workmate/pm',
          children:[
            {
              path:'pm',
              name:'pm',
              component:aboutWork
            },
            {
              path:'ios',
              name:'ios',
              component:aboutWork
            },
            {
              path:'frontEnd',
              name:'frontEnd',
              component:aboutWork
            },
            {
              path:'backEnd',
              name:'backEnd',
              component:aboutWork
            },
            {
              path:'Android',
              name:'Android',
              component:aboutWork
            }
          ]
        }
      ],
      redirect:'/week/aboutWeek'
    }
  ]
})
