<template>
  <div
    class="timeline-slider"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-disabled="sliderDisabled"
    :class="{ 'is-vertical': vertical, move: dragStatus && mask }"
  >
    <div
      ref="slider"
      class="timeline-runway"
      :class="{ 'disabled': sliderDisabled }"
      :style="runwayStyle"
      @click="onSliderClick"
    >
      <div
        class="timeline-slider-bar"
        :style="barStyle"
      />
      <SliderButton
        ref="button1"
        v-model="firstValue"
        :tooltip-class="tooltipClass"
        :vertical="vertical"
      >
        <div slot="sliderContent">
          <slot name="sliderContent" />
        </div>
      </SliderButton>
      <div
        class="timeline-days"
        v-if="!vertical"
      >
        <div
          v-for="(item, index) of datePoint"
          :key="index"
          class="day-item"
          :style="{ left: item.position + '%' }"
        >
          <div class="label-text">
            <span
              v-if="item.label"
              :title="item.date"
              class="month-value"
              @click.stop="handleTimeItemClick(item)"
            >{{
              item.label }}</span>
            <span
              v-if="item.mark"
              :title="item.date"
              class="mark-value"
              @click.stop="handleTimeItemClick(item)"
            >{{
              item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import SliderButton from './SliderButton.vue'
import Emitter from './emitter'

export default {
  name: 'MainView',

  components: {
    SliderButton
  },

  mixins: [Emitter],

  inject: {
    elForm: {
      default: ''
    }
  },

  props: {
    mask: {
      type: Boolean,
      default: true
    },
    datePoint: {
      type: [Array],
      default() {
        return []
      }
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: [Number, Array],
      default: 0
    },
    showInput: {
      type: Boolean,
      default: false
    },
    showInputControls: {
      type: Boolean,
      default: true
    },
    inputSize: {
      type: String,
      default: 'small'
    },
    showStops: {
      type: Boolean,
      default: false
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    },
    debounce: {
      type: Number,
      default: 300
    },
    label: {
      type: String,
      default: ''
    },
    tooltipClass: {
      type: String,
      default: ''
    },
    marks: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      firstValue: null,
      secondValue: null,
      oldValue: null,
      dragStatus: false,
      dragging: false,
      sliderSize: 1
    }
  },

  computed: {
    stops() {
      if (!this.showStops || this.min > this.max) return []
      if (this.step === 0) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('[Element Warn][Slider]step should not be 0.')
        return []
      }
      const stopCount = (this.max - this.min) / this.step
      const stepWidth = (100 * this.step) / (this.max - this.min)
      const result = []
      for (let i = 1; i < stopCount; i++) {
        result.push(i * stepWidth)
      }
      if (this.range) {
        return result.filter(step => {
          return (
            step < (100 * (this.minValue - this.min)) / (this.max - this.min) ||
            step > (100 * (this.maxValue - this.min)) / (this.max - this.min)
          )
        })
      } else {
        return result.filter(
          step =>
            step > (100 * (this.firstValue - this.min)) / (this.max - this.min)
        )
      }
    },

    datePointList() {
      if (!this.datePoint) {
        return []
      }
      return []
    },

    markList() {
      if (!this.marks) {
        return []
      }

      const marksKeys = Object.keys(this.marks)
      return marksKeys
        .map(parseFloat)
        .sort((a, b) => a - b)
        .filter(point => point <= this.max && point >= this.min)
        .map(point => ({
          point,
          position: ((point - this.min) * 100) / (this.max - this.min),
          mark: this.marks[point]
        }))
    },

    minValue() {
      return Math.min(this.firstValue, this.secondValue)
    },

    maxValue() {
      return Math.max(this.firstValue, this.secondValue)
    },

    barSize() {
      return this.range
        ? `${(100 * (this.maxValue - this.minValue)) / (this.max - this.min)}%`
        : `${(100 * (this.firstValue - this.min)) / (this.max - this.min)}%`
    },

    barStart() {
      return this.range
        ? `${(100 * (this.minValue - this.min)) / (this.max - this.min)}%`
        : '0%'
    },

    precision() {
      const precisions = [this.min, this.max, this.step].map(item => {
        const decimal = ('' + item).split('.')[1]
        return decimal ? decimal.length : 0
      })
      return Math.max.apply(null, precisions)
    },

    runwayStyle() {
      return this.vertical ? { height: this.height } : {}
    },

    barStyle() {
      return this.vertical
        ? {
            height: this.barSize,
            bottom: this.barStart
          }
        : {
            width: this.barSize,
            left: this.barStart
          }
    },

    sliderDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },

  watch: {
    value(val, oldVal) {
      if (
        this.dragging ||
        (Array.isArray(val) &&
          Array.isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index]))
      ) {
        return
      }
      this.setValues()
    },

    dragging(val) {
      if (!val) {
        this.setValues()
      }
    },

    firstValue(val) {
      if (this.range) {
        this.$emit('input', [this.minValue, this.maxValue])
      } else {
        this.$emit('input', val)
      }
    },

    secondValue() {
      if (this.range) {
        this.$emit('input', [this.minValue, this.maxValue])
      }
    },

    min() {
      this.setValues()
    },

    max() {
      this.setValues()
    }
  },

  mounted() {
    let valuetext
    if (this.range) {
      if (Array.isArray(this.value)) {
        this.firstValue = Math.max(this.min, this.value[0])
        this.secondValue = Math.min(this.max, this.value[1])
      } else {
        this.firstValue = this.min
        this.secondValue = this.max
      }
      this.oldValue = [this.firstValue, this.secondValue]
      valuetext = `${this.firstValue}-${this.secondValue}`
    } else {
      if (typeof this.value !== 'number' || isNaN(this.value)) {
        this.firstValue = this.min
      } else {
        this.firstValue = Math.min(this.max, Math.max(this.min, this.value))
      }
      this.oldValue = this.firstValue
      valuetext = this.firstValue
    }
    this.$el.setAttribute('aria-valuetext', valuetext)

    // label screen reader
    this.$el.setAttribute(
      'aria-label',
      this.label ? this.label : `slider between ${this.min} and ${this.max}`
    )

    this.resetSize()
    window.addEventListener('resize', this.resetSize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resetSize)
  },

  methods: {
    handleTimeItemClick(date) {
      this.firstValue = date.index
      this.emitChange()
    },
    valueChanged() {
      if (this.range) {
        return ![this.minValue, this.maxValue].every(
          (item, index) => item === this.oldValue[index]
        )
      } else {
        return this.value !== this.oldValue
      }
    },
    setValues() {
      if (this.min > this.max) {
        console.error(
          '[Element Error][Slider]min should not be greater than max.'
        )
        return
      }
      const val = this.value
      if (this.range && Array.isArray(val)) {
        if (val[1] < this.min) {
          this.$emit('input', [this.min, this.min])
        } else if (val[0] > this.max) {
          this.$emit('input', [this.max, this.max])
        } else if (val[0] < this.min) {
          this.$emit('input', [this.min, val[1]])
        } else if (val[1] > this.max) {
          this.$emit('input', [val[0], this.max])
        } else {
          this.firstValue = val[0]
          this.secondValue = val[1]
          if (this.valueChanged()) {
            this.dispatch('ElFormItem', 'el.form.change', [
              this.minValue,
              this.maxValue
            ])
            this.oldValue = val.slice()
          }
        }
      } else if (!this.range && typeof val === 'number' && !isNaN(val)) {
        if (val < this.min) {
          this.$emit('input', this.min)
        } else if (val > this.max) {
          this.$emit('input', this.max)
        } else {
          this.firstValue = val
          if (this.valueChanged()) {
            this.dispatch('ElFormItem', 'el.form.change', val)
            this.oldValue = val
          }
        }
      }
    },

    setPosition(percent) {
      const targetValue = this.min + (percent * (this.max - this.min)) / 100
      if (!this.range) {
        this.$refs.button1.setPosition(percent)
        return
      }
      let button
      if (
        Math.abs(this.minValue - targetValue) <
        Math.abs(this.maxValue - targetValue)
      ) {
        button = this.firstValue < this.secondValue ? 'button1' : 'button2'
      } else {
        button = this.firstValue > this.secondValue ? 'button1' : 'button2'
      }
      this.$refs[button].setPosition(percent)
    },

    onSliderClick(event) {
      if (this.sliderDisabled || this.dragging) return
      this.resetSize()
      if (this.vertical) {
        const sliderOffsetBottom =
          this.$refs.slider.getBoundingClientRect().bottom
        this.setPosition(
          ((sliderOffsetBottom - event.clientY) / this.sliderSize) * 100
        )
      } else {
        const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left
        this.setPosition(
          ((event.clientX - sliderOffsetLeft) / this.sliderSize) * 100
        )
      }
      this.emitChange()
    },

    resetSize() {
      if (this.$refs.slider) {
        this.sliderSize =
          this.$refs.slider[`client${this.vertical ? 'Height' : 'Width'}`]
      }
    },

    emitChange() {
      this.$nextTick(() => {
        this.$emit(
          'change',
          this.range ? [this.minValue, this.maxValue] : this.value
        )
      })
    },

    getStopStyle(position) {
      return this.vertical
        ? { bottom: position + '%' }
        : { left: position + '%' }
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline-slider {
  z-index: 9;
  flex-grow: 1;
  padding: 0 20px 0 40px;
  border-radius: 3px;
  // background-image: linear-gradient(-90deg, #e4e7ed 1%, #409eff 100%),
  //   linear-gradient(#00f6ff, #00f6ff);
  background-color: #e4e7ed;

  &::before,
  &::after {
    display: table;
    clear: both;
    content: '';
  }

  &::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    visibility: hidden;
    width: 100%;
    height: 100%;
    content: '';
    transition: all 0.3s;
    opacity: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  &.move {
    &::before {
      opacity: 1;
      visibility: visible;
    }

    .slider-content {
      pointer-events: none;
    }
  }

  .timeline-runway {
    position: relative;
    display: flex;
    width: 100%;
    height: 4px;
    cursor: pointer;
    vertical-align: middle;

    .timeline-slider-bar {
      border-radius: 3px;
      // background-image: linear-gradient(-90deg, #e4e7ed 1%, #409eff 100%), linear-gradient(#00f6ff, #00f6ff);
      background-color: #409eff;
    }

    .timeline-days {
      z-index: 9;
      display: flex;

      .day-item {
        position: absolute;
        left: 0;

        .label-text {
          span {
            position: absolute;
            top: 20px;
            left: 0;
            width: max-content;
            transition: all 0.2s;
            transform: translateX(-50%);

            &::before {
              position: absolute;
              top: -23px;
              left: 50%;
              width: 10px;
              height: 10px;
              content: '';
              transform: translateX(-50%);
              border-radius: 50%;
              background-color: #409eff;
            }

            &.month-value {
              &::before {
                background-color: #409eff;
              }
            }

            &.mark-value {
              &::before {
                background-color: #67c23a;
              }
            }
          }
        }
      }
    }

    &.disabled {
      cursor: default;
    }
  }

  &.is-vertical {
    position: relative;
    background-image: initial;
    background-color: initial;
    padding: 0;

    ::v-deep {
      .timeline-runway {
        display: block;
        width: 10px;
        background-color: #e4e7ed;

        .timeline-slider-bar {
          position: absolute;
          width: 100%;
          border-radius: 0;
        }
      }

      .slider-content {
        width: auto;

        &::before {
          display: none;
        }
      }
    }
  }
}

@keyframes signAnimate {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
