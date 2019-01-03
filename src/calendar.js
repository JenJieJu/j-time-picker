import './css.scss';
import { createElement, selectorElement, getMonthDetail, weeks, getNextDate, watch, getDatesRange, setDateTime } from './tools.js'



export default class calendar {

    /**
     * 日历构造函数
     * @param  {string} selector             id
     * @param  {date} options.defaultValue 默认日期
     * @param  {func} options.onChange     日期变化触发函数
     * @param  {boole} options.isRange      是否选择日期段
     * @return {obj}                      日历组件对象
     */
    constructor(dom, { defaultValue, defaultValues = [], onChange, isRange = false } = {}) {
        /**
         * [timePickerNode 父级node]
         * @type {[node]}
         */
        this._timePickerNode = dom;

        if (!this._timePickerNode) {
            return console.warn('没获取到对应的node')
        }

        this.isRange = isRange;
        this.onChange = onChange || Function;

        let dValue = defaultValue || new Date();
        dValue = setDateTime(dValue)

        let dValues = defaultValues.map((v, i) => {

            if (i == v.lenght - 1) {
                return setDateTime(v, '23:59:59')
            }

            return setDateTime(v)
        })

        this.bindData(dValue, dValues);


        return this;

    }

    /**
     * 绑定数据
     */
    bindData(date, defaultValues) {
        this.data = {
            values: [],
            value: '',
            calendarDate: '',
            startDate: '',
            endDate: ''
        };

        // 第一次加载
        this._isFirstInit = true;

        watch(this.data, 'value', v => {
            this.data.calendarDate = v;

        });

        watch(this.data, 'calendarDate', v => {
            this.renderAll(v);
            // 首次加载不触发onChange
            if (this._isFirstInit) {
                return
            }

            setTimeout(() => {
                this.onChange(v, this.data.startDate, this.data.endDate);
            }, 10);
        });

        watch(this.data, 'endDate', v => {

            if (!this.isRange || !v) {
                this.data.startDate = undefined;
                this.data.values = [];
                return
            }

            // 点击区域落在已选择的范围内
            if (v <= this.data.value || !this.data.startDate) {
                this.data.values = [setDateTime(v), v];
                this.data.startDate = setDateTime(v);
                return
            }

            // 记录已选择的日期区间
            let days = getDatesRange(this.data.startDate, v);
            let day = this.data.startDate.getDate();
            this.data.values = [];
            for (var i = 0; i <= days; i++) {
                let date = getNextDate(this.data.startDate, day + i);
                if (i != 0) {
                    date = setDateTime(date, '23:59:59');
                }
                this.data.values.push(date)
            }


        });

        this.data.startDate = date;

        this._isFirstInit = false;

        if (defaultValues.length > 1) {
            this.setRange(defaultValues);
        } else {
            this.data.endDate = date;
            this.data.value = date;
        }

    }

    setRange(defaultValues = []) {
        this.data.startDate = defaultValues[0];
        this.data.endDate = defaultValues[defaultValues.length - 1];
        this.data.value = defaultValues[0];
    }


    setData(key, value) {
        this.data[key] = value;
    }

    /**
     * 渲染
     */
    renderAll(date) {

        if (this._contains) {
            this._contains.remove();
        }
        if (!date) {
            return
        }
        this._calendarData = getMonthDetail(date);
        const contains = this._contains = this.renderContains(this._timePickerNode);
        const calendarBar = this.renderCalendarBar(contains);
        const calendar = this.renderCalendar(contains);
    }


    /**
     * [renderContains 渲染容器]
     * @param  {[type]} timePickerNode [description]
     * @return {[type]}                [description]
     */
    renderContains(timePickerNode) {
        /**
         * [contains 容器node]
         * @type {[node]}
         */
        const contains = createElement('div');
        contains.className = 'jTimePicker-calendar contains';

        return timePickerNode.appendChild(contains);
    }


    /**
     * [renderCalendarBar 渲染日历的顶栏]
     * @param  {[type]} contains [description]
     * @return {[type]}          [description]
     */
    renderCalendarBar(contains) {
        /**
         * [calendarBar 日历bar]
         * @type {[node]}
         */


        const calendarBar = createElement('div');

        const calendarBarLeftBottom = createElement('a');
        const calendarBarRightBottom = createElement('a');
        const calendarBarContent = createElement('span');

        calendarBar.appendChild(calendarBarLeftBottom);
        calendarBar.appendChild(calendarBarContent);
        calendarBar.appendChild(calendarBarRightBottom);

        return contains.appendChild(calendarBar);

    }

    /**
     * [renderCalendar 渲染日历]
     * @param  {[type]} contains [description]
     * @return {[type]}          [description]
     */
    renderCalendar(contains) {

        const { value, values } = this.data;

        /**
         * [calendarContent 日历内容]
         * @type {[type]}
         */
        const calendarContent = createElement('div');
        calendarContent.className = 'calendar';

        const calendarContentHeader = createElement('div');
        calendarContentHeader.className = 'calendar-header';

        for (var i = 0; i < weeks.length; i++) {
            let weekSpan = createElement('span');
            weekSpan.innerHTML = `${weeks[i]}`;
            calendarContentHeader.appendChild(weekSpan);
        }



        const calendarContentBody = createElement('div');
        calendarContentBody.className = 'calendar-body';

        const { daysList } = this._calendarData;

        /**
         * 渲染每个日期
         */
        for (var i = 0; i < daysList.length; i++) {
            let daySpan = createElement('div'),
                d = daysList[i];
            daySpan.setAttribute('disabled', d.isLastMonthDay || d.isNextMonthDay)
            if (!this.isRange && getDatesRange(d.date, value) == 0) {

                daySpan.setAttribute('active', true)
            }

            values.map(v => {
                let step = getDatesRange(d.date, v);

                if (step == 0 || (step > 0.9 && step < 1)) {

                    daySpan.setAttribute('active', true)
                }
            })

            daySpan.innerHTML = `<span>${d.day}</span>`;

            daySpan.addEventListener('click', function(v) {
                if (this.isRange) {
                    this.data.endDate = setDateTime(v, '23:59:59');

                } else {
                    this.data.endDate = undefined;
                }

                this.data.value = v;

            }.bind(this, d.date));

            calendarContentBody.appendChild(daySpan);
        }


        calendarContent.appendChild(calendarContentHeader);
        calendarContent.appendChild(calendarContentBody);
        return contains.appendChild(calendarContent);
    }

    /**
     * 日期翻页
     * @param  {string} type next or pre
     */
    changeMounth(type = 'next') {
        let data = this._calendarData;
        if (type == 'pre') {
            this.setData('calendarDate', data.preMonthFirstDay.date)
        } else if (type == 'next') {
            this.setData('calendarDate', data.nextMonthFirstDay.date)
        }
    }

    cleanData() {
        this.data.endDate = undefined;
        this.data.startDate = undefined;
        this.data.value = this.data.value;
    }
}