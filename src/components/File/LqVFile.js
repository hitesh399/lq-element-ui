import Vue from 'vue'
import { lqFileMixin, lqPermissionMixin, lqElementMixin } from 'lq-form';
import helper from 'vuejs-object-helper';
import FileItem from './LqVFileItem'
import CropDialog from './CropDialog'
import validate from 'validate.js'
import { lqOptions } from '../../defaultOptions'

export default Vue.extend({
    name: 'lq-el-file',
    mixins: [lqElementMixin, lqPermissionMixin, lqFileMixin],
    components: {
        FileItem,
        CropDialog
    },
    provide() {
        return {
            lqFile: this
        };
    },
    props: {
        boxHeight: Number,
        croppPopupPersistent: {
            type: Boolean,
            default: () => true
        },
        popupWidth: {
            type: Number,
            default: () => lqOptions.cropperPopupWidth
        },
        multiple: {
            type: Boolean,
            default: () => false
        },
        valueKey: {
            type: String,
            default: () => 'path'
        },
        circle: {
            type: Boolean,
            default: () => false
        },
        thumb: {
            type: Object,
            required: false
        },
        allwaysShowSelector: {
            type: Boolean,
            default: () => false
        },
        popupTitle: String,
        aspectRatio: {
            type: Number,
            default: () => 1
        },
        thumbSize: {
            type: [String, Object],
            default: () => 'original'
        },
        flexProps: {
            type: Object,
            default: () => {
                return { xs: 12, sm: 6, md: 4, lg: 3 }
            }
        },
        itemLocation: {
            type: String,
            default: () => 'prepend'
        },
        storageUrl: {
            type: String,
            default: () => lqOptions.storageUrl
        },
        hideDetails: {
            type: Boolean,
            default: () => false
        },
        hideItemError: {
            type: Boolean,
            default: () => false
        },
        errorCount: {
            type: Number,
            default: () => 1
        },
        enableResize: {
            type: Boolean,
            default: () => false
        },
        showSelectedFile: {
            type: Boolean,
            default: () => true
        },
        enableRotate: {
            type: Boolean,
            default: () => true
        },
        rotateRightIcon: {
            type: String,
            default: () => lqOptions.rotateRightIcon
        },
        rotateLeftIcon: {
            type: String,
            default: () => lqOptions.rotateLeftIcon
        },
        deleteIcon: {
            type: String,
            default: () => lqOptions.deleteIcon
        },
        changeIcon: {
            type: String,
            default: () => lqOptions.changeIcon
        },
        cropIcon: {
            type: String,
            default: () => lqOptions.cropIcon
        },
        addIcon: {
            type: String,
            default: () => lqOptions.addIcon
        },
        viewIcon: {
            type: String,
            default: () => lqOptions.viewIcon
        },
        deleteIconTitle: {
            type: String,
            default: () => lqOptions.deleteIconTitle
        },
        changeIconTitle: {
            type: String,
            default: () => lqOptions.changeIconTitle
        },
        cropIconTitle: {
            type: String,
            default: () => lqOptions.cropIconTitle
        },
        addIconTitle: {
            type: String,
            default: () => lqOptions.addIconTitle
        },
        viewIconTitle: {
            type: String,
            default: () => lqOptions.viewIconTitle
        },
        formatterFnc: {
            type: Function,
            default: lqOptions.formatterFnc
        },
        showViewBtn: {
            type: Boolean,
            default: () => false
        },
        showChangeBtn: {
            type: Boolean,
            default: () => true
        },
        resetIconTitle: {
            type: String,
            default: () => lqOptions.resetIconTitle
        },
        showResetBtn: {
            type: Boolean,
            default: () => false
        },
        enableDropZone: {
            type: Boolean,
            default: () => true
        },
        resetIcon: {
            type: String,
            default: () => lqOptions.resetIcon
        },
        primaryKey: {
            type: String,
            default: () => lqOptions.primaryKey
        },
        layoutTag: {
            type: String,
            default: () => 'el-row'
        },
        resetOnDelete: {
            type: Boolean,
            default: () => false
        },
        layoutProps: {
            type: Object,
            default: () => {
                return {
                    gutter: 10,
                    align: 'middle',
                    justify: 'center',
                    // type: 'flex'
                }
            }
        },
        uploadOnChange: {
            type: Boolean,
            default: () => true
        },
        itemClass: [String, Array],
        wrapperClass: String,
        rowClass: Array,
        clickEveryWhere: {
            type: Boolean,
            default: () => false
        },
        shadow: {
            type: String,
            default: () => 'hover'
        }
    },
    data() {
        return {
            openBrowser: false,
            showCropBox: false,
            fileObjectToCrop: null,
            fileIndexToCrop: null,
            inputFileMultiple: false,
            fileIndexTochange: undefined
        }
    },
    computed: {
        showAddBtn: function () {
            if (!this.multiple && (!this.fileObject || !this.fileObject.id || !this.fileObject.uid)) {
                return this.fileObject && (this.fileObject.id || this.fileObject.uid) ? false : true;
            } else if (this.multiple && (!this.maxNoOfFiles || this.fileObject.length < this.maxNoOfFiles)) {
                return true;
            } else {
                return false;
            }
        },
        validations() {
            return this.errors.slice(0, Number(this.errorCount))
        },
        hasItem() {
            return !validate.isEmpty(this.fileObject)
        },
        maxNoOfFiles: function () {
            return helper.getProp(this.lqElRules, 'file.max');
        },
        fileObject: function () {
            return helper.getProp(
                this.$store.state.form,
                `${this.formName}.values.${this.id}`,
                this.multiple ? [] : null
            );
        },
        fileInitializeValue: function () {
            return helper.getProp(
                this.$store.state.form,
                `${this.formName}.initialize_values.${this.id}`,
                this.multiple ? [] : null
            );
        },
        topBottomScope() {
            return {
                openWindow: this.handleClick
            }
        }
    },
    render(h) {
        if (!this.isShow) return null;
        const addBtn = [
            this.showAddBtn || this.allwaysShowSelector ? this.renderDefaultSlot() : null
        ];
        const fileItems = this.renderItems();
        const items = this.itemLocation === 'prepend' ? fileItems.concat(addBtn) : addBtn.concat(fileItems)

        return h(
            'div',
            {
                class: {
                    'has-errors': this.errors && this.errors.length ? true : false,
                    [this.wrapperClass]: this.wrapperClass ? true : false
                },
                on: {
                    dragover: (e) => { e.preventDefault(); },
                    drop: this.onDrag,
                    click: this.clickOnWrapper
                }
            },
            [
                this.$scopedSlots.top ? this.$scopedSlots.top(this.topBottomScope) : null,
                this.genInputFile(),
                this.$createElement(
                    this.layoutTag,
                    {
                        props: this.layoutProps,
                        attrs: this.layoutProps,
                        class: this.rowClass
                    },
                    items
                ),
                this.$scopedSlots.bottom ? this.$scopedSlots.bottom(this.topBottomScope) : null,
                this.showCropBox ? h(
                    'crop-dialog',
                    {
                        on: {
                            close: this.dialogClosedWithoutCrop
                        }
                    }
                ) : null,
                this.genMessages()
            ]
        )
    },
    methods: {
        genMessages() {
            if (this.hideDetails) return null
            if (this.errors.length) {
                return this.$createElement(
                    'el-alert',
                    {
                        props: {
                            title: this.validations[0],
                            type: 'error'
                        }
                    }
                )
            }
        },
        onDrag(e) {
            e.preventDefault();
            if (!e.dataTransfer.files || !this.enableDropZone) {
                return;
            }
            this.fileChanged({ target: e.dataTransfer })
        },
        clickOnWrapper(e) {
            e.stopPropagation();
            if (this.clickEveryWhere) {
                this.handleClick()
            } else {
                return;
            }
        },
        renderDefaultSlot() {
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default(
                    {
                        openWindow: this.handleClick,
                        errors: this.errors
                    }
                )
            }
            return this.genItemContainer([this.genDefaultSelector()])
        },
        renderItems() {
            if (!this.hasItem || !this.showSelectedFile) {
                return [null]
            }
            if (!this.multiple) {
                return [this.genItemContainer([this.genFileItem(undefined)])];
            } else {
                return this.fileObject.map((file, index) => {
                    return [this.genItemContainer([this.genFileItem(index)])]
                })
            }
        },
        genInputFile() {
            return this.$createElement(
                'input',
                {
                    attrs: {
                        id: `${this.formName}_${this.id}`,
                        name: this.id,
                        type: 'file',
                        multiple: this.inputFileMultiple,
                    },
                    style: {
                        display: 'none'
                    },
                    on: {
                        click: this.clickOnInputFile,
                        change: this.fileChanged
                    },
                    ref: 'input'
                }
            )
        },
        genDefaultSelector() {
            return this.$createElement(
                'div',
                {
                    style: {
                        'min-height': `${(this.boxHeight ? this.boxHeight : 100)}px`,
                        'height': '100%',
                        cursor: !this.isDisabled ? 'pointer' : 'inherit'
                    },
                    class: {
                        item: true,
                        'elevation-5': true
                    },
                    on: {
                        click: (e) => { e.stopPropagation(); this.handleClick() },
                    }
                    // nativeOn: {}
                },
                [
                    this.$createElement(
                        'el-row',
                        {
                            style: {
                                margin: 0,
                                'min-height': `${(this.boxHeight ? this.boxHeight : 100)}px`,
                                'height': '100%',
                            },
                            props: {
                                align: 'middle',
                                justify: 'center',
                                type: 'flex'
                            },

                        },

                        [
                            this.$createElement('i', {
                                class: [this.addIcon]
                            })
                        ]
                    )
                ]
            )
        },
        genItemContainer(content) {
            return this.$createElement(
                'el-col',
                {
                    props: this.flexProps
                },
                content
            )
        },
        genFileItem(fileIndex) {
            return this.$createElement(
                'file-item',
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
                        'open-cropper': this.onShowCropBox
                    },
                    scopedSlots: {
                        items: this.$scopedSlots.items,
                        uploading: this.$scopedSlots.uploading
                    }
                }
            )
        },
        fileChanged(event) {
            const id = helper.isObject(this.fileObject) ? helper.getProp(this.fileObject, this.primaryKey, null) : null
            this.handleFileChange(event, this.fileIndexTochange);
            if (id) {
                this.$store.dispatch('form/setElementValue', {
                    formName: this.lqForm.name,
                    elementName: `${this.id}.${this.primaryKey}`,
                    value: id
                });
            }
            this.fileIndexTochange = undefined
            this.inputFileMultiple = this.multiple
            this.openBrowser = false;
            this.testDirty(this.fileObject)
        },
        __formatter(fileObject) {
            let fnc = this.formatterFnc;
            if (typeof fnc === 'function') {
                return fnc.call({ multiple: this.multiple, fileObject: fileObject, primaryKey: this.primaryKey })
            } else {
                throw Error('formatter function is Required.')
            }
        },
        formatter() {
            return this.__formatter(this.fileObject)
        },
        clickOnInputFile() {
            document.body.onfocus = this.checkIt;
        },
        checkIt() {
            if (!this.$refs.input.value.length) {
                document.body.onfocus = null;
                this.openBrowser = false;
            }
        },
        onShowCropBox(fileObject, fileIndex) {
            this.showCropBox = true;
            this.fileIndexToCrop = fileIndex;
            this.fileObjectToCrop = fileObject;
        },
        onHideCropBox(emit = true) {
            this.showCropBox = false;
            this.fileIndexToCrop = null;
            this.fileObjectToCrop = null;
            this.testDirty(this.fileObject)
            if (emit) {
                this.$emit('cropped')
            }

        },
        handleClick(fileIndex) {
            if (!this.isDisabled) {
                this.openBrowser = true;
                if (fileIndex !== undefined) {
                    this.fileIndexTochange = fileIndex
                    this.inputFileMultiple = false;
                }
                this.$refs.input.value = null;
                this.$refs.input.click();
            }
        },
        onFileDelete(file, index) {
            if (this.$listeners.delete) {
                this.$listeners.delete({
                    deleteLocalFile: () => this.deleteFile(file),
                    file: file,
                    index: index
                });
            } else {
                this.deleteFile(file)
            }
        },
        dialogClosedWithoutCrop(file, index) {
            if (this.$listeners['close-dialog']) {
                this.$listeners['close-dialog']({
                    deleteLocalFile: () => this.deleteFile(file),
                    file: file,
                    index: index
                });
            } else {
                // console.log('I am calling Here.')
                this.deleteFile(file, true)
            }
        },
        deleteFile(file, forceretore) {

            if (!this.touch) {
                this.touchStatus(true);
            }
            if (!this.multiple) {
                this.setValue(null, false, false)
                if (this.fileInitializeValue && this.resetOnDelete || forceretore) {
                    const fileval = { ...this.fileInitializeValue }
                    this.$store.dispatch('form/setElementValue', {
                        formName: this.lqForm.name,
                        elementName: this.id,
                        value: fileval
                    });
                }
                this.validate();

            } else {
                this.fileObject.every((f, index) => {
                    if ((f.id && f.id === file.id) || f.uid === file.uid) {
                        this.remove(this.id + '.' + index);
                        return;
                    } else {
                        return true;
                    }
                });
            }
            this.testDirty(this.fileObject)
        }
    },
    created() {
        this.inputFileMultiple = this.multiple;
        this.$lqForm.addProp(this.formName, this.id, 'formatter', this.formatter)
    }
})