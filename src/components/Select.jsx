import Input from '../lq-form-element-maker/DirectSelect'
// import {  EventBus } from 'lq-form'
export default Input.extend({
    name: 'lqel-select',
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
        	// console.log('slots', slots)
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
            // console.log('Value', value)
            if (this.isNotSame(value, this.LQElement)) {
                if (!this.isOutputObject) {
                    this.setValue(value, true, true)
                } else {
                    const _value = value ? (this.$helper.isArray(value)  ? value : [value]) : []
                    const items = this.finalItems.filter(t => _value.includes(t[this.itemValue]))
                    this.setValue((items[0] !== undefined ? (this.multiple ? items : items[0]) : value), true, true)
                }
            }
        },

        _extractOnlyValue() {
            const _values = this.LQElement ? (this.$helper.isArray(this.LQElement)  ? this.LQElement : [this.LQElement]) : []
            const items = _values.map(t => t[this.itemValue])
            return (items[0] !== undefined ? (this.multiple ? items : items[0]) : null)
        }
    }
})