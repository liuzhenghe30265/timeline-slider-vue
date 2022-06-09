# 带拖动功能的时间轴

timeline-slider-vue

![](https://tva1.sinaimg.cn/large/e6c9d24ely1h30killxsuj21ks08qq3m.jpg)

[Demo](https://liuzhenghe30265.github.io/timeline-slider-vue/)

[Github](https://github.com/liuzhenghe30265/timeline-slider-vue.git)

## 环境

-   node V12.20.0
-   npm 6.14.8

## 📦 Install

```bash
npm install --save timeline-slider-vue
```

### 全局引用

main.js

```js
import DragTimelineVue from 'timeline-slider-vue'
import 'timeline-slider-vue/lib/timeline-slider-vue.css'
Vue.use(DragTimelineVue)
```

## 🔧 Usage

```
    <DragTimelineVue
      :mask="true"
      :date="date"
      :mark-date="markDate"
      :lock-date="lockDate"
      @change="handleChange"
      @input="handleInput">
      <div
        slot="sliderContent"
        slot-scope="scope">
        {{scope.data}}
      </div>
    </DragTimelineVue>
```

[使用示例](https://github.com/liuzhenghe30265/timeline-slider-vue/blob/main/examples/App.vue)

```vue
<template>
	<div id="app">
		<DragTimelineVue
			:date="date"
			:mask="mask"
			:mark-date="markDate"
			:lock-date="lockDate"
			@change="handleChange"
			@input="handleInput"
		>
			<div slot="sliderContent" slot-scope="scope">
				{{ scope.data }}
			</div>
		</DragTimelineVue>
	</div>
</template>

<script>
export default {
	data() {
		return {
			lockDate: [], // 锁定的日期（滑动结束时自动跳到指定的日期）
			markDate: [], // 做标记的日期
			mask: true,
			date: '2022-06-01',
		}
	},
	methods: {
		handleInput(value, date) {
			console.log('........input', value, date)
		},
		handleChange(value, date) {
			console.log('........change', value, date)
		},
	},
}
</script>
```

## Available props

| **参数**  | **类型** | **默认值** | **说明**                                                                                                                              |
| :-------- | :------: | :--------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| date      |  String  | ''         | yyyy-MM-dd 格式的日期，根据传入的日期，设置滑块的位置                                                                                 |
| mask      | Boolean  | true       | 拖动过程中是否显示遮罩层                                                                                                              |
| mark-date |  Array   | []         | 一些特殊日期标注，例如 ['2022-03-08', '2022-06-18', '2022-11-11']                                                                     |
| lock-date |  Array   | []         | 锁定的日期，只能在指定日期下切换，当滑块拖动到其他位置，自动跳到离指定日期最近的日期处例如 ['2022-03-08', '2022-06-18', '2022-11-11'] |

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
