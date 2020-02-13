import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-checkbox-group',
    data() {
        return {
            tagName: 'el-checkbox-group',
            internalValue: []
        }
    },
    methods: {
        getProps() {
            return {
                ...this._defaultProps(),
                value: this.LQElement ? this.LQElement : [],
            }
        },
        /**
         * When value change internally.
         * @param {any} value 
         */
        onInput(value) {
            if (!this.touch) {
                this.touchStatus(true);
            }
            Input.options.methods.onInput.call(this, value);
        },
    }
})