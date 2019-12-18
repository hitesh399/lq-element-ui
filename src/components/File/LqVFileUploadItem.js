import LqVFileItem from './LqVFileItem'
import helper from 'vuejs-object-helper'

export default LqVFileItem.extend({
    name: 'lq-v-file-item-upload',
    inject: ['lqFileUpload'],
    computed: {
        itemScoped() {
            return {
                isImage: this.isImage,
                loading: this.loading,
                rawData: this.imageRawData,
                deleteFnc: () => this.$emit('delete', this.fileObject, this.fileIndex),
                changeFnc: () => this.$emit('open-window', this.fileIndex),
                viewFnc: () => this.viewFile,
                resetFnc: () => this.resetFile,
                cropFnc: () => this.openCropper,
                canShowCropper: this.canShowCropper,
                previewImage: this.previewImage,
                fileObject: this.fileObject,
                fileIndex: this.fileIndex,
                uploadFnc: this.uploadFile,
                errors: this.errors
            }
        }
    },
    methods: {
        uploadFile() {
            let fnc = this.lqFileUpload.uploadFnc;
            if (typeof fnc === 'function') {
                fnc.call(this)
            } else {
                throw Error('Upload function is Required.')
            }
        },
        async generateToken() {
            try {
                this.lqForm.ready(false);
                this.uploading = true
                return await this.$axios.post(
                    this.lqFileUpload.tokenUrl,
                    {
                        size: this.file.size,
                        name: this.file.name,
                        path: this.lqFileUpload.uploadPath,
                    }
                )
            }
            catch (err) {
                this.afterUploadFail(err)
            }
        },
        upload(token) {
            this.lqForm.ready(false);
            this.uploadProcess = 0
            const values = {
                [this.lqFileUpload.fileName]: { file: this.file },
                token,
                [this.lqFileUpload.primaryKey]: helper.getProp(this.fileObject, this.lqFileUpload.primaryKey, null)
            };
            const formData = helper.objectToFormData(values)
            return this.uploadFileOnServer(formData)
        },
        uploadFileOnServer(formData) {
            this.uploading = true
            return this.$axios.post(this.lqFileUpload.uploadUrl, formData,
                {
                    onUploadProgress: (progressEvent) => {
                        this.uploadProcess = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    }
                }).then((response) => {
                    this.afterUploadSuccess(response)

                }).catch((error) => {
                    this.afterUploadFail(error)
                })
        },
        afterUploadFail(error) {
            this.$emit('server-error', error)
            this.uploading = false
            this.fireWhenUploadCompleted()
        },
        afterUploadSuccess(response) {
            this.$emit('server-success', response)
            let final_data = {
                ...this.fileObject,
                ...helper.getProp(response, this.lqFileUpload.uploadResponseKey)
            }
            delete final_data.file
            delete final_data.original
            delete final_data.uid
            this.uploading = false
            this.$store.dispatch('form/setElementValue', {
                formName: this.lqFileUpload.lqForm.name,
                elementName: this.fileId,
                value: final_data
            });
            this.fireWhenUploadCompleted()
        },
        afterFileReadAction(showCroped) {
            LqVFileItem.options.methods.afterFileReadAction.call(this, showCroped)
            if (( !this.lqFile.thumb || (this.lqFile.thumb  && this.isCropped) ) && !this.lqFile.lqElRules && this.lqFile.uploadOnChange) {
                this.uploadFile()
            }
        },
        async fireWhenUploadCompleted() {
            if (!this.lqFileUpload.fileItems.some(v => v.uploading)) {
                this.lqForm.ready(true);
                await this.lqFileUpload.validate(true, true, false, false)
                this.$emit('upload-completed');
            }
        },
        whenFileValidated(errors, error_in_rules) {
            LqVFileItem.options.methods.whenFileValidated.call(this, errors, error_in_rules)
            if (
                (!errors || this.isOnlyUploadError())
                && (!this.lqFile.thumb || (this.lqFile.thumb && this.isCropped))
                && this.lqFile.uploadOnChange) {
                this.uploadFile()
            }
        },
        isOnlyUploadError() {
            return (this.errorRules.length === 1 && this.errorRules[0] === 'upload');
        }
    },
    created() {
        this.lqFileUpload.fileItems.push(this)
    },
    beforeDestroy() {
        let index = null
        this.lqFileUpload.fileItems.every((file, i) => {
            if (file._uid === this._uid) {
                index = i
                return false;
            } else {
                return true;
            }
        })
        if (index !== null) {
            this.lqFileUpload.fileItems.splice(index, 1)
        }
    }
})