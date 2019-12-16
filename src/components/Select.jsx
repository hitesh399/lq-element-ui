import SelectMixin from '../lq-form-element-maker/SelectMixin'
import Input from './input'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-select',
    mixins: [SelectMixin],
    data() {
        return {
            tagName: 'el-select'
        }
    },
    props: {
        remote: Boolean
    },
    methods: {
        defaultSelectProps() {
            return {
                ...this.$attrs,
                disabled: this.isDisabled,
                value: this._extractOnlyValue(this.LQElement),
                name: this.id,
                multiple: this.multiple,
                valueKey: this.itemValue,
                loading: this.requesting,
                remote: this.remote,
                remoteMethod: this.remote ? this.fetchDataFromServer : undefined

            }
        },
        /**
         * To Render slots.
         * @param {function} createElement 
         * @param {Object} slots 
         */
        renderSlots(createElement, slots) {
            if (Object.keys(slots).length === 0) {
                return this.finalItems.map(item => {
                    return this.$createElement('el-option', {
                        props: {
                            key: `${this.id}_item_${item[this.itemValue]}`,
                            label: this.$helper.isObject(item) ? item[this.itemText] : item,
                            value: this.$helper.isObject(item) ? item[this.itemValue] : item
                        }
                    })
                })
            }
            return this._makeSlotReadyToRender(createElement, slots);
        },
        /**
        * When value change internally.
        * @param {any} value 
        */
        onInput(value) {
            if (this.isNotSame(value, this.LQElement)) {
                const _values = value ? (this.$helper.isArray(value) ? value : [value]) : []
                let items = [];
                _values.forEach((val) => {
                    let _selected_item = val
                    this.finalItems.every(_item => {
                        if (_item[this.itemValue] === val) {
                            _selected_item = _item
                            return false
                        }
                        return true
                    })
                    items.push(_selected_item)
                })
                this.setValue((items[0] !== undefined ? (this.multiple ? items : items[0]) : value), true, true)
            }
        },
        _extractOnlyValue() {
            const _values = this.LQElement ? (this.$helper.isArray(this.LQElement) ? this.LQElement : [this.LQElement]) : []
            const items = _values.map(t => typeof t === 'object' ? t[this.itemValue] : t)
            return (items[0] !== undefined ? (this.multiple ? items : items[0]) : null)
        }
    }
})