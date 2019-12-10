
import LqVtextField from '../../node_modules/lq-vuetify/src/components/LqVTextField'

export default LqVtextField.extend({
    name: 'lqel-text-field',
    data() {
        return {
            vuetifyTagName: 'el-input',
            internalValue: '',
            internalValueKey: false,
            isNeedToUpdateStore: true
        }
    },
    render: function (createElement) {

        if (!this.hasAccess) return null
        const i = LqVtextField.options.render.call(this, createElement);

        if (!this.insideFormItem) {
            return i
        }
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
            [i]
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
    },

    methods: {
        _defaultProps() {
            return {
                ...this.$attrs,
                disabled: this.isDisabled,
                value: this.LQElement,
                name: this.id,
                muliple: this.muliple
            }
        },
        onChange(value) {
            // console.log('Iasadnm')
            if (!this.touch) {
                this.touchStatus(true);
            }
            LqVtextField.options.methods.onChange.call(this, value);
        },
    }
})