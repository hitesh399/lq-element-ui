import Vue from 'vue'
import helper from 'vuejs-object-helper'

export default Vue.extend({
	name: 'lq-el-form-item',
	props: {
		prop: [String, Array]
	},
	inject: ['lqForm'],
	computed: {
		error: function () {
			if (!this.prop) return null
			if (typeof this.prop === 'string') {
				return helper.getProp(this.lqForm.formErrors, `${this.prop}.0`)
			} else {
				const e = this.prop.map(p => {
					return helper.getProp(this.lqForm.formErrors, `${p}.0`)
				})
				return e.length ? e[0] : null;
			}
		}
	},
	render: function (createElement) {
		return createElement(
			'el-form-item',
			{
				// class: this.,
				on: {
					...self.$listeners,
				},
				props: {
					error: this.error,
					inlineMessage: !!this.error,
					...this.$attrs
				},
				scopedSlots: self.$scopedSlots,
				attrs: this.$attrs,
				ref: 'lqel',
			},
			this.renderSlots(createElement, this.$slots)
		)
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