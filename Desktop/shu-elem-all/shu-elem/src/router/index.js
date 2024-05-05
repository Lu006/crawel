import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../Login.vue'
import Home from '../Home.vue'
import Welcome from '../Welcome.vue';
import Users from "../components/users/Users.vue";
import Rights from "../components/power/Rights.vue";
import roles from "../components/power/Roles.vue";
import categories from "../components/goods/Categories.vue";
import params from "../components/goods/Params.vue";
import goods from "../components/goods/Goods.vue";
import add from "../components/goods/Add.vue";
import orders from "../components/orders/Orders.vue";

const routes = [
  {
    path: '/',
    redirect: '/home',
    children:[
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path:"home",
        name:"home",
        component: Home,
        redirect:"/home/welcome",
        children:[
          {
            path:"welcome",
            name:"welcome",
            component:Welcome
          },
          {
            path:"users",
            name:"users",
            component:Users
          },
          {
            path:"rights",
            name:"rights",
            component:Rights
          },
          {
            path:"roles",
            name:"roles",
            component:roles
          },
          {
            path:"categories",
            name:"categroies",
            component:categories
          },
          {
            path:"params",
            name:"params",
            component:params
          },
          {
            path:"goods",
            name:"goods",
            component:goods,
            children:[
              {
                path:"add",
                name:"add",
                component:add
              }
            ]
          },
          {
            path:"add",
            name:"add",
            component:add
          },
          {
            path:"orders",
            name:"orders",
            component:orders
          }

        ]
      }
    ]
  }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path=="/login"){
    return next();
  }else{
    const token=window.sessionStorage.getItem("token");
    if(!token){
      return next("/login")
    }else{
      return next();
    }
  }
})

export default router
