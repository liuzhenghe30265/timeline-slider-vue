/**
 * @description: 日期格式化
 * @msg
 * 对 Date 的扩展，将 Date 转化为指定格式的 String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
    console.log(dateFormat(new Date())) // 2021-12-07 16:02:18
    console.log(dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S')) // 2021-12-07 16:02:18.912
    console.log(dateFormat(new Date(), 'yyyy-MM-dd E HH:mm:ss')) // 2021-12-07 二 16:02:18
    console.log(dateFormat(new Date(), 'yyyy-MM-dd EE hh:mm:ss')) // 2021-12-07 周二 16:02:18
    console.log(dateFormat(new Date(), 'yyyy-MM-dd EEE hh:mm:ss')) // 2021-12-07 星期二 16:02:18
    console.log(dateFormat(new Date(), 'yyyy-M-d h:m:s.S')) // 2021-12-7 16:2:18.912
 * @param {String, Number} date 日期
 * @param {String} format 格式
 * @return {String}
 */
export function dateFormat (date, format) {
  let iDate = null
  if (typeof date === 'number') {
    iDate = new Date(date)
  } else if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
    if (date.indexOf('T') > -1) {
      const dotIndex = date.indexOf('.')
      date = date.substr(0, dotIndex)
      date = date.replace('T', ' ')
      date = new Date(date).getTime()
    }

    if (!isNaN(Number(date))) {
      date = Number(date)
    }

    iDate = new Date(date)
  } else if (date instanceof Date) {
    iDate = date
  } else {
    return false
  }

  const o = {
    'M+': iDate.getMonth() + 1, // 月份
    'd+': iDate.getDate(), // 日
    'h+': iDate.getHours() % 24 === 0 ? '00' : iDate.getHours() % 24, // 小时
    'H+': iDate.getHours(), // 小时
    'm+': iDate.getMinutes(), // 分
    's+': iDate.getSeconds(), // 秒
    'q+': Math.floor((iDate.getMonth() + 3) / 3), // 季度
    S: iDate.getMilliseconds() // 毫秒
  }

  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss'
  }
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (iDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') +
      week[iDate.getDay() + '']
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }

  return format
}

/**
* @description: 获取最近几天的日期
* @msg 需要依赖 dateFormat()
* @param {Number} count 天数
* @param {String} type 默认（向后计算）；before（向前计算）
* @return {Array}
* eg:
console.log(getManyDays(5)) // ['2021-12-07', '2021-12-08', '2021-12-09', '2021-12-10', '2021-12-11']
console.log(getManyDays(5, 'before')) // ['2021-12-03', '2021-12-04', '2021-12-05', '2021-12-06', '2021-12-07']
*/
export function getManyDays (count, type) {
  if (!isNaN(Number(count))) {
    count = Number(count)
  }
  const list = []
  if (type && type === 'before') {
    for (let i = 0; i < count; i++) {
      list.unshift(
        dateFormat(
          new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString(),
          'yyyy-MM-dd'
        )
      )
    }
  } else {
    for (let i = 0; i < count; i++) {
      list.push(
        dateFormat(
          new Date(new Date().setDate(new Date().getDate() + i)).toLocaleDateString(),
          'yyyy-MM-dd'
        )
      )
    }
  }
  return list
}

/**
 * @name: 判断某年某月 1 号是星期几
 * @param {year}
 * @param {month}
 * eg:
    console.log(judjeFirstDay(2021, 12)) // 3
 */
export function judjeFirstDay (year, month) {
  const date = new Date(year, month - 1, 1)
  const week = date.getDay()
  return week
}

/**
 * @name: 生成某年某月日历表
 * @msg 需要依赖 judjeFirstDay()
 * @param {*} year
 * @param {*} month
 * @param {*} startDay 从哪天开始展示（默认从周日）
 */
export function createCalendar (year, month, startDay) {
  // 某个月一共有多少天
  const allDay = new Date(year, month, 0).getDate()
  // 某个月 1 号是星期几
  const firstDay = judjeFirstDay(year, month)
  // 需要多少行来展示
  const row = Math.ceil((allDay + firstDay) / 7)
  let k = firstDay
  if (startDay) {
    // 如果从周一开始展示
    k = firstDay - 1
  }
  const result = []
  let count = 1
  // 生成日历二维数组
  for (let i = 0; i < row; i++) {
    result[i] = new Array(7)
    do {
      if (count <= allDay) {
        result[i][k] = {
          day: count,
          date: year + '-' + month.toString().padStart(2, '0') + '-' + count.toString().padStart(2, '0')
        }
        k++
        count++
      } else {
        break
      }
    } while (k < 7)
    k = 0
  }
  return result
}

/**
 * @name: 生成某年日历表
 * @msg 需要依赖 judjeFirstDay(), createCalendar()
 * @param {*} year
 */
export function createCalendarOfYear (year) {
  const result = []
  for (let index = 1; index < 13; index++) {
    const _month = index.toString().padStart(2, '0')
    result.push(createCalendar(year, _month))
  }
  return result
}

/**
 * @name: 把生成的日历表转换为一维数组（可以通过日期找出在这一年中的位置）
 * @msg 需要依赖 createCalendarOfYear(), createCalendar()
 * @param {*} year, month
 */
