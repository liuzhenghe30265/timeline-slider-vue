<template>
  <div class="timeline-container">
    <MainView
      v-model="value"
      class="main-view"
      :vertical="vertical"
      :mask="mask"
      :max="max"
      :date-point="datePoint"
      :height="height"
      @change="handleChange"
      @input="handleInput"
    >
      <div
        slot="sliderContent"
        class="slider-content"
      >
        <slot
          name="sliderContent"
          :data="dateValue"
          :value="value"
        />
      </div>
    </MainView>
  </div>
</template>

<script>
import { dateFormat, createCalendarAndPosition, numberOfDays } from './utils'
import MainView from './MainView.vue'
export default {
  name: 'TimelineSliderVue',
  components: {
    MainView
  },
  props: {
    initValue: {
      type: Number,
      default: 0
    },
    height: {
      type: String,
      default: ''
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxValue: {
      type: Number,
      default: 100
    },
    vertical: {
      type: Boolean,
      default: false
    },
    // 要锁定的日期
    lockDate: {
      type: Array,
      default() {
        return []
      }
    },
    // 要标记的日期
    markDate: {
      type: Array,
      default() {
        return []
      }
    },
    // 遮罩层
    mask: {
      type: Boolean,
      default: true
    },
    play: {
      type: Boolean,
      default: false
    },
    // 播放速度
    playSpeed: {
      type: Number,
      default: 1000
    },
    // 传递过来的日期
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playTimer: null,
      lock: false, // 滑块只能在指定日期下跳转
      dateValue: '', // 通过 index 计算的日期
      datePoint: [], // 一年中所有日期及所在的位置
      max: 365,
      value: 0
    }
  },
  computed: {},
  watch: {
    play(val) {
      if (val) {
        this.playTimerFun()
      } else {
        this.clearPlayTimerFun()
      }
    },
    initValue: {
      immediate: true,
      handler(value) {
        if (this.vertical) {
          this.value = value
        }
      }
    },
    maxValue: {
      immediate: true,
      handler(value) {
        if (this.vertical) {
          this.max = value
        }
      }
    },
    minValue: {
      immediate: true,
      handler(value) {
        if (this.vertical) {
          this.min = value
        }
      }
    },
    lockDate(list) {
      this.clearPlayTimerFun()
      if (this.vertical) return
      if (list && list.length > 0) {
        this.lock = true
        // 自动跳到离当前日期最近的锁定的日期处
        const nearlyDate = this.judjeMoreNearly(this.dateValue, list)
        this.sliderTo(nearlyDate)
      } else {
        this.lock = false
      }
    },
    markDate(list) {
      this.clearPlayTimerFun()
      if (this.vertical) return
      this.setCalendarAndPosition(this.getYearMonthDay(this.date).year, list)
    },
    date(val) {
      this.clearPlayTimerFun()
      if (this.vertical) return
      this.sliderTo(val)
    }
  },
  mounted() {
    if (this.vertical) return
    if (this.date) {
      this.sliderTo(this.date)
    } else {
      this.sliderTo(dateFormat(new Date(), 'yyyy-MM-dd'))
    }
  },

  methods: {
    clearPlayTimerFun() {
      if (this.playTimer) {
        clearInterval(this.playTimer)
      }
    },
    playTimerFun() {
      this.clearPlayTimerFun()
      this.playTimer = setInterval(() => {
        this.value += 1
        if (this.value > this.max) {
          this.clearPlayTimerFun()
          return
        }
      }, this.playSpeed)
    },
    // 获取年月日
    getYearMonthDay(date) {
      // 兼容 ios 设备（ios 不支持短横线格式的日期）
      const _date = JSON.parse(JSON.stringify(date)).replace(/-/g, '/')
      if (_date && _date !== '') {
        const year = dateFormat(new Date(Date.parse(_date)), 'yyyy')
        const month = dateFormat(new Date(Date.parse(_date)), 'MM')
        const day = dateFormat(new Date(Date.parse(_date)), 'dd')
        return {
          year,
          month,
          day
        }
      }
    },
    // 根据日期滑动到对应位置
    sliderTo(date) {
      // 如果滑倒其他年份，重新计算日期位置
      const year = this.getYearMonthDay(date).year
      this.currentYear = year
      this.computedDaysByYear(year)
      const index = this.getIndexByDateOfYear(date)
      this.value = index
    },
    // 通过位置找出日期
    getDateByIndexOfYear(index) {
      if (this.datePoint.length > 0) {
        let data = null
        if (index === this.datePoint.length) {
          data = this.datePoint[this.datePoint.length - 1]
        } else {
          data = this.datePoint[index]
        }
        if (data && data.date) {
          return data.date
        }
      }
    },
    // 找出某个日期在一年中的位置
    getIndexByDateOfYear(date) {
      return this.datePoint.findIndex(item => item.date === date)
    },
    // 设置日期元素（一年中所有日期的位置及特殊日期标注）
    setCalendarAndPosition(year, markDate) {
      const list = createCalendarAndPosition(year, markDate)
      this.datePoint = list
    },
    // 切换年份计算一年有多少天，设置 max 值
    computedDaysByYear(year) {
      this.max = numberOfDays(year)
      this.setCalendarAndPosition(year, this.markDate)
    },
    /**
     * 判断某个日期是否有可能存在于一个日期列表中
     * dateIsExistList ('2018-01-01', ['2018-05-06', '2018-07-08']) // true
     * dateIsExistList ('2018-01-01', ['2020-05-06', '2020-07-08']) // false
     */
    dateIsExistList(date, dateList) {
      const year = this.getYearMonthDay(date).year
      const _dateList = dateList.map(_ => this.getYearMonthDay(_).year)
      if (_dateList.indexOf(year) > -1) {
        return true
      } else {
        return false
      }
    },
    // 判断一个日期在一个日期列表中，离哪一个日期更近
    judjeMoreNearly(date, dateList) {
      let result = null
      const dateParse = Date.parse(date.replace(/-/g, '/'))
      const dateListParse = dateList.map(_ => Date.parse(_.replace(/-/g, '/')))
      dateListParse.push(dateParse)
      dateListParse.sort((a, b) => {
        return a - b
      })
      const index = dateListParse.indexOf(dateParse)
      const before = dateListParse[index - 1]
      const after = dateListParse[index + 1]
      if (before && after) {
        if (Math.abs(dateParse - before) > Math.abs(dateParse - after)) {
          result = after
        } else {
          result = before
        }
      } else if (before || after) {
        if (before) {
          result = before
        } else if (after) {
          result = after
        }
      }
      return dateFormat(new Date(result), 'yyyy-MM-dd')
    },
    handleInput(val) {
      if (this.vertical) {
        this.$emit('input', val)
        return
      }
      this.dateValue = this.getDateByIndexOfYear(val)
      this.$emit('input', val, this.dateValue)
    },
    handleChange(val) {
      if (this.vertical) {
        this.$emit('input', val)
        return
      }
      this.$emit('change', val, this.dateValue)
      if (this.lock) {
        const nearlyDate = this.judjeMoreNearly(this.dateValue, this.lockDate)
        this.sliderTo(nearlyDate)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-container {
  user-select: none;
  padding: 80px 20px;

  .main-view {
    flex-grow: 1;

    .slider-content {
      background: #409eff;
      width: max-content;
      padding: 10px;
      box-sizing: border-box;
      position: relative;
      border-radius: 4px;
      color: #fff;

      &::before {
        position: absolute;
        bottom: -6px;
        left: 50%;
        margin-left: -6px;
        content: '';
        width: 0;
        height: 0;
        border-top: 6px solid #409eff;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
      }
    }
  }
}
</style>
