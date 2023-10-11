<template>
  <div id="app">
    <TimelineSliderVue
      :date="date"
      :mask="mask"
      :mark-date="markDate"
      :lock-date="lockDate"
      :play="play"
      :play-speed="playSpeed"
      @change="handleChange"
      @input="handleInput"
    >
      <div
        slot="sliderContent"
        slot-scope="scope"
      >
        {{ scope.data }}
      </div>
    </TimelineSliderVue>
    <div class="operation">
      <div>
        <el-button
          type="primary"
          @click="handlePlay"
        >
          {{ play ? '暂停' : '播放' }}
        </el-button>
      </div>
      <div>
        <el-button
          type="success"
          @click="handleMark"
        >
          标记日期
        </el-button>
      </div>
      <div>
        <el-date-picker
          v-model="datePickerValue"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          @change="handleDatePickerChange"
        />
      </div>
      <div style="width:240px;">
        <div>
          <el-button
            :type="lockFlag ? 'success' : 'primary'"
            @click="handleLock"
          >
            {{ lockFlag ? '日期解锁' : '日期锁定' }}
          </el-button>
        </div>
        <div>
          只能在指定日期（绿色标注）下切换，当滑块拖动到其他位置，自动跳到离指定日期最近的日期处
        </div>
      </div>
    </div>
    <hr>
    <TimelineSliderVue
      vertical
      height="240px"
      :max-value="100"
      :min-value="0"
      :init-value="40"
      @change="handleChange"
      @input="handleInput"
    >
      <div
        slot="sliderContent"
        slot-scope="scope"
      >
        <div>{{ scope.value }}</div>
      </div>
    </TimelineSliderVue>
  </div>
</template>

<script>
import { dateFormat } from '../packages/TimelineSliderVue/src/utils.js'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      playSpeed: 1000, // 播放速度
      play: false, // 自动播放
      lockFlag: false,
      markFlag: false,
      lockDate: [], // 锁定的日期（滑动结束时自动跳到指定的日期）
      markDate: [], // 做标记的日期
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      datePickerValue: '',
      mask: true,
      date: dateFormat(new Date(), 'yyyy-MM-dd')
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handlePlay() {
      this.play = !this.play
    },
    handleLock() {
      this.lockFlag = !this.lockFlag
      if (this.lockFlag) {
        this.lockDate = ['2022-03-08', '2022-06-18', '2022-11-11']
        this.markDate = ['2022-03-08', '2022-06-18', '2022-11-11']
      } else {
        this.lockDate = []
        this.markDate = []
      }
    },
    handleMark() {
      this.markFlag = !this.markFlag
      if (this.markFlag) {
        this.markDate = ['2022-03-08', '2022-06-18', '2022-11-11']
      } else {
        this.markDate = []
        this.lockDate = []
        this.lockFlag = false
      }
    },
    handleDatePickerChange(val) {
      if (val) {
        this.date = val
      } else {
        this.date = dateFormat(new Date(), 'yyyy-MM-dd')
      }
    },
    handleInput(date, value) {
      console.log('input', date, value)
    },
    handleChange(date, value) {
      console.log('change', date, value)
    }
  }
}
</script>


<style lang="scss">
.operation {
  margin: 60px 0;
  display: flex;
  justify-content: space-between;
  text-align: center;
}
</style>
