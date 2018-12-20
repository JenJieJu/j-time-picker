// js向下兼容
if (!global || !global._babelPolyfill) {
    require('babel-polyfill')
}

// import VConsole from 'vconsole'
// var vConsole = new VConsole();



import './css.scss';
import { createElement, selectorElement, getDayDetail } from './tools.js'
import calendar from './calendar.js'


export default window.dcTimePicker = class dcTimePicker {

    /**
     * 日历构造函数
     * @param  {string} selector             id
     * @param  {date} options.defaultValue 默认日期
     * @param  {func} options.onChange     日期变化触发函数
     * @param  {boole} options.isRange      是否选择日期段
     * @return {obj}                      日历组件对象
     */
    constructor(selector, { defaultValue = new Date(), defaultValues = [], onChange = () => {}, isRange = false } = {}) {


        const dom = selectorElement(selector);
        const input = createElement('div');
        const timePicker = createElement('div');
        const calendarBox = createElement('div');
        const calendarBar = createElement('div');
        const enterBt = createElement('div');
        const cancelBt = createElement('div');
        const parentDom = dom.parentNode;


        if ((parentDom.offsetLeft + parentDom.offsetWidth) - (dom.offsetLeft + dom.offsetWidth) < 300) {
            timePicker.style.right = '0px';
        } else {
            timePicker.style.left = '0px';
        }

        enterBt.innerHTML = '确认'
        cancelBt.innerHTML = '取消'


        dom.className = `dcTimePicker ${dom.className}`;
        input.className = 'dcTimePicker-input';
        timePicker.className = 'dcTimePicker-timePicker'
        calendarBox.className = 'dcTimePicker-calendarBox';
        calendarBar.className = 'dcTimePicker-calendarBar'
        enterBt.className = 'enterBt'
        cancelBt.className = 'cancelBt'

        const myCalendar = new calendar(calendarBox, {
            defaultValue,
            defaultValues,
            onChange(v) {

            },
            isRange
        });


        const setValue = (vs, v) => {
            if (isRange && vs.length > 0) {
                input.innerHTML = `${vs[0].format('yyyy-MM-dd')} <span>-</span> ${vs[vs.length-1].format('yyyy-MM-dd')}`
            } else {
                input.innerHTML = v.format('yyyy-MM-dd')
            }
        }


        this.calendar = myCalendar;
        this.data = myCalendar.data;

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

            // e.stopPropagation();
        })


        enterBt.addEventListener('click', () => {
            setValue(myCalendar.data.values, myCalendar.data.value);
            this.data = myCalendar.data;

            this.isShow = false;
            timePicker.style.display = 'none';
            onChange && onChange(myCalendar.data.value);
        })

        cancelBt.addEventListener('click', () => {
            this.isShow = false;
            timePicker.style.display = 'none';
        })

        // timePicker.addEventListener('click', (e) => {
        //     e.stopPropagation();
        // })

        document.body.addEventListener('click', (e) => {

            // console.log(dom, e)
            let isClickThis = false;
            e.path.map(i => {
                if (i == dom) {
                    isClickThis = true;
                }
            })
            if (!isClickThis) {
                if (this.isShow) {
                    this.isShow = false;
                    timePicker.style.display = 'none';
                }
            }

        })


        calendarBar.appendChild(enterBt);
        calendarBar.appendChild(cancelBt);

        timePicker.appendChild(calendarBox);
        timePicker.appendChild(calendarBar);

        dom.appendChild(input);
        dom.appendChild(timePicker);

        return this;

    }


}