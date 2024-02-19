import dayjs from "dayjs";

declare module 'Calendar' {
  import React from "react";
  
  interface Props {
    currentDate?: string
    showType?: 'month' | 'week' = 'month'
    transitionDuration?: number = 0.3
    onChange?: (dateStr: string, date: dayjs.Dayjs) => {}
    onTouchStart?: (e: TouchEvent | MouseEvent) => {}
    onTouchMove?: (e: TouchEvent | MouseEvent) => {}
    onSlideChange?: ({ range: [string, string], date: string, dateStr: string }) => {}
    onToggleShowType?: ({ showType: string, startTime: string, endTime: string }) => {}
    markType?: 'dot' | 'circle' = 'dot'
    markDates?: []
    disableView?: boolean = false
    language?: 'zh-CN' | 'en-US' = 'zh-CN'
    customHeader?: boolean = false
  }
  
  const CalendarComponent: React.FC<Props>;
  
  export default CalendarComponent;
}
