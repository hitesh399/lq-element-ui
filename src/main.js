import Input from './components/input'
import Form from './components/Form'
import Number from './components/InputNumber'
import RadioGroup from './components/RadioGroup'
import CheckboxGroup from './components/CheckboxGroup'
import Checkbox from './components/Checkbox'
import Radio from './components/Radio'
import Switch from './components/Switch'
import TimeSelect from './components/TimeSelect'
import DatePicker from './components/DatePicker'
import Rate from './components/Rate'
import ColorPicker from './components/ColorPicker'

export default {
    // The install method will be called with the Vue constructor as
    // the first argument, along with possible options
    install (Vue, options) {
        Vue.component('lqel-input', Input)
        Vue.component('lqel-form', Form)
        Vue.component('lqel-input-number', Number)
        Vue.component('lqel-radio-group', RadioGroup)
        Vue.component('lqel-checkbox-group', CheckboxGroup)
        Vue.component('lqel-checkbox', Checkbox)
        Vue.component('lqel-radio', Radio)
        Vue.component('lqel-switch', Switch)
        Vue.component('lqel-time-select', TimeSelect)
        Vue.component('lqel-date-picker', DatePicker)
        Vue.component('lqel-rate', Rate)
        Vue.component('lqel-color-picker', ColorPicker)
    }
}