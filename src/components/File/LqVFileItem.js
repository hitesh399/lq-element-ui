import Vue from 'vue'
import helper, { isImage } from 'vuejs-object-helper';
import { EventBus } from 'lq-form'

export default Vue.extend({
    name: 'lq-file-item',
    inject: ['lqForm', 'lqFile'],
    provide() {
        return {
            lqFileItem: this
        };
    },
    props: {
        hideDetails: {
            type: Boolean,
            default: () => false
        },
        fileIndex: Number
    },
    data() {
        return {
            loading: false,
            isImage: false,
            imageRawData: '',
            hover: false,
            errorRules: [],
            uploadedFileType: null,
            uploading: false,
            uploadProcess: 0,
        }
    },

    computed: {
        fileObject: function () {
            return helper.getProp(
                this.$store.state.form,
                `${this.lqFile.formName}.values.${this.fileId}`,
                {}
            );
        },
        boxHeight() {
            return this.lqFile.boxHeight ? this.lqFile.boxHeight : 100;
        },
        fileId() {
            return this.fileIndex !== undefined ? `${this.lqFile.id}.${this.fileIndex}` : this.lqFile.id
        },
        fileInitializeValue: function () {
            return helper.getProp(
                this.$store.state.form,
                `${this.lqFile.formName}.initialize_values.${this.fileId}`,
                null
            );
        },
        fileName() {
            return this.file ? this.file.name : this.uploadedFileUrl.substring(this.uploadedFileUrl.lastIndexOf('/') + 1)
        },
        errors() {
            let fileId = this.fileId
            let fileObjectPath = [this.lqForm.name, 'errors', fileId]
            let filePath = [this.lqForm.name, 'errors', fileId, 'file']
            const fileObjectError = helper.getProp(
                this.$store.state.form,
                fileObjectPath,
                null
            )
            const fileError = helper.getProp(
                this.$store.state.form,
                filePath,
                null
            )
            const error1 = helper.isArray(fileObjectError) ? fileObjectError : [];
            const error2 = helper.isArray(fileError) ? fileError : [];
            return error1.concat(error2)
        },
        error() {
            return this.errors.length ? this.errors[0] : null;
        },
        isCropped: function () {
            return helper.getProp(this.fileObject, 'cropped', null);
        },
        originalFile: function () {
            return helper.getProp(this.fileObject, 'original', null);
        },
        uuid: function () {
            return helper.getProp(this.fileObject, 'uid', null);
        },
        file: function () {
            return this.fileObject ? this.fileObject.file : null;
        },
        isBlank: function () {
            return !(this.file || this.uploadedFileUrl)
        },
        uploadedFileUrl: function () {
            const value = helper.getProp(this.fileObject, this.lqFile.valueKey, null);
            if (this.lqFile.storageUrl) {
                return this.lqFile.storageUrl + value;
            } else {
                return value
            }
        },
        previewImage: function () {
            return this.imageRawData ? this.imageRawData : (this.uploadedFileUrl ? this.uploadedFileUrl : '')
        },
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
                fileIndex: this.fileIndex
            }
        }
    },
    render(h) {
        if (this.isBlank) return;
        return h(
            'div',
            {
                class: {
                    item: true,
                    'elevation-5': true,
                    'is-error': !!this.error,
                    ['unique-' + this.uuid]: true,
                    ...this.getCustomClass()
                },
                style: {
                    'min-height': `${(this.boxHeight ? this.boxHeight : 100)}px`,
                    cursor: this.isBlank ? 'pointer' : 'inherit',
                    position: 'relative'
                }
            },
            [
                this.$createElement(
                    'el-row',
                    {
                        attrs: {
                        },
                        style: {
                            margin: 0
                        },
                    },
                    [
                        this.genItemWrapper(),
                    ]
                )
            ]
        )
    },
    methods: {
        getCustomClass() {
            return this.lqFile.itemClass ? {
                [this.lqFile.itemClass]: true
            } : {}
        },
        genItemWrapper() {
            if (this.$scopedSlots.items) {
                return this.$scopedSlots.items(this.itemScoped)
            }
            return this.$createElement(
                'div',
                {},
                [ this.lqFile.showThumbView && ( this.isImage || this.uploadedFileType === 'image') ? this.genImageItem() : this.genActionItem()]
            )
        },
        genImageItem() {
            return this.$createElement(
                'el-card',
                {
                    props: {
                        shadow: this.lqFile.shadow
                    }
                },
                [
                    this.$createElement(
                        'el-image',
                        {
                            props: {
                                src: this.previewImage,
                                aspectRatio: this.lqFile.thumb ? this.lqFile.thumb.width / this.lqFile.thumb.height : this.lqFile.aspectRatio,
                                class: {
                                    grey: true,
                                    'lighten-2': true
                                }
                            }
                        }
                    ),
                    this.genActionItem()
                ]
            )
        },
        genUploadProcess() {
            if (this.$scopedSlots.uploading) {
                return this.$scopedSlots.items({
                    uploadProcess: this.uploadProcess,
                    uploading: this.uploading
                });
            }
            return this.$createElement('v-layout', {
                style: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)'
                },

            }, [
                this.$createElement('v-layout', {
                    attrs: {
                        'align-center': true,
                        'justify-center': true
                    }
                }, [
                    this.$createElement('div', {
                        class: {
                            'text-xs-center': true,
                        },

                    }, [
                        this.$createElement('v-progress-circular', {
                            props: {
                                rotate: 360,
                                size: 100,
                                width: 5,
                                value: this.uploadProcess,
                                color: 'teal'
                            }
                        }, this.uploadProcess)
                    ])
                ])
            ])

        },
        genActionItem() {
            return this.$createElement(
                'div',
                {
                    class: 'file-actions',
                    attrs: {

                    }
                },

                [
                    this.$createElement('span', { class: 'file-name' }, this.fileName),
                    this.$createElement('div', {
                        class: 'bottom clearfix'
                    }, [
                        this.genDeleteBtn(),
                        this.genChangeBtn(),
                        this.genCropBtn(),
                        this.genResetBtn(),
                        this.genViewBtn(),
                    ])
                ]
            )
        },
        genDeleteBtn() {
            const self = this;
            return this.$createElement(
                'el-button',
                {
                    props: {
                        icon: this.lqFile.deleteIcon,
                        plain: true,
                        type: 'text'
                    },
                    attrs: {
                        title: this.lqFile.deleteIconTitle
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.$emit('delete', self.fileObject, self.fileIndex)
                        }
                    }
                })
        },
        genMessages() {
            if (this.hideDetails) return null
            // console.log('this.error', this.error)
            if (this.error) {
                return this.$createElement(
                    'v-alert',
                    {
                        props: {
                            title: this.error,
                            type: 'error'
                        }
                    }
                )
            }
        },
        genChangeBtn() {
            if (!this.lqFile.showChangeBtn) {
                return;
            }
            const self = this;
            return this.$createElement(
                'el-button',
                {
                    props: {
                        icon: this.lqFile.changeIcon,
                        plain: true,
                        type: 'text'
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.$emit('open-window', self.fileIndex)
                        }
                    },
                    attrs: {
                        title: self.lqFile.changeIconTitle
                    },
                })
        },
        genViewBtn() {
            if (!this.lqFile.showViewBtn) {
                return;
            }
            const self = this;
            return this.$createElement(
                'el-button',
                {
                    props: {
                        icon: this.lqFile.viewIcon,
                        plain: true,
                        type: 'text'
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.viewFile()
                        }
                    },
                    attrs: {
                        title: self.lqFile.viewIconTitle
                    },
                }
            )
        },
        viewFile() {
            const file = this.file;
            if (file) {
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            } else {
                window.open(this.uploadedFileUrl, '_blank');
            }
        },
        genResetBtn() {
            const self = this;
            if (!this.fileInitializeValue || !this.file || !this.lqFile.showResetBtn) {
                return null;
            }
            return this.$createElement(
                'el-button',
                {
                    props: {
                        icon: self.lqFile.resetIcon,
                        plain: true,
                        type: 'text'
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.resetFile()
                        }
                    }
                })
        },
        resetFile() {
            if (this.fileInitializeValue) {
                const fileval = { ...this.fileInitializeValue }
                this.$store.dispatch('form/setElementValue', {
                    formName: this.lqFile.formName,
                    elementName: this.fileId,
                    value: fileval
                });
            }
        },
        genCropBtn() {
            if (!this.canShowCropper()) { return }
            const self = this;
            if (!(this.isImage && this.file && this.lqFile.thumb)) {
                return
            }
            return this.$createElement(
                'el-button',
                {
                    props: {
                        icon: this.lqFile.cropIcon,
                        plain: true,
                        type: 'text'
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            self.openCropper()
                        }
                    }
                })
        },
        openCropper() {
            this.$emit('open-cropper', this.fileObject, this.fileIndex)
        },
        readFile(showCroped = true) {
            if (!this.file) {
                this.imageRawData = null;
                this.uploadedFileType = 'file';
                this.isImage = false;
                this.findUploadedFileType(this.uploadedFileUrl)
                return;
            }
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (e) => {
                this.isImage = isImage(e.target.result) ? true : false;
                this.afterFileReadAction(showCroped)
                this.loading = false;
                this.imageRawData = e.target.result;
            }
            fReader.readAsDataURL(this.file);
        },
        afterFileReadAction(showCroped) {
            if (showCroped && this.isImage && !this.isCropped && this.lqFile.thumb && this.fileIndex === undefined) {
                if (!this.lqFile.lqElRules) {
                    this.$emit('open-cropper', this.fileObject, this.fileIndex)
                }
            }
        },
        findUploadedFileType(url) {
            if (!url) {
                this.uploadedFileType = null;
                return;
            }

            let img = new Image();
            img.onload = (e) => {
                if (e.type === 'load') {
                    this.uploadedFileType = 'image'
                } else {
                    this.uploadedFileType = 'file'
                }
            }
            img.src = url;
        },
        whenFileValidated(errors, error_in_rules) {
            this.errorRules = error_in_rules;
            if (this.canShowCropper() && this.isImage && !this.isCropped && this.lqFile.thumb && this.fileIndex === undefined) {
                this.$emit('open-cropper', this.fileObject, this.fileIndex)
            }
        },
        canShowCropper() {
            if (
                !this.error ||
                !this.errorRules ||
                this.errorRules.length === 0 ||
                (
                    this.errors.length === 1 && (this.errorRules[0] === 'file:crop' || this.errorRules[0] === 'upload')
                )
                ||
                (
                    this.errors.length === 2 && this.errorRules.includes('file:crop') && this.errorRules.includes('upload')
                )
            ) {
                return true;
            }
            return false;
        }
    },
    created() {
        EventBus.$on('lq-element-validated-' + this.lqForm.formName + '-' + this.fileId, this.whenFileValidated)
    },
    beforeDestroy() {
        EventBus.$off('lq-element-validated-' + this.lqForm.formName + '-' + this.fileId, this.whenFileValidated)
    },
    watch: {
        uuid: {
            handler: function (newUid, olduid) {
                if (newUid !== olduid) {
                    this.readFile()
                }
            },
            deep: true,
            immediate: true
        },
        uploadedFileUrl: {
            handler: function (newUrl) {
                this.findUploadedFileType(newUrl);
            },
            immediate: true
        }
    },
})