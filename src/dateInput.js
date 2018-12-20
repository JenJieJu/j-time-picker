import { createElement, watch } from './tools.js'
import numberInput from './numberInput.js'


export default class createInput {
    constructor(dom, { onPass = Function, lenght = 1, onDelete = Function, onEnter = Function } = {}) {
        const box = createElement('div');

        const input = createElement('div');

        input.style.border = '1px solid #eee';
        input.style.lineHeight = '22px';
        input.style.padding = '0px 4px';
        input.style.borderRadius = '5px';


        let inputs = [];

        for (let i = 0; i < lenght; i++) {
            let ipt = new numberInput(input, {
                onPass: function(v) {
                    // ipt.focus(v)
                    let nextInput = inputs[this + 1];
                    if (nextInput) {
                        nextInput.focus(v)
                    } else {
                        console.log(v)
                        onPass(v);
                    }
                }.bind(i),
                onDelete: function(v) {

                    let preInput = inputs[this - 1];
                    if (preInput) {
                        preInput.focus();
                        preInput.delete();
                    } else {
                        onDelete()
                    }

                }.bind(i),
                onEnter: function(v) {
                    onEnter(v);
                }.bind(i),
            });

            ipt._input.onclick = (e) => {
                // console.log(1)
                e.stopPropagation();
            }

            watch(ipt, 'value', (v) => {
                this.values = inputs.map(v => v.value);
                this.value = undefined;
                this.values.map((v, i) => {
                    if (i === 0) {
                        if (v !== undefined && v !== '') {
                            this.value = v + '';
                        }
                    } else {

                        if (v !== undefined && v !== '') {
                            this.value += v;
                        } else {
                            if (this.value !== undefined && this.value !== '') {
                                this.value += 0;
                            }
                        }

                    }
                })

                if (this.value) {
                    this.value = this.value - 0
                }
            })

            inputs.push(ipt);
        }

        box.appendChild(input);
        dom.appendChild(box);

        this.focus = (v, index = 0) => {
            inputs[index].focus(v)
        }

        this.delete = () => {
            inputs[inputs.length - 1].focus();
            inputs[inputs.length - 1].delete();
        }

        this._box = box;
        this._input = input;
        this._inputs = inputs;

        return this;
    }
}