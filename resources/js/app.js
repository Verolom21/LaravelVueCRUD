import Vue from "vue";

require('./bootstrap');
window.Vue = require('vue');

import App from './components/App.vue';
import Navbar from './components/parts/Navbar'
import Posts from './components/pages/posts'

Vue.component('navbar', Navbar);
Vue.component('posts', Posts);

const app = new Vue({
    el: '#app',
    render: h => h(App),
});
