import { isArray, isString, isFunction } from './checkVariable.js'
import { createElementFromHTML } from './tools.js'

/**
 * 递归渲染元素
 * @param  {[type]} dom          [description]
 * @param  {Array}  contentArray [description]
 */
export default function depth(dom, contentArray = [], data) {

    if (isArray(contentArray)) {
        contentArray.map(({ html, child = [], events = [], attrs = [] }) => {
            if (isString(html) && html) {
                let d = createElementFromHTML(html);

                attrs.map(({ key, value }) => {
                    if (isString(key) && isString(value)) {
                        d.setAttribute(key, value)
                    }
                })

                events.map(({ type, event }) => {
                    if (isString(type) && isFunction(event)) {
                        d.addEventListener(type, (e) => {
                            event.apply({
                                data,
                                $event: e,
                                $dom: d,
                                isThisTrigger: e.target === d
                            });
                        });
                    }
                })

                dom.appendChild(d);
                depth(d, child, data);
            }
        })

    }

}