import { createElement } from './tools.js'
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default class createInput {
    constructor(dom, { onEnter = Function, onChange = Function, onPass = Function, onDelete = Function, onArrow = Function } = {}) {
        this._box = dom;

        const input = this._input = createElement('input');

        input.style.width = '14px';
        input.style.height = '16px';
        input.style.display = 'inline-block';
        input.style.lineHeight = '16px';
        input.style.fontSize = '12px';
        input.style.outline = 'none';
        input.style.background = 'none';
        input.style.border = '0px';
        input.style.padding = '0px';
        input.style.textAlign = 'center';


        const enter = e => {
            if (e.which === 13) {
                onEnter(this.value);
                e.preventDefault();
            }
        }


        const change = (e) => {
            if (NUMBERS.indexOf(e.key) > -1) {
                let v = e.key - 0;

                if (this.value !== undefined && this.value !== '') {
                    onPass(v);
                    return false
                }

                e.target.value = this.value = v;
            }
            if (e.key == 'Backspace') {
                if (!this.value) {
                    onDelete();
                }
                e.target.value = this.value = '';

            }

            if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
                // onArrow(e.key);
                return true;
            }

            return false
        }

        input.onkeypress = change;

        input.onkeydown = change

        input.addEventListener('keypress', enter)
        input.addEventListener('keydown', enter)


        this.focus = (v) => {
            input.focus();

            if (v !== undefined) {
                input.value = this.value = v;

            }

        }

        this.delete = () => {
            input.value = this.value = '';

        }

        dom.appendChild(input);
        return this
    }


}