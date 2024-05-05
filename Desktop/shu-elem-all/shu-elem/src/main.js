import { createApp } from 'vue'
import App from './App.vue'
// import Vue from "vue"
import router from './router'
import ElementPlus,{ElMessage,ElMessageBox} from 'element-plus'
import 'element-plus/dist/index.css'
// import 'element-ui/lib/theme-chalk/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



import axios from 'axios'

const API = axios.create({
	baseURL:'http://127.0.0.1:8888/api/private/v1/', //请求后端数据的基本地址，自定义
	timeout: 5000,                   //请求超时设置，单位ms
    headers:{
        'Authorization': window.sessionStorage.getItem("token"),
    }
})
API.interceptors.request.use(config=>{
    config.headers.Authorization=window.sessionStorage.getItem("token");
    return config;
})

const app=createApp(App)
app.use(ElementPlus)
app.use(router)
// app.use(quillEditor)
// Vue.use(VueQuillEditor)
app.config.globalProperties.$http=API;
app.config.globalProperties.$message=ElMessage;
console.log(ElementPlus);
app.config.globalProperties.$confirm=ElMessageBox.confirm;
app.config.globalProperties.$alert=ElMessageBox.alert;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
      let context = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
  
  const _ResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
      callback = debounce(callback, 16);
      super(callback);
    }
  }
// Vue.component('tree-table', TreeTable) //注册组件

app.mount('#app')
