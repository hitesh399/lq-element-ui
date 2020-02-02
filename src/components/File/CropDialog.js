import Vue from 'vue'
import LqCrop from './LqCrop';

export default Vue.extend({
    name: 'crop-box',
    inject: ['lqFile'],
    components: {
        LqCrop
    },
    data() {
        return {
            actionAreaWidth: 0,
            cropping: false,
            degrees: 0
        }
    },
    computed: {
        dialog() {
            return this.lqFile.showCropBox
        },
        getViewPort() {
            let viewPort = { ...this.getBoundary }
            viewPort.width = viewPort.width - 20;
            viewPort.height = viewPort.height - 20;
            return viewPort
        },
        getBoundary() {
            const newWidth = this.actionAreaWidth
            const aspectRatio = (this.lqFile.thumb.width / this.lqFile.thumb.height)
            const newHeight = (newWidth / aspectRatio)
            return {
                height: newHeight,
                width: newWidth
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.actionAreaWidth = this.$refs.CardText ? this.$refs.CardText.offsetWidth : this.lqFile.thumb.width
        })
    },
    render(h) {
        if (!this.dialog) {
            return null;
        }
        const self = this;

        return h(
            'el-dialog',
            {
                props: {
                    visible: this.dialog,
                    title: this.lqFile.popupTitle,
                    width: this.lqFile.popupWidth.toString() + 'px',
                    closeOnClickModal: !this.lqFile.croppPopupPersistent,
                    appendToBody: true
                },
                attrs: {
                    // width: 600
                },
                on: {
                    close: () => {
                        self.$emit('close', self.lqFile.fileObjectToCrop, self.lqFile.fileIndexToCrop)
                        self.lqFile.onHideCropBox(false)
                    }
                }
            },
            [


                h(
                    'div',
                    {
                        style: {
                            height: '100%'
                        },
                        ref: 'CardText'
                    },
                    [
                        h(
                            'lq-crop',
                            {
                                props: {
                                    id: this.lqFile.id,
                                    fileIndex: this.lqFile.fileIndexToCrop,
                                    fileObject: this.lqFile.fileObjectToCrop,
                                    viewport: this.getViewPort,
                                    size: this.lqFile.thumbSize,
                                    enableResize: this.lqFile.enableResize
                                },
                                attrs: {
                                    boundary: this.getBoundary,
                                },
                                on: {
                                    cropped() {
                                        self.lqFile.onHideCropBox()
                                    }
                                },
                                ref: 'cropper'
                            }
                        )
                    ]
                ),
                this.genFooter()

            ]
        )
    },
    methods: {
        genFooter() {
            const self = this;
            return this.$createElement('div', {
                slot: 'footer'
            }, [
                this.genRotateBtn(),
                this.genRotateBtn('left'),
                this.$createElement(
                    'el-button',
                    {
                        props: {
                            color: 'green darken-1',
                            flat: true,
                            icon: this.lqFile.cropIcon,
                            disabled: self.cropping
                        },
                        on: {
                            click(event) {
                                self.cropping = true
                                event.stopPropagation()
                                self.$refs.cropper.cropImage(() => {
                                    self.cropping = false
                                })
                            }
                        }
                    },
                ),
            ])
        },
        genRotateBtn(moveTo = 'right') {
            const self = this;
            if (!this.lqFile.enableRotate) return
            return this.$createElement(
                'el-button',
                {
                    props: {
                        icon: moveTo === 'right' ? this.lqFile.rotateRightIcon : this.lqFile.rotateLeftIcon,
                        disabled: self.cropping,
                    },
                    on: {
                        click: function (event) {
                            event.stopPropagation()
                            const degrees = (moveTo == 'left') ? -90 : 90;
                            self.degrees = self.degrees + degrees;
                            if (moveTo == 'left' && self.degrees < -360) {
                                self.degrees = -90
                            }
                            if (moveTo == 'right' && self.degrees > 360) {
                                self.degrees = 90
                            }

                            self.$refs.cropper.changeRotate(self.degrees)
                        }
                    }
                }

            )
        }
    }
})