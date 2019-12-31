import Vue from 'vue'
import Phone from './Phone'
import InputText from './input'
import helper from 'vuejs-object-helper'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
export default Vue.extend({
    components: { Phone, InputText },
    props: {
        id: {
            type: String,
            required: true
        },
        validateOnEvent: {
            type: String,
            validator: (val) => ['blur', 'change', 'keypress', 'keyup', 'keydown', 'click'].includes(val),
            default: function () {
                return 'change';
            }
        },
        customValueTransformer: Function,
        initValue: {
            type: [String, Array, Object, undefined],
            default: () => null
        },
        disabled: Boolean,
        value: [Object, Array, Number, String],
        muliple: Boolean,
        customMask: Function,
        keepAlive: {
            default: () => true,
            type: Boolean
        }
    },
    inject: ['lqForm'],
    computed: {
        isPhone() {
            let value = helper.getProp(this.lqForm, `formValues.${this.id}`, '')
            value = value ? value : ''
            const value_arr = value.split('-');
            const compareValue = value_arr.length === 2 ? value_arr[1] : value_arr[0];
            const phoneNumber = parsePhoneNumberFromString('+91' + compareValue)
            return helper.isInteger(phoneNumber ? phoneNumber.nationalNumber : '') ? true : false
        }
    },
    render(createElement) {
        const tag = this.isPhone ? 'phone' : 'input-text'
        // console.log('Tag', tag)
        return this.$createElement(tag, {
            on: this.$listeners,
            props: {
                id: this.id,
                value: this.value,
                customMask: this.customMask,
                keepAlive: this.keepAlive,
                muliple: this.muliple,
                validateOnEvent: this.validateOnEvent,
                customValueTransformer: this.customValueTransformer,
                initValue: this.initValue,
                disabled: this.disabled,
                scopedSlots: this.$scopedSlots,
                autofocus: true
            },
            attrs: { ...this.$attrs, autofocus: true }
        }, this.renderSlots(createElement, this.$slots))
    },
    methods: {
        /**
         * To Make the slots ready to render.
         * @param {Function} createElement 
         * @param {Object} slots 
         */
        _makeSlotReadyToRender(createElement, slots) {
            const slotNames = Object.keys(slots);
            return slotNames.map(
                slotName => createElement(
                    'template',
                    { slot: slotName },
                    slots[slotName]
                )
            )
        },
        /**
         * To Render slots.
         * @param {function} createElement 
         * @param {Object} slots 
         */
        renderSlots(createElement, slots) {
            return this._makeSlotReadyToRender(createElement, slots);
        },
    }
})