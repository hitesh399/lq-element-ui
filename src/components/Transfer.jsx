import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-transfer',
    data() {
        return {
            tagName: 'el-transfer'
        }
    },
    methods: {
        _defaultProps() {
            return {
                ...this.$attrs,
                disabled: this.isDisabled,
                value: this.LQElement ? this.LQElement :[],
                name: this.id,
            }
        },
    }
})