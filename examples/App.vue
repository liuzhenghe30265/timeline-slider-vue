<template>
  <div
    id="app">
    <TimelineSliderVue
      :date="date"
      :mask="mask"
      :mark-date="markDate"
      :lock-date="lockDate"
      @change="handleChange"
      @input="handleInput">
      <div
        slot="sliderContent"
        slot-scope="scope">
        {{ scope.data }}
      </div>
    </TimelineSliderVue>
  </div>
</template>

<script>
import {
  dateFormat
} from '../packages/TimelineSliderVue/src/utils.js'
export default {
  name: 'App',
  components: {},
  data () {
    return {
      lockDate: [], // 锁定的日期（滑动结束时自动跳到指定的日期）
      markDate: [], // 做标记的日期
      mask: true,
      date: dateFormat(new Date(), 'yyyy-MM-dd')
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    handleInput (value, date) {
      console.log('........input', value, date)
    },
    handleChange (value, date) {
      console.log('........change', value, date)
    }
  }
}
</script>
