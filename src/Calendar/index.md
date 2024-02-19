## 移动端 H5 日历组件

演示:

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