export function calendarToList (year, month) {
  const result = []
  let calendarData = []
  if (year && month) {
    calendarData = createCalendar(year, month)
  } else if (year && !month) {
    calendarData = createCalendarOfYear(year)
  }
  if (calendarData && calendarData.length) {
    calendarData.map((month) => {
      if (month && month.length > 0) {
        month.map((week) => {
          if (week && week.length > 0) {
            week.map((day) => {
              result.push(day.date)
            })
          }
        })
      }
    })
  }
  return result
}

/**
 * @description: 获取某年某月开始与结束日期
 * @msg 需要依赖 dateFormat()
 * @param {Number, String} year
 * @param {Number, String} month
 * @return {Object}
 * eg:
    console.log(getStartAndEndDate(2021, 12)) // {startTime: '2021-12-01', endTime: '2021-12-31'}
 */
export function getStartAndEndDate (year, month) {
  let startTime = null
  let endTime = null
  let result = {}
  if (month) {
    const date = new Date(year, month - 1, '01')
    date.setDate(1)
    date.setMonth(date.getMonth() + 1)
    endTime = new Date(date.getTime() - 1000 * 60 * 60 * 24)
    const _a_month = month < 10 ? '0' + month : month // ios Date() 对象必须是两位的月份，需要补 0，否则提示 Invalid Date
    startTime = new Date(year + '-' + _a_month + '-' + '01')
  } else {
    startTime = new Date(year + '-' + '01' + '-' + '01')
    endTime = new Date(year + '-' + '12' + '-' + '31')
  }
  result = {
    startTime: dateFormat(startTime, 'yyyy-MM-dd'),
    endTime: dateFormat(endTime, 'yyyy-MM-dd')
  }
  return result
}

/**
 * @description: 计算时间间隔
 * @param {String} date 日期格式 2020-01-01 18:00
 * @return {String}
 * eg:
    console.log(getDateInterval('2020-01-01 18:00')) // 705天前
 */
export function getDateInterval (date) {
  if (!date) return ''
  let t
  if (date.indexOf(':') < 13) {
    t = (new Date().getFullYear() + '-' + date).substring(0, 16)
  } else {
    t = date.substring(0, 16)
  }
  const now = new Date().getTime()
  const thatTime = Date.UTC(
    t.substring(0, 4),
    parseInt(t.substring(5, 7)) - 1,
    t.substring(8, 10),
    parseInt(t.substring(11, 13)) - 8,
    t.substring(14, 16),
    0
  ) // 月份 -1; 小时减 8
  const tSu = (thatTime - now) / 1000 // 秒
  if (tSu > 0) {
    const _d = tSu / (60 * 60 * 24) // 天
    const _a = tSu / (60 * 60) // 小时
    const _m = tSu / 60 // 分钟
    if (_d > 1) {
      return parseInt(_d) + '天后'
    } else if (_a > 1) {
      return parseInt(_a) + '小时后'
    } else if (_m > 1) {
      return parseInt(_m) + '分钟后'
    } else {
      return ''
    }
  } else {
    const _d = tSu / (60 * 60 * 24) // 天
    const _a = tSu / (60 * 60) // 小时
    const _m = tSu / 60 // 分钟
    if (_d < -1) {
      return -parseInt(_d) + '天前'
    } else if (_a < -1) {
      return -parseInt(_a) + '小时前'
    } else if (_m < -1) {
      return -parseInt(_m) + '分钟前'
    } else {
      return ''
    }
  }
}

/**
 * @name: 计算出一年的所有日期及位置
 * @msg
 * @param {*} year
 * @param {*} markDate 需要标注的日期：['2022-02-28', '2022-03-01']
 */
export function createCalendarAndPosition (year, markDate) {
  const calendar = createCalendarOfYear(year)
  const days = numberOfDays(year)
  const _arr = []
  const result = []
  calendar.map((month, index) => {
    _arr.push({
      index,
      list: concatArrFun(month).filter(_ => _)
    })
  })
  _arr.map((month, monthIndex) => {
    month.list.map((day) => {
      const _obj = {
        date: day.date
      }
      if (day.day === 1) {
        // 如果是首日，添加上月份
        _obj.label = Number(monthIndex + 1) + '月'
      }
      if (markDate && markDate.length > 0) {
        // 给一些特殊日期做标记
        if (markDate.indexOf(day.date) > -1) { _obj.mark = true }
      }
      result.push(_obj)
    })
  })
  result.map((day, index) => {
    day.index = index
    day.position = getPercentage(index, days)
  })
  return result
}

/**
 * @name: 计算一年有多少天
 * @param {year}
 */
export function numberOfDays (year) {
  return isLeapYear(year) ? 366 : 365
}

/**
 * @name: 判断平年润年
 * @param {year}
 */
export function isLeapYear (year) {
  return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
}

/**
 * @name: 合并数组
 * @param {*} arr
 */
export function concatArrFun (arr) {
  if (arr && arr.length > 0) {
    const result = arr.reduce((a, b) => {
      return a.concat(b)
    })
    return result
  }
}

/**
 * @name: 计算百分比
 * @param {*} num
 * @param {*} total
 */
export function getPercentage (num, total) {
  if (num === 0 || total === 0) {
    return 0
  }
  return (Math.round(num / total * 10000) / 100.00) // 小数点后两位百分比
}
