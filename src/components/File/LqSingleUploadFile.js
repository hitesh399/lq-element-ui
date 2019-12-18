import Vue from 'vue'
import helper, { isImage } from 'vuejs-object-helper'
import LqForm from './LqForm'

export default Vue.extend({
    name: 'lq-upload-file',
    components: { LqForm },
    props: {
        action: {
            required: true,
            type: String
        },
        id: {
            type: String,
            required: true,
        },
        otherData: Object,
        thumb: {
            type: Object,
            required: false
        },
        rules: Object,
    },
    computed: {
        myLqForm() {
            return this.$refs.lqForm;
        },
        formName() {
            return 'form_' + this.id
        },
        fileObject: function () {
            return helper.getProp(
                this.$store.state.form,
                `${this.formName}.values.${this.id}`,
                {}
            );
        },
        _file: function () {
            return this.fileObject && this.fileObject.file ? this.fileObject.file : null;
        },
        isCropped: function () {
            return helper.getProp(this.fileObject, 'cropped', null);
        }
    },
    render(h) {
        if (!this.lqForm) {
            return h(
                'lq-form',
                {
                    props: {
                        name: this.formName,
                        rules: this.rules ? { [this.id]: this.rules } : undefined
                    },
                    ref: 'lqForm'
                },
                [this.genFile()]
            )
        }
        return this.genFile();

    },
    data() {
        return {
            uploading: false,
            file: null,
            errorRules: []
        }
    },
    methods: {
        genFile() {
            return this.$createElement(
                'lq-v-file',
                {
                    props: {
                        id: this.id,
                        showSelectedFile: false,
                        thumb: this.thumb,
                        ...this.$attrs,
                        multiple: false
                    },
                    on: {
                        changed: (e) => {
                            const rules = this.$refs.lqfile.lqElRules
                            this.file = e;
                            if (!rules) {
                                this.uploadFile()
                            }
                        },
                        cropped: () => {
                            this.uploadFile();
                        },
                        'element-validated': this.whenFileValidated
                    },
                    ref: 'lqfile',
                    scopedSlots: this.$scopedSlots
                },
                this.$slots
            )
        },
        uploadFile() {
            if (this.uploading) { return false }
            this.$emit('uploading');
            this.uploading = true
            const values = { [this.id]: this.$refs.lqfile.formatter() };
            let form = undefined;
            if (this.otherData) {
                form = helper.objectToFormData(this.otherData)
            }
            const formData = helper.objectToFormData(values, form)
            this.$axios.post(this.action, formData)
                .then((response) => {
                    this.$emit('server-success', response)
                    this.uploading = false
                    this.file = null
                }).catch((error) => {
                    this.$emit('server-error', error)
                    this.$refs.lqfile.setValue(null)
                    this.uploading = false
                    this.file = null
                })
        },
        onLocalError(error, errorRules) {
            this.$emit('local-error', error, errorRules)
            this.$refs.lqfile.setValue(null)
        },
        showCropper() {
            if (!this._file) {
                return;
            }
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (event) => {
                if (isImage(event.target.result)) {
                    this.$refs.lqfile.onShowCropBox(this.file)
                }
            }
            fReader.readAsDataURL(this.file.original);
        },
        whenFileValidated(errors, errorRules) {

            if (helper.isObject(errorRules)) {
                let error_rules = [];
                Object.keys(errorRules).forEach(rule => {
                    error_rules = error_rules.concat(rule)
                })
                this.errorRules = error_rules;
            } else {
                this.errorRules = errorRules;
            }
           
            if (!errors && !this.thumb) {
                this.uploadFile()
            } else if (!errors && this.thumb && !this.isCropped) {
                this.showCropper()
            } else if (errors) {
                this.onLocalError(errors, errorRules)
            }
        }
    }
})