import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-switch',
    data() {
        return {
            vuetifyTagName: 'el-switch'
        }
    },
    methods: {
        onInput(value) {
            this.setValue(value, true, true)
        },
    }
})