import Vue from 'vue'
import App from './App'
// import VueRouter from 'vue-router'
// import router from './router'
// import '@mdi/font/css/materialdesignicons.css'
import lqForm from 'lq-form'
import store from '../store'
import './axios'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css' // import the croppie css manually
import lqElementUi from '../main'

import helper from 'vuejs-object-helper'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Object.defineProperty(
    Vue.prototype, 
    '$helper', 
    { 
        value: helper 
    }
);
Vue.use(VueCroppie)
Vue.use(lqForm, { store })

Vue.use(ElementUI);

Vue.config.performance = false

Vue.use(lqElementUi)
// Vue.use(VueRouter)

new Vue({
    store,
    render(h) {
        return h(App)
    },
    // router
}).$mount('#app')
