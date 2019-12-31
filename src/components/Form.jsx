import Vue from 'vue'
import { lqFormMixin } from 'lq-form'

export default Vue.extend({
    name: 'lqel-form',
    inheritAttrs: false,
    mixins: [lqFormMixin],
    props: {
        tag: {
            type: String,
            default: () => 'form'
        },
        staticData: Object,
        disabled: Boolean
    },
    provide() {
        return {
            lqEForm: this
        }
    },
    data() {
        return { busy: false }
    },
    render(createElement) {
        return createElement('el-form', {
            on: this.$listeners,
            nativeOn: {
                submit: e => { e.preventDefault(); !this.busy ? this.submit(this.staticData) : null },
            },
            // domProps: this.$attrs,
            staticClass: 'v-form lq-v-form',
            props: {
                disabled: this.disabled || this.busy,
                ...this.$attrs
            },
            attrs: Object.assign({
                novalidate: true
            }, this.$attrs),
        }, this.$scopedSlots.default({
            model: this.formValues,
            errors: this.formErrors,
            push: this.push,
            canShow: this.canShow,
            unshift: this.unshift,
            submit: this.submit,
            remove: this.remove,
            removeError: this.removeError,
        }))
    }
})