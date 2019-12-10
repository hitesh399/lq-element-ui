import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-checkbox-group',
    data() {
        return {
            vuetifyTagName: 'el-checkbox-group',
            internalValue: []
        }
    },
    methods: {
        getProps() {
            return {
                ...this._defaultProps(),
                value: this.LQElement ? this.LQElement : [],
            }
        }
    }
})