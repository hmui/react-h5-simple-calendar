# react-h5-simple-calendar

<!-- [![NPM version](https://img.shields.io/npm/v/react-h5-simple-calendar.svg?style=flat)](https://npmjs.org/package/react-h5-simple-calendar)
[![NPM downloads](http://img.shields.io/npm/dm/react-h5-simple-calendar.svg?style=flat)](https://npmjs.org/package/react-h5-simple-calendar) -->

简体中文 | [English](https://github.com/hmui/react-h5-simple-calendar/blob/main/README_en.md)

###

一款基于 react 的移动端，h5 精简版日历展示组件。

### react 移动端日历组件

1. 支持周视图，周日历
2. 支持月视图，月日历
3. 支持左右滑动切换月份
4. 支持上下滑动切换日历视图
5. 支持日历上打点标记
6. 本项目基于[dumi](https://github.com/umijs/dumi) 构建和发布
7. 基于[dayjs](https://github.com/iamkun/dayjs)处理日历逻辑

### 使用教程

`yarn add react-h5-simple-calendar | npm i react-h5-simple-calendar`

```jsx
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Calendar } from 'react-h5-simple-calendar';

const SimpleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));

  return (
    <Calendar
      onChange={(dateStr, date) => setCurrentDate(dateStr)}
      showType="week"
      disableView={false}
      markDates={[
        { date: '2024-02-12', markType: 'circle' },
        { markType: 'dot', date: '2024-02-23' },
        { markType: 'circle', date: '2024-02-22' },
        { markType: 'dot', date: '2024-02-17' },
        { date: '2024-02-16' },
      ]}
      markType="dot"
      currentDate={currentDate}
      onSlideChange={(e) => console.log('onSlideChange ', e)}
      onToggleShowType={(e) => console.log('onToggleShowType ', e)}
    />
  );
};
export default SimpleCalendar;
```

### 参数设置

| 参数                 | 说明                                                                     | 默认值                                                               |
| :------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------- |
| `currentDate`        | 当前选择的日期（默认当天），搭配 onChange 使用。比如:`2024-02-19`        |                                                                      |
| `showType`           | 展示类型支持`month` 和 `week`                                            | `'month'`                                                            |
| `transitionDuration` | 切换日期的动画过渡时间                                                   | `0.3`                                                                |
| `onChange`           | 日期选中回调                                                             | `(dateStr: string, date: dayjs.Dayjs) => {}`                         |
| `onTouchStart`       | 滑动开始回调                                                             | `() => {}`                                                           |
| `onTouchMove`        | 滑动过程中回调                                                           | `() => {}`                                                           |
| `onSlideChange`      | 滑动结束回调                                                             | `({ range: [string, string], date: string, dateStr: string }) => {}` |
| `onToggleShowType`   | 切换月、周视图回调                                                       | `({ showType: string, startTime: string, endTime: string }) => {}`   |
| `markType`           | 标记类型 支持`dot`和`circle`                                             | `'dot'`                                                              |
| `markDates`          | 需要标记的日期数组                                                       | `[]`                                                                 |
| `disableView`        | 禁止切换月、周视图                                                       | `false`                                                              |
| `language`           | 语言'zh-CN'、'en-US'                                                     | `'zh-CN'`                                                            |
| `customHeader`       | 自定义日期头部（< 2024-02 >），boolean、({ dateStr, date }) => ReactNode | `false`                                                              |

### `markDates` 参数说明

```js
const markDates = [
  { color: '#459', date: '2024-01-02', markType: 'circle' },
  { color: '#a8f', markType: 'dot', date: '2023-12-31' },
  { color: '#a5f', markType: 'circle', date: '2024-02-05' },
  { date: '2024-02-06' },
];
```

1.  单个日期不传`markType` 默认取传入的`Marktype`
2.  单个日期不传`color` 默认是`#168eef`

## 赞助

![pay.jpg](./pay.png)
