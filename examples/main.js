import Vue from 'vue'
import App from './App.vue'

import TimelineSliderVue from '../packages/index'
Vue.use(TimelineSliderVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
