import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-radio-group',
    data() {
        return {
            tagName: 'el-radio-group'
        }
    },
    methods: {
        /**
         * When value change internally.
         * @param {any} value 
         */
        onInput(value) {
            if (!this.touch) {
                this.touchStatus(true);
            }
            Input.options.methods.onInput.call(this, value);
        }
    }
})