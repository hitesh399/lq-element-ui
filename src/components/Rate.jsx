import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-rate',
    data() {
        return {
            tagName: 'el-rate'
        }
    },
    methods: {
        onInput(value) {
            if (!this.touch && value) {
                this.touchStatus(true);
            }
            Input.options.methods.onInput.call(this, value);
        },
    }
})