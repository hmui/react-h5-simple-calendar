import dayjs from 'dayjs';
import 'normalize.css';
import PropTypes from 'prop-types';
import React, { createRef, PureComponent } from 'react';
import { formatMonthData, formatWeekData, throttle } from '../util';
import './index.less';

import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import arrow from '../assets/arrow.svg';

dayjs.extend(weekOfYear);
dayjs.extend(weekday);
// dayjs.locale(isCN ? "zh-CN" : "en-US");

const head = {
  'zh-CN': ['一', '二', '三', '四', '五', '六', '日'],
  'en-US': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

class Calendar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentMonthFirstDay: null,
      monthDates: [], // 月日历需要展示的日期 包括前一月 当月 下一月
      currenWeekFirstDay: null,
      weekDates: [], // 周日李需要展示的日期  包括前一周 当周 下一周
      currentDate: '',
      touch: { x: 0, y: 0 },
      translateIndex: 0,
      calendarY: 0, // 于Y轴的位置
      showType: props.showType,
    };
    this.isTouching = false;
    this.calendarRef = createRef(null);

    dayjs.locale(props.language);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { currentDate } = nextProps;
    if (currentDate !== prevState.currentDate) {
      const dayjsDate = dayjs(currentDate);
      return {
        ...formatMonthData(dayjsDate),
        ...formatWeekData(dayjsDate),
        currentDate,
      };
    }
    return null;
  }

  handleTouchMove = throttle((e) => {
    if (!this.isTouching) {
      return;
    }
    e.stopPropagation();
    this.sliding = true;
    const { disableView } = this.props;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const moveX = clientX - this.touchStartPositionX;
    const moveY = clientY - this.touchStartPositionY;
    const calendarWidth = this.calendarRef.current.offsetWidth;
    const calendarHeight = this.calendarRef.current.offsetHeight;
    if (Math.abs(moveX) > Math.abs(moveY)) {
      // 左右滑动
      this.setState({ touch: { x: moveX / calendarWidth, y: 0 } });
    } else if (!disableView) {
      this.setState({ touch: { x: 0, y: moveY / calendarHeight } });
    }
    this.props.onTouchMove(e);
  }, 25);

  handleTouchStart = (e) => {
    e.stopPropagation();
    this.touchStartPositionX = e.touches ? e.touches[0].clientX : e.clientX;
    this.touchStartPositionY = e.touches ? e.touches[0].clientY : e.clientY;
    this.isTouching = true;
    this.props.onTouchStart(e);
  };

  handleTouchEnd = (e) => {
    e.stopPropagation();
    const { showType } = this.state;
    const { disableView } = this.props;
    const calendarHeight = this.calendarRef.current.offsetHeight;
    const {
      touch,
      translateIndex,
      currentMonthFirstDay,
      currenWeekFirstDay,
      currentDate,
    } = this.state;
    this.isTouching = false;
    if (this.timerout) {
      clearTimeout(this.timerout);
    }
    this.timerout = setTimeout(() => {
      this.sliding = false;
    }, 100);
    const absTouchX = Math.abs(touch.x);
    const absTouchY = Math.abs(touch.y);
    if (absTouchX > absTouchY && absTouchX > 0.15) {
      const isMonthView = showType === 'month';
      const newTranslateIndex =
        touch.x > 0 ? translateIndex + 1 : translateIndex - 1;

      if (isMonthView) {
        // 月视图
        const nextMonthFirstDay = currentMonthFirstDay[
          touch.x > 0 ? 'subtract' : 'add'
        ](1, 'month');
        const nextMonthStartDay = nextMonthFirstDay.startOf('week');
        const nextMonthEndDay = nextMonthStartDay.add(42 - 1, 'day');
        this.setState(
          {
            translateIndex: newTranslateIndex,
            ...formatMonthData(nextMonthFirstDay),
          },
          () => {
            const date = dayjs(currentDate)[touch.x > 0 ? 'subtract' : 'add'](
              1,
              'month',
            );

            this.props.onSlideChange({
              range: [
                nextMonthStartDay.format('YYYY-MM-DD'),
                nextMonthEndDay.format('YYYY-MM-DD'),
              ],
              date,
              dateStr: date.format('YYYY-MM-DD'),
            });

            this.props.onChange(date.format('YYYY-MM-DD'), date);
          },
        );
      } else {
        // 周视图
        const nextWeekFirstDay = currenWeekFirstDay[
          touch.x > 0 ? 'subtract' : 'add'
        ](1, 'week');
        const nextWeekLastDay = nextWeekFirstDay.endOf('week');
        this.setState(
          {
            translateIndex: newTranslateIndex,
            ...formatWeekData(nextWeekFirstDay),
          },
          () => {
            const date = dayjs(currentDate)[touch.x > 0 ? 'subtract' : 'add'](
              1,
              'week',
            );

            this.props.onSlideChange({
              range: [
                nextWeekFirstDay.format('YYYY-MM-DD'),
                nextWeekLastDay.format('YYYY-MM-DD'),
              ],
              date,
              dateStr: date.format('YYYY-MM-DD'),
            });

            this.props.onChange(date.format('YYYY-MM-DD'), date);
          },
        );
      }
    } else if (
      absTouchY > absTouchX &&
      Math.abs(touch.y * calendarHeight) > 50
    ) {
      if (disableView) {
        // 禁用周视图
      } else if (touch.y > 0 && showType === 'week') {
        this.setState({ showType: 'month' }, () => {
          const dataArray = this.state.monthDates[1];
          this.props.onToggleShowType({
            showType: this.state.showType,
            startTime: dataArray[0].format('YYYY-MM-DD'),
            endTime: dataArray[dataArray.length - 1].format('YYYY-MM-DD'),
          });
        });
      } else if (touch.y < 0 && showType === 'month') {
        this.setState({ showType: 'week' }, () => {
          const dataArray = this.state.weekDates[1];
          this.props.onToggleShowType({
            showType: this.state.showType,
            startTime: dataArray[0].format('YYYY-MM-DD'),
            endTime: dataArray[dataArray.length - 1].format('YYYY-MM-DD'),
          });
        });
      }
    }
    this.setState({ touch: { x: 0, y: 0 } });
  };

  handleMonthToggle = (type) => {
    const { currentMonthFirstDay, currenWeekFirstDay, showType, currentDate } =
      this.state;
    const isMonthView = showType === 'month';
    const isPrev = type === 'prev';
    const formatFun = isMonthView ? formatMonthData : formatWeekData;
    const operateDate = isMonthView ? currentMonthFirstDay : currenWeekFirstDay;
    const updateStateData = formatFun(
      operateDate[isPrev ? 'subtract' : 'add'](
        1,
        isMonthView ? 'month' : 'week',
      ),
    );
    this.setState(updateStateData, () => {
      const dataArray =
        updateStateData[isMonthView ? 'monthDates' : 'weekDates'][1];
      const date = dayjs(currentDate)[isPrev ? 'subtract' : 'add'](
        1,
        isMonthView ? 'month' : 'week',
      );

      this.props.onSlideChange({
        range: [
          dataArray[0].format('YYYY-MM-DD'),
          dataArray[dataArray.length - 1].format('YYYY-MM-DD'),
        ],
        date,
        dateStr: date.format('YYYY-MM-DD'),
      });

      this.props.onChange(date.format('YYYY-MM-DD'), date);
    });
  };

  handleDayClick = (date) => {
    if (this.sliding) {
      return;
    }
    date = typeof date === 'string' ? dayjs(date) : date;
    this.props.onChange(date.format('YYYY-MM-DD'), date);
  };

  handleBottomOperate() {}

  onExpandClick = () => {
    const { showType } = this.state;
    this.setState({ showType: showType === 'month' ? 'week' : 'month' });
  };

  render() {
    const {
      monthDates,
      weekDates,
      touch,
      translateIndex,
      calendarY,
      currentMonthFirstDay,
      showType,
    } = this.state;
    const {
      currentDate,
      transitionDuration,
      markDates,
      markType,
      disableView,
      customHeader,
      language,
    } = this.props;
    const isMonthView = showType === 'month';
    return (
      <div className="react-h5-calendar">
        {typeof customHeader !== 'boolean' ? (
          typeof customHeader === 'function' ? (
            customHeader({ dateStr: currentDate, date: dayjs(currentDate) })
          ) : (
            customHeader
          )
        ) : !customHeader ? (
          <div className="calendar-operate">
            <div
              className="icon left-icon"
              onClick={this.handleMonthToggle.bind(this, 'prev')}
            >
              <img src={arrow} />
            </div>
            <div>{dayjs(currentDate).format('YYYY-MM')}</div>
            <div
              className="icon right-icon"
              onClick={this.handleMonthToggle.bind(this, 'next')}
            >
              <img src={arrow} />
            </div>
          </div>
        ) : null}

        <div className="calendar-head">
          {head[language].map((item, i, arr) => (
            <div
              className={`head-cell ${
                [arr.length - 1, arr.length - 2].includes(i) ? 'gray' : ''
              }`}
              key={item}
            >
              {item}
            </div>
          ))}
        </div>

        <div
          className={`calendar-body ${isMonthView ? '' : 'week-mode'}`}
          ref={this.calendarRef}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onMouseDown={this.handleTouchStart}
          onMouseMove={this.handleTouchMove}
          onMouseUp={this.handleTouchEnd}
        >
          <div
            style={{
              transform: `translate3d(${-translateIndex * 100}%, 0, 0)`,
            }}
          >
            {(isMonthView ? monthDates : weekDates).map((item, index) => {
              return (
                <div
                  className="month-cell"
                  key={`month-cell-${index}`}
                  style={{
                    transform: `translate3d(${
                      (index -
                        1 +
                        translateIndex +
                        (this.isTouching ? touch.x : 0)) *
                      100
                    }%, ${calendarY}px, 0)`,
                    transitionDuration: `${
                      this.isTouching ? 0 : transitionDuration
                    }s`,
                  }}
                >
                  {item.map((date, itemIndex) => {
                    const isCurrentDay = date.isSame(currentDate, 'day');
                    const isOtherMonthDay =
                      showType === 'week'
                        ? false
                        : !date.isSame(currentMonthFirstDay, 'month');
                    const isMarkDate = markDates.find((i) =>
                      date.isSame(i.date, 'day'),
                    );
                    const resetMarkType =
                      (isMarkDate && isMarkDate.markType) || markType;
                    const showDotMark = isCurrentDay
                      ? false
                      : isMarkDate && resetMarkType === 'dot';
                    const showCircleMark = isCurrentDay
                      ? false
                      : isMarkDate && resetMarkType === 'circle';
                    const currCls = dayjs().isSame(date, 'day')
                      ? 'is-current-date'
                      : '';
                    const grayDateCls =
                      !isMonthView &&
                      date.month() !== dayjs(currentDate).month()
                        ? 'gray-date'
                        : '';
                    return (
                      <div
                        key={itemIndex}
                        className={`day-cell ${
                          isOtherMonthDay ? 'is-other-month-day' : ''
                        }`}
                        onClick={this.handleDayClick.bind(this, date)}
                      >
                        <div
                          className={`day-text ${grayDateCls} ${currCls} ${
                            isCurrentDay ? 'current-day' : ''
                          } ${showCircleMark ? 'circle-mark' : ''}`}
                          style={
                            showCircleMark
                              ? { borderColor: isMarkDate.color || '#168eef' }
                              : null
                          }
                        >
                          {date.date()}
                        </div>
                        {showDotMark && (
                          <div
                            className={isMarkDate ? 'dot-mark' : ''}
                            style={{
                              background: isMarkDate.color || '#168eef',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {disableView ? null : (
          <div className="bottom-operate" onClick={this.onExpandClick}>
            <span className={isMonthView ? 'top' : 'down'}></span>
          </div>
        )}
      </div>
    );
  }
}

Calendar.propTypes = {
  currentDate: PropTypes.string,
  showType: PropTypes.oneOf(['week', 'month']),
  transitionDuration: PropTypes.number,
  onChange: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onSlideChange: PropTypes.func,
  onToggleShowType: PropTypes.func,
  markType: PropTypes.oneOf(['dot', 'circle']),
  markDates: PropTypes.array,
  disableView: PropTypes.bool,
  language: PropTypes.oneOf(['zh-CN', 'en-US']),
  customHeader: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]), // PropTypes.func,
};

Calendar.defaultProps = {
  currentDate: dayjs().format('YYYY-MM-DD'),
  showType: 'month',
  transitionDuration: 0.3,
  onChange: () => {},
  onTouchStart: () => {},
  onTouchMove: () => {},
  onSlideChange: () => {},
  onToggleShowType: () => {},
  markType: 'dot',
  markDates: [],
  disableView: false,
  language: 'zh-CN',
  customHeader: false,
};

export default Calendar;
