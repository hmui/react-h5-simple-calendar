# react-h5-simple-calendar

[简体中文](https://github.com/hmui/react-h5-simple-calendar/blob/main/README.md) | English

###

A react-based mobile, h5 calendar display component

### react Mobile calendar component

1. Support week view, week calendar
2. Support month view, month calendar
3. Support sliding left and right to switch months
4. Support sliding up and down to switch calendar view
5. Support dot mark on the calendar
6. This project is based on[dumi](https://github.com/umijs/dumi) build & deploy
7. based on[dayjs](https://github.com/iamkun/dayjs)Processing calendar logic

### Install

`yarn add react-h5-simple-calendar | npm i react-h5-simple-calendar`

```js
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

### Settings

| parameter            | description                                                                        | default                                                              |
| :------------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| `currentDate`        | The currently selected date (default today) is used with onChange. eg:`2024-02-19` |                                                                      |
| `showType`           | display type`month` & `week`                                                       | `'month'`                                                            |
| `transitionDuration` | Animation transition time for switching date                                       | `0.3`                                                                |
| `onChange`           | Date selected callback                                                             | `(dateStr: string, date: dayjs.Dayjs) => {}`                         |
| `onTouchStart`       | Swipe to start callback                                                            | `() => {}`                                                           |
| `onTouchMove`        | Callback during sliding                                                            | `() => {}`                                                           |
| `onSlideChange`      | Sliding end callback                                                               | `({ range: [string, string], date: string, dateStr: string }) => {}` |
| `onToggleShowType`   | Switch the monthly and weekly view callbacks                                       | `({ showType: string, startTime: string, endTime: string }) => {}`   |
| `markType`           | Mark type `dot`&`circle`                                                           | `'dot'`                                                              |
| `markDates`          | Array of dates to be marked                                                        | `[]`                                                                 |
| `disableView`        | The monthly and weekly views cannot be switched                                    | `false`                                                              |
| `language`           | Language 'zh-CN'、'en-US'                                                          | `'zh-CN'`                                                            |
| `customHeader`       | Custom header（< 2024-02 >），boolean、({ dateStr, date }) => ReactNode            | `false`                                                              |

### `markDates` Parameter Description

```js
const markDates = [
  { color: '#459', date: '2024-01-02', markType: 'circle' },
  { color: '#a8f', markType: 'dot', date: '2023-12-31' },
  { color: '#a5f', markType: 'circle', date: '2024-02-05' },
  { date: '2024-02-06' },
];
```

1.  If the date is not passed `markType`, the passed `Marktype` will be taken by default
2.  Single date does not pass `color` The default is `#168eef`

## Sponsor

![pay.jpg](./pay.png)
