// js向下兼容
if (!global || !global._babelPolyfill) {
    require('babel-polyfill')
}

// import VConsole from 'vconsole'
// var vConsole = new VConsole();



import './css.scss';
import { createElement, selectorElement, getDayDetail, watch, elementOutClick, setDateTime, getDateByDays, getDaysOfMonth } from './tools.js'
import calendar from './calendar.js'
import dateInput from './dateInput.js'
import renderTreeHtml from './renderTreeHtml.js'


export default window.jTimePicker = class jTimePicker {

    /**
     * 日历构造函数
     * @param  {string} selector             id
     * @param  {date} options.defaultValue 默认日期
     * @param  {func} options.onChange     日期变化触发函数
     * @param  {boole} options.isRange      是否选择日期段
     * @return {obj}                      日历组件对象
     */
    constructor(selector, { defaultValue = new Date(), defaultValues = [], onChange = () => {}, isRange = false } = {}) {


        this.isRange = isRange;

        const dom = selectorElement(selector);
        const parentDom = dom.parentNode;
        const input = createElement('div');
        const timePicker = createElement('div');

        const assistBar = createElement('div');
        const calendarDiv = createElement('div');
        const calendarNavBox = createElement('div');
        const calendarBox = createElement('div');

        const calendarBar = createElement('div');
        const enterBt = createElement('div');
        const cancelBt = createElement('div');



        if ((parentDom.offsetLeft + parentDom.offsetWidth) - (dom.offsetLeft + dom.offsetWidth) < 300) {
            timePicker.style.right = '0px';
        } else {
            timePicker.style.left = '0px';
        }

        enterBt.innerHTML = '确认'
        cancelBt.innerHTML = '取消'


        dom.className = `jTimePicker ${dom.className}`;
        input.className = 'jTimePicker-input';
        timePicker.className = 'jTimePicker-timePicker';
        calendarDiv.className = 'jTimePicker-calendarDiv';
        calendarNavBox.className = 'jTimePicker-calendarNavBox'
        calendarBox.className = 'jTimePicker-calendarBox';
        calendarBar.className = 'jTimePicker-calendarBar'
        enterBt.className = 'enterBt'
        cancelBt.className = 'cancelBt'

        assistBar.className = 'jTimePicker-assistBar';


        // 导航
        const nav = this.renderNav(calendarNavBox);

        

        const myCalendar = new calendar(calendarBox, {
            defaultValue,
            defaultValues,
            onChange: (v) => {
                this.data = myCalendar.data;
                nav.setNavDate(this.data.calendarDate);
            },
            isRange
        });

        this.calendar = myCalendar;
        this.data = myCalendar.data;




        const setValue = (vs, v) => {
            if (isRange && vs.length > 0) {
                input.innerHTML = `${vs[0].format('yyyy-MM-dd')} <span>-</span> ${vs[vs.length-1].format('yyyy-MM-dd')}`
            } else {
                input.innerHTML = v.format('yyyy-MM-dd')
            }
        }




        setValue(defaultValues, defaultValue);

        this.isShow = false;
        timePicker.style.display = 'none';

        input.addEventListener('click', (e) => {
            if (this.isShow) {
                this.isShow = false;
                timePicker.style.display = 'none';

            } else {
                this.isShow = true;
                timePicker.style.display = 'block';
            }

        })


        enterBt.addEventListener('click', () => {
            setValue(myCalendar.data.values, myCalendar.data.value);
            this.data = myCalendar.data;
            // console.log(this.data);
            this.isShow = false;
            timePicker.style.display = 'none';
            onChange && onChange(myCalendar.data.value);
        })

        cancelBt.addEventListener('click', () => {
            this.isShow = false;
            timePicker.style.display = 'none';
        })


        elementOutClick(dom, () => {
            if (this.isShow) {
                this.isShow = false;
                timePicker.style.display = 'none';
            }
        })




        calendarBar.appendChild(enterBt);
        calendarBar.appendChild(cancelBt);

        calendarDiv.appendChild(calendarNavBox);
        calendarDiv.appendChild(calendarBox);

        timePicker.appendChild(calendarDiv);


        if (isRange) {
            this.renderAssistBar(assistBar);
            timePicker.appendChild(assistBar);
        }

        timePicker.appendChild(calendarBar);

        dom.appendChild(input);
        dom.appendChild(timePicker);



        return this;

    }

    renderAssistBar(contains) {
        if (this._assistBar) {
            this._assistBar.remove();
        }
        let self = this;

        function setRangeDate(startDate, endDate, isEnd) {

            startDate = setDateTime(startDate);
            endDate = setDateTime(endDate, '23:59:59');

            self.calendar.data.startDate = self.calendar.data.endDate = self.calendar.data.value = '';

            self.calendar.data.startDate = startDate;
            self.calendar.data.endDate = endDate;

            self.calendar.data.value = isEnd ? endDate : startDate;
        }


        renderTreeHtml(contains, [{
            html: '<div class="assistBar-content"></div>',
            child: [{
                html: '<h4>最近</h4>',
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">一周</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();
                            let startDate = getDateByDays(nowDate, -(7 - 1));

                            setRangeDate(startDate, nowDate)
                        }
                    }]
                }]
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">一个月</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();

                            let days = getDaysOfMonth(nowDate);

                            let startDate = getDateByDays(nowDate, -(days - 1));

                            setRangeDate(startDate, nowDate)
                        }
                    }]
                }]
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">三个月</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();
                            let days;
                            let startDate = new Date();
                            for (var i = 0; i < 3; i++) {
                                days = getDaysOfMonth(startDate);
                                startDate = getDateByDays(startDate, -(days - 1));
                            };
                            setRangeDate(startDate, nowDate);
                        }
                    }]
                }]
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">一年</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();

                            let startDate = getDateByDays(nowDate, -(365 - 1));

                            setRangeDate(startDate, nowDate)
                        }
                    }]
                }]
            }, {
                html: '<h4>接下来</h4>',
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">一周</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();
                            let startDate = getDateByDays(nowDate, (7 - 1));

                            setRangeDate(nowDate, startDate, true)
                        }
                    }]
                }]
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">一个月</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();

                            let days = getDaysOfMonth(nowDate);

                            let startDate = getDateByDays(nowDate, (days - 1));

                            setRangeDate(nowDate, startDate, true)
                        }
                    }]
                }]
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">三个月</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();
                            let days;
                            let startDate = new Date();
                            for (var i = 0; i < 3; i++) {
                                days = getDaysOfMonth(startDate);
                                startDate = getDateByDays(startDate, (days - 1));
                            };
                            setRangeDate(nowDate, startDate, true);
                        }
                    }]
                }]
            }, {
                html: '<div class="itemBox"></div>',
                child: [{
                    html: '<div class="cancelBt">一年</div>',
                    events: [{
                        type: 'click',
                        event() {
                            let nowDate = new Date();

                            let startDate = getDateByDays(nowDate, (365 - 1));

                            setRangeDate(nowDate, startDate, true)
                        }
                    }]
                }]
            }]
        }]);
    }

    /**
     * 渲染日历导航栏
     */
    renderNav(contains) {

        if (this._calendarNav) {
            this._calendarNav.remove();
        }

        const calendarNav = this._calendarNav = createElement('div');
        const preBt = createElement('div');
        const nextBt = createElement('div');
        const content = createElement('div');
        const input = createElement('div');
        const text = createElement('div');

        function createLine(dom) {
            const line = createElement('div');
            line.innerHTML = `&nbsp;-&nbsp;`;
            dom.appendChild(line);
        }

        elementOutClick(calendarNav, () => {
            input.style.display = 'none';
            text.style.display = 'block';
            if (DEFAULT_DATE) {
                this.calendar.data.value = DEFAULT_DATE;
            }

        })

        content.setAttribute('isRange', this.isRange);

        preBt.className = 'pre';
        nextBt.className = 'next';
        calendarNav.className = 'calendar-nav';
        text.className = 'calendar-nav-text';
        input.className = 'input-box';

        input.style.display = 'none';

        preBt.innerHTML = '<';
        nextBt.innerHTML = '>';


        function setNavDate(date) {
            if (!date) return
            text.innerHTML = date.format('yyyy年MM月');
        }


        const yearInput = new dateInput(input, {
            lenght: 4,
            onPass(v) {
                monthInput.focus(v);
            },
            onChange() {
                dateChange()
            },
        });

        createLine(input);

        const monthInput = new dateInput(input, {
            lenght: 2,
            onPass(v) {
                // dayInput.focus(v);

            },
            onDelete() {
                yearInput.delete();
            },
            onChange() {
                dateChange()
            },
        });

        let self = this;
        let DEFAULT_DATE;

        function dateChange() {

            if (!yearInput.value || !monthInput.value) {
                self.calendar.data.value = DEFAULT_DATE || '';
            }

            let date = yearInput.value + '/' + (monthInput.value || 0) + '/01';
            date = new Date(date);
            if (date == 'Invalid Date') {
                self.calendar.data.value = '';
            } else {
                self.calendar.data.startDate = undefined;
                self.calendar.data.endDate = setDateTime(date, '23:59:59');
                self.calendar.data.value = date;
            }
        }


        calendarNav.appendChild(preBt)
        calendarNav.appendChild(content)
        calendarNav.appendChild(nextBt)
        content.appendChild(input);
        content.appendChild(text);


        content.addEventListener('click', function() {
            DEFAULT_DATE = self.calendar.calendarDate;
            input.style.display = 'block';
            yearInput.focus();
            text.style.display = 'none';
        })


        preBt.addEventListener('click', function() {
            this.calendar.changeMounth('pre');
        }.bind(this))

        nextBt.addEventListener('click', function() {
            this.calendar.changeMounth('next');
        }.bind(this))

        return {
            $contains: contains.appendChild(calendarNav),
            setNavDate
        };
    }


}