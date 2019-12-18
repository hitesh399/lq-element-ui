import LqVFile from './LqVFile'
import LqVFileUploadItem from './LqVFileUploadItem'
import { lqFileOptions } from '../defaultOptions'

export default LqVFile.extend({
    name: 'lq-v-file-upload',
    components: { LqVFileUploadItem },
    provide() {
        return {
            lqFileUpload: this
        };
    },
    props: {
        uploadUrl: {
            type: String,
            default: () => lqFileOptions.uploadUrl
        },
        tokenUrl: {
            type: String,
            default: () => lqFileOptions.tokenUrl
        },
        fileName: {
            type: String,
            default: () => lqFileOptions.uploadFileName
        },
        uploadFnc: {
            type: Function,
            default: lqFileOptions.uploadFnc
        },
        uploadPath: {
            type: String,
            default: () => ''
        },
        uploadResponseKey: {
            type: String,
            default: () => lqFileOptions.uploadResponseKey
        }
    },
    data() {
        return {
            fileItems: []
        }
    },
    computed: {
        topBottomScope() {
            return {
                openWindow: this.handleClick,
                uploadFnc: this.startUploading,
                totalItems: this.totalItems,
                processItems: this.processItems,
            }
        },
        totalItems() {
            return this.fileItems.filter(v => v.file).length
        },
        processItems() {
            return this.fileItems.filter(v => v.uploading).length
        }
    },
    methods: {
        genFileItem(fileIndex) {
            return this.$createElement(
                'lq-v-file-upload-item',
                {
                    props: {
                        fileIndex,
                        hideDetails: this.hideItemError
                    },
                    on: {
                        delete: (file, index) => {
                            this.onFileDelete(file, index)
                        },
                        'open-window': this.handleClick,
                        'open-cropper': this.onShowCropBox,
                        'upload-completed': () => { this.$emit('upload-completed') }
                    },
                    scopedSlots: {
                        items: this.$scopedSlots.items,
                        uploading: this.$scopedSlots.uploading
                    }
                }
            )
        },
        startUploading() {
            this.fileItems.forEach(v => v.uploadFile())
        },
        handleClick(fileIndex) {
            if (!this.multiple && this.processItems >= 1) { return }
            LqVFile.options.methods.handleClick.call(this, fileIndex)
        },
        onDrag(e) {
            // e.preventDefault();
            if (!this.multiple && this.processItems >= 1) { return }
            LqVFile.options.methods.onDrag.call(this, e)
        },
        formatter() {
            let fnc = this.formatterFnc;
            if (typeof fnc === 'function') {
                return fnc.call(this, true)
            } else {
                throw Error('formatter function is Required.')
            }
        },
    }
})