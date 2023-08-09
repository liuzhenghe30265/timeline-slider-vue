# 带拖动和播放功能的时间轴

timeline-slider-vue

![](./pic.jpg)

[Demo](https://liuzhenghe30265.github.io/timeline-slider-vue/)

[Github](https://github.com/liuzhenghe30265/timeline-slider-vue.git)

## 环境

-   node V12.20.0
-   npm 6.14.8

## 📦 Install

```bash
npm install --save timeline-slider-vue
```

## 🔧 Usage

main.js

```js
import TimelineSliderVue from 'timeline-slider-vue'
import 'timeline-slider-vue/lib/timeline-slider-vue.css'
Vue.use(TimelineSliderVue)

```vue
    <TimelineSliderVue
      :date="date"
      :mask="mask"
      :mark-date="markDate"
      :lock-date="lockDate"
      :play="play"
      :play-speed="playSpeed"
      @change="handleChange"
      @input="handleInput">
      <div
        slot="sliderContent"
        slot-scope="scope">
        {{ scope.data }}
      </div>
    </TimelineSliderVue>
```

[使用示例](https://github.com/liuzhenghe30265/timeline-slider-vue/blob/main/examples/App.vue)

```vue
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
			<div slot="sliderContent" slot-scope="scope">
				{{ scope.data }}
			</div>
		</TimelineSliderVue>
	</div>
</template>

<script>
export default {
	data() {
		return {
			playSpeed: 1000, // 播放速度
			play: false, // 自动播放
			lockFlag: false,
			markFlag: false,
			lockDate: [], // 锁定的日期（滑动结束时自动跳到指定的日期）
			markDate: [], // 做标记的日期
			mask: true,
			date: '2022-06-01',
		}
	},
	methods: {
		handleInput(date, value) {
			console.log('input', date, value)
		},
		handleChange(date, value) {
			console.log('change', date, value)
		},
	},
}
</script>
```

### 竖向模式

```vue
    <TimelineSliderVue
      vertical
      height="240px"
      :max-value="100"
      :min-value="0"
      :init-value="40"
      @change="handleChange"
      @input="handleInput"
    >
      <div slot="sliderContent" slot-scope="scope">
        <div>{{ scope.value }}</div>
      </div>
    </TimelineSliderVue>
```

## Available props

| **参数**  | **类型** | **默认值** | **说明**                                                                                                                              |
| :-------- | :------: | :--------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| initValue |  Number  | 0          | v-model 绑定的初始值（仅在 vertical = true 时生效）                                                                                   |
| minValue  |  Number  | 0          | 最小值（仅在 vertical = true 时生效）                                                                                                 |
| maxValue  |  Number  | 100        | 最大值（仅在 vertical = true 时生效）                                                                                                 |
| date      |  String  | 当日       | yyyy-MM-dd 格式的日期，根据传入的日期，设置滑块的位置                                                                                 |
| mask      | Boolean  | true       | 拖动过程中是否显示遮罩层                                                                                                              |
| mark-date |  Array   | []         | 一些特殊日期标注，例如 ['2022-03-08', '2022-06-18', '2022-11-11']                                                                     |
| lock-date |  Array   | []         | 锁定的日期，只能在指定日期下切换，当滑块拖动到其他位置，自动跳到离指定日期最近的日期处例如 ['2022-03-08', '2022-06-18', '2022-11-11'] |
| play      | Boolean  | false      | 播放                                                                                                                                  |
| playSpeed |  Number  | 1000       | 播放速度，同 setInterval milliseconds 参数                                                                                            |

## slot

| **参数**      | **说明** |
| :------------ | :------: |
| sliderContent | 滑块内容 |

## Events

| **事件名称** |                      **说明**                      | **回调参数** |
| :----------- | :------------------------------------------------: | :----------- |
| change       | 值改变时触发（使用鼠标拖拽时，只在松开鼠标后触发） | 改变后的值   |
| input        | 数据改变时触发（使用鼠标拖拽时，活动过程实时触发） | 改变后的值   |

## Project setup

```

yarn install

```

### Compiles and hot-reloads for development

```

yarn serve

```

### Compiles and minifies for production

```

yarn build

```

### Lints and fixes files

```

yarn lint

```
