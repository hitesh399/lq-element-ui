
import DirectInput from '../lq-form-element-maker/DirectInput'

export default DirectInput.extend({
    name: 'lqel-text-field',
    inheritAttrs: false,
    data() {
        return {
            tagName: 'el-input',
            internalValue: '',
            internalValueKey: false,
            isNeedToUpdateStore: true
        }
    },
    render: function (createElement) {

        if (!this.hasAccess) return null
        const i = DirectInput.options.render.call(this, createElement);

        if (!this.insideFormItem) {
            return i
        }
        const slotData = {error: this.elError, value: this.LQElement}

        const before = this.$scopedSlots.before ? this.$scopedSlots.before(slotData) : null
        const after = this.$scopedSlots.after ? this.$scopedSlots.after(slotData) : null

        return createElement(
            'el-form-item',
            {
                props: {
                    label: this.labelText,
                    error: this.elError ? this.elError[0] : '',
                    labelWidth: this.labelWidth,
                    size: this.size,
                    inlineMessage: !!this.elError,
                    required: this.showAsterisk && this.lqElRules  && this.lqElRules.presence ? true : false
                },
                scopedSlots: {
                    label: props => this.$scopedSlots.label ? this.$scopedSlots.label(props) : null
                },
            },
            [before, i, after]
        )
    },
    props: {
        size: String,
        labelText: String,
        labelWidth: String,
        insideFormItem: {
            default: () => true,
            type: Boolean
        },
        showAsterisk:{
            default: () => true,
            type: Boolean
        },
        placeholder: String
    },

    methods: {
        _defaultProps() {
            return {
                ...this.$attrs,
                disabled: this.isDisabled,
                value: this.LQElement,
                name: this.id,
                placeholder: this.placeholder
            }
        },
        _defaultAttrs() {
            return {
                placeholder: this.placeholder,
                id: `${this.lqForm.name}.${this.id}`,
               
            }
        },
        onChange(value) {
            // console.log('Iasadnm')
            if (!this.touch) {
                this.touchStatus(true);
            }
            DirectInput.options.methods.onChange.call(this, value);
        },
    }
})