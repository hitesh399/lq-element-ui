import Input from './input'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default Input.extend({
    name: 'lq-el-place',
    components: { VueGoogleAutocomplete },
    data() {
        return {
            tagName: 'vue-google-autocomplete'
        }
    },
    created() {
        this.$lqForm.addProp(this.lqForm.name, this.id, 'formatter', this.formatter)
        this.$nextTick(() => {
            if (this.value) {
                this.showEddressInBox(this.value)
            }
            if (this.LQElement) {
                this.showEddressInBox(this.LQElement)
            }
        })
    },
    methods: {
        customEvents() {
            return {
                placechanged: this.getAddressData
            }
        },
        getAddressData(addressData, placeResultData, id) {
            const { formatted_address, geometry, place_id } = placeResultData
            this.setValue({ formatted_address, geometry, place_id, id }, true, false, true)
        },
        showEddressInBox(value) {
            if (this.$refs.lqel) {
                const _val = typeof value === 'object' ? value.formatted_address : this.value
                this.$refs.lqel.update(_val)
            }
        },
        getClass() {
            return ['el-input__inner']
        }
    },
    watch: {
        myInitializeValue(newValue) {
            this.showEddressInBox(newValue)
        }
    }
})