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


import note from '@/components/note'
import workmate from '@/components/workmate'
import history from '@/components/history.vue'
import write from '@/components/write.vue'
import meeting from '@/components/meeting.vue'
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
            // {
            //   path:'my',
            //   name:'my',
            //   component:my
            // },
            // {
            //   path:'my/content',
            //   name:'content',
            //   component:content
            // },
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
       ,
        {
          path:'note',
          name:'note',
          component:note,
          redirect:'note/history',
          children:[
            {
              path:'history',
              name:'history',
              component:history,
            },
            {
              path:'write',
              name:'write',
              component:write
            },
            {
              path:'history/meeting',
              name:'meeting',
              component:meeting
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
            }
          ]
        },
        {
          path: 'workmate',
          name: 'workmate',
          component: workmate
        }
      ],
      redirect:'/week/aboutWeek'
    }
  ]
})
