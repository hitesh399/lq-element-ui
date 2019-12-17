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
        remote: Boolean,
        disabledValues: Array
    },
    computed: {
        /**
         * Make grouped options
         */
        groupedOptions() {
            const options = this.items;
            let grouped_options = {};
            options.map((opt) => {
                let group_name = this.$helper.getProp(opt, this.groupBy);
                group_name = group_name ? group_name : this.uncategorisedLabel;
                if (!grouped_options[group_name]) {
                    grouped_options[group_name] = [];
                }
                grouped_options[group_name].push(opt);
            });
            return grouped_options
        }
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
            return this.groupBy ? this.renderOptionsWithGroup() : this.renderOptions(this.finalItems)
        },
        renderOptions(items) {
            return items.map(item => {
                const _val = this.$helper.isObject(item) ? item[this.itemValue] : item
                const _disabled = this.$helper.isObject(item) ? !!item.disabled : false
                const __disabled = _disabled || (this.disabledValues && this.disabledValues.includes(_val))
                return this.$scopedSlots.item ? this.$scopedSlots.item({item, disabled: __disabled}) :
                    this.$createElement('el-option', {
                        props: {
                            key: `${this.id}_item_${item[this.itemValue]}`,
                            label: this.$helper.isObject(item) ? item[this.itemText] : item,
                            value: _val,
                            disabled: __disabled
                        }
                    })
            })
        },
        renderOptionsWithGroup() {
            return this.groups.map(group => {
                const items = this.groupedOptions[group]
                return this.$scopedSlots.groupItem ? this.$scopedSlots.groupItem({group, items}) : 
                    this.$createElement('el-option-group', {
                        props: {
                            key: group,
                            label: group
                        }
                    }, this.renderOptions(items))
            })
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
                    this.items.every(_item => {
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