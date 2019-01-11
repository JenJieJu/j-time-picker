Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


export const weeks = ['日', '一', '二', '三', '四', '五', '六'];

export const createElement = (v) => document.createElement(v);


export const setDateTime = (date, time = '00:00:00') => {
    return new Date(new Date(date).format('yyyy-MM-dd ') + time);
}

/**
 * 获取日期相差天数
 * @param  {date} a [description]
 * @param  {date} b [description]
 * @return {number}   天数
 */
export const getDatesRange = (a, b) => {
    let a1 = new Date(a);
    let b1 = new Date(b);
    return Math.abs(a1.getTime() - b1.getTime()) / (60 * 60 * 24 * 1000);
}

/**
 * 监听对象某个属性
 * @param  {obj}   obj 目标对象
 * @param  {string}   key 对象属性名
 * @param  {function} cb  变化出发的函数
 */
export const watch = (obj, key, cb) => {
    let value = undefined;
    Object.defineProperty(obj, key, {
        get: () => value,
        set: (v) => {
            value = v;
            cb(v);
        }
    })
}


/**
 * 获取元素
 * @param  {string} selector 元素id
 * @return {node}          元素对象
 */
export const selectorElement = selector => {
    return selector ? document.querySelectorAll(selector)[0] : undefined;
}

/**
 * 获取下个日期（指定天数）
 * @param  {[date]} date [当前日期]
 * @param  {[number]} i    [距离天数]
 * @return {[date]}      [指定的日期]
 */
export const getNextDate = (date, i) => {
    let d = new Date(date);
    d.setDate(i)
    return d;
}

export const getDateByDays = (date, days) => {
    let d = new Date(date);
    let day = d.getDate();

    d.setDate(day + days);
    return d;
}

/**
 * [计算本月包含多少天]
 * @param  {[Date]} primalDate [日期]
 * @return {[number]}            [天数]
 */
export const getDaysOfMonth = primalDate => {
    var date = new Date(primalDate); //要新建一个对象，因为会改变date
    var month = date.getMonth();
    var time = date.getTime(); //计算思路主要是month+1,相减除一天的毫秒数
    var newTime = date.setMonth(month + 1);
    return Math.ceil((newTime - time) / (24 * 60 * 60 * 1000));
}

/**
 * 获取日期详细信息
 * @param  {date} primalDate 日期
 * @return {obj}            信息对象
 */
export const getDayDetail = primalDate => {
    var date = new Date(primalDate);
    return {
        time: date.getTime(),
        timeLabel: date.format('yyyy-MM-dd hh:mm:ss'),
        date,
        day: date.getDate(),
        week: date.getDay(),
        weekLabel: weeks[date.getDay()],
        month: date.getMonth() + 1,
        monthDays: getDaysOfMonth(date),
        year: date.getFullYear(),
    }
}


/**
 * 获取本月详情
 * @param  {Date} primalDate 日期
 * @return {object}            结果对象
 */
export const getMonthDetail = (primalDate) => {


    let detail = getDayDetail(primalDate);
    let firstDate = getNextDate(primalDate, 1);
    const firstDateDetail = getDayDetail(firstDate);
    const { week, date, monthDays } = firstDateDetail;
    let daysList = [];


    function addDay(thatDate) {
        let d = getDayDetail(thatDate);
        d.isLastMonthDay = false;
        d.isNextMonthDay = false;

        // 去年
        if (d.year < detail.year) {
            d.isLastMonthDay = true;
        }
        // 今年
        else if (d.year == detail.year) {
            if (d.month < detail.month) {
                d.isLastMonthDay = true
            } else if (d.month > detail.month) {
                d.isNextMonthDay = true;
            }
        } else {
            d.isNextMonthDay = true;
        }

        daysList.push(d);
    }


    /**
     * 补全前上个月的日期
     */
    for (let i = week - 1; i >= 0; i--) {
        addDay(getNextDate(detail.date, -i));
    }

    /**
     * 当月日期
     */
    for (let i = 1; i <= monthDays; i++) {
        let day = getNextDate(date, i);
        addDay(day);

        if (i == 1) {
            detail.preMonthFirstDay = getDayDetail(getNextDate(getNextDate(day, 0), 1));
        }

        if (i == monthDays) {
            detail.nextMonthFirstDay = getDayDetail(getNextDate(date, i + 1));
        }
    }

    /**
     * 补全下个月的头几天
     */
    let lastDay = daysList[daysList.length - 1];
    for (let i = 1; i < 7 - lastDay.week; i++) {
        addDay(getNextDate(lastDay.date, lastDay.monthDays + i));
    }

    /**
     * 补全剩余日期
     */
    let repairLength = 7 * 6 - daysList.length
    lastDay = daysList[daysList.length - 1];
    for (let i = lastDay.day + 1; i <= lastDay.day + repairLength; i++) {
        addDay(getNextDate(lastDay.date, i));
    }



    detail.daysList = daysList;
    return detail
}


export const elementOutClick = (element, cb = Function) => {
    document.body.addEventListener('click', (e) => {

        let isClickThis = false;
        e.path.map(i => {
            if (i == element) {
                isClickThis = true;
            }
        })
        if (!isClickThis) {
            cb()
        }

    })
}

/**
 * 通过html创建元素
 * @param  {string} htmlString html
 * @return {dom}            元素
 */
export const createElementFromHTML = (htmlString) => {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}