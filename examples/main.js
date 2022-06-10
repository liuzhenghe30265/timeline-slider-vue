import Vue from 'vue'
import App from './App.vue'

import TimelineSliderVue from '../packages/index'
Vue.use(TimelineSliderVue)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
