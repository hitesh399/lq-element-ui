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
import Select from './components/Select'
import Transfer from './components/Transfer'
import Slider from './components/Slider'
import Table from './components/Table'
import Pagination from './components/Pagination'
import LqVFile from './components/File/LqVFile'
import Phone from './components/Phone'
import PhoneOrText from './components/PhoneOrText'
import Place from './components/Place'
import TableIndex from './components/TableIndex'
import TimePicker from './components/TimePicker'
import FormItem from './components/FormItem'
import { lqOptions } from './defaultOptions'


export default {
    // The install method will be called with the Vue constructor as
    // the first argument, along with possible options
    install(Vue, options = {}) {
        lqOptions.merge(options)

        Vue.component('lq-el-input', Input)
        Vue.component('lq-el-form', Form)
        Vue.component('lq-el-input-number', Number)
        Vue.component('lq-el-radio-group', RadioGroup)
        Vue.component('lq-el-checkbox-group', CheckboxGroup)
        Vue.component('lq-el-checkbox', Checkbox)
        Vue.component('lq-el-radio', Radio)
        Vue.component('lq-el-switch', Switch)
        Vue.component('lq-el-time-select', TimeSelect)
        Vue.component('lq-el-date-picker', DatePicker)
        Vue.component('lq-el-rate', Rate)
        Vue.component('lq-el-color-picker', ColorPicker)
        Vue.component('lq-el-select', Select)
        Vue.component('lq-el-transfer', Transfer)
        Vue.component('lq-el-slider', Slider)
        Vue.component('lq-el-table', Table)
        Vue.component('lq-el-table-index', TableIndex)
        Vue.component('lq-el-pagination', Pagination)
        Vue.component('lq-el-file', LqVFile)
        Vue.component('lq-el-form-item', FormItem)
        Vue.component('lq-el-phone', Phone)
        Vue.component('lq-el-phone-or-text', PhoneOrText)
        Vue.component('lq-el-place', Place)
        Vue.component('lq-el-time-picker', TimePicker)
    }
}