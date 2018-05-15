// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSocketio from 'vue-socket.io';

Vue.config.productionTip = false
Vue.use(VueSocketio, 'http://localhost:9090')
Vue.use(BootstrapVue)

/* eslint-disable no-new */
 new Vue({
   el: '#app',
   router,
   components: { App },
   template: '<App/>'
 })

//var vm = new Vue({
//  socket:{
//    connect: function(){
//      console.log('socket connected.')
//    },
//    fromServer: function(val){
//      console.log('Server: '+val)
//    }
//  },
//  methods:{
//    buttonClicked: function(val){
//      this.$socket.emit("fromClient", val);
//    }
//  }
//
//})
