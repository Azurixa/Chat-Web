/*
* Chat APP front-end based on VUE-js framework
*
* Coded entirely by Mateusz Ożóg
* Github project: https://github.com/Azurixa/Chat-Web
*
* Covered under MIT licence
*/

window.Vue = require('vue');

// Auth components
Vue.component(
    'login', require('./components/auth/Login.vue').default
);
Vue.component(
    'register', require('./components/auth/Register.vue').default
);

// Chat VUE
Vue.component(
    'chat', require('./components/Chat.vue').default
);

const app = new Vue({
    el: '#app'
});