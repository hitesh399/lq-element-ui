import Vue from 'vue'
import { lqFormMixin } from 'lq-form'

export default Vue.extend({
    name: 'lq-v-form',
    inheritAttrs: false,
    mixins: [lqFormMixin],
    props: {
        tag: {
            type: String,
            default: () => 'form'
        }
    },
    render(createElement) {
        return createElement(this.tag, {
            on: {
                submit: e => { e.preventDefault(); this.submit() },
                ...this.$listeners
            },
            // domProps: this.$attrs,
            staticClass: 'v-form lq-v-form',
            attrs: Object.assign({
                novalidate: true
            }, this.$attrs),
        }, this.$scopedSlots.default({
            model: this.formValues,
            errors: this.formErrors,
            push: this.push,
            unshift: this.unshift,
            remove: this.remove,
            removeError: this.removeError,
        }))
    }
})