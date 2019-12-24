import Vue from 'vue'
import helper from 'vuejs-object-helper';

export default Vue.extend({
    name: 'lq-v-crop',
    props: {
        id: String,
        fileIndex: Number,
        fileObject: {
            type: Object,
            required: true
        },
        viewport: {
            type: Object,
            required: true
        },
        size: {
            type: [String, Object],
            default: () => 'original'
        },
        showZoomer: {
            type: Boolean,
            default: () => true
        },
        enableResize: {
            type: Boolean,
            default: () => true
        },
        circle: {
            type: Boolean,
            default: () => false
        }
    },
    inject: ['lqForm', 'lqFile'],
    render(h) {
        return h(
            'div',
            {
                style: {
                    height: '100%'
                },
            },
            [
                this.genProcessBar(),
                this.imageWarning(),
                this.genCropper()
            ]
        )
    },
    data: function () {
        return {
            rawData: '',
            loading: false,
            target: this.fileIndex !== undefined ? this.id + '.' + this.fileIndex : this.id,
            file: this.fileObject.original,
            orgWidth: null,
            orgHeight: null,
            cropWidth: null,
            cropHeight: null,
            imageLoaded: false,
            showWarning: false
        }
    },
    computed: {
        minWidth() {
            return helper.getProp(this.lqFile.lqElRules, 'file.minImageDimensions.0')
        },
        minHeight() {
            return helper.getProp(this.lqFile.lqElRules, 'file.minImageDimensions.1')
        },
    },
    created() {
        this.readFile();
    },
    watch: {
        file: function () {
            this.readFile();
        }
    },
    methods: {
        readFile() {
            if (!this.file) {
                return;
            }
            this.imageLoaded = false;
            let fReader = new FileReader();
            this.loading = true;
            fReader.onload = (e) => {
                this.rawData = e.target.result;
                this.bindCropper()
                let img = new Image();
                img.onload = (imgEvent) => {
                    const imgE = imgEvent.srcElement ? imgEvent.srcElement : imgEvent.path[0];
                    this.orgWidth = imgE.width;
                    this.orgHeight = imgE.height;
                    this.imageLoaded = true;
                }
                img.src = e.target.result;
            }
            fReader.readAsDataURL(this.file);
        },
        bindCropper: function (orientation) {
            this.$refs.croppieRef.refresh()
            this.$refs.croppieRef.bind({
                url: this.rawData,
                orientation
            })
            this.loading = false;
        },
        changeRotate(degrees) {
            this.$refs.croppieRef.rotate(degrees)
            const orientation = this.$refs.croppieRef.croppie.data.orientation
            this.bindCropper(orientation)
        },
        cropImage: function (callBack) {
            this.getResult('original', (file, dimensions) => {
                if (this.validateSize(dimensions.width, dimensions.height)) {
                    this.getResult(this.lqFile.thumbSize, (newFile) => {
                        this.updateFile(newFile)
                        this.lqFile.validate();
                        this.$emit('cropped', this.fileObject, this.fileIndex);
                        if (typeof callBack === 'function') {
                            callBack(true)
                        }
                    })
                } else {
                    this.cropWidth = dimensions.width
                    this.cropHeight = dimensions.height
                    this.showWarning = true
                    if (typeof callBack === 'function') {
                        callBack(false)
                    }
                }

            })
        },
        getResult(size, callBack) {
            const options = {
                type: 'rawcanvas',
                size: size,
                format: this.circle ? 'png' : this.getFileExt(this.file.name),
                quality: 1,
                circle: this.circle
            }
            this.$refs.croppieRef.result(options, (output) => {
                const name = this.file.name
                const fileType = this.file.type
                output.toBlob((blob) => {
                    let newFile = null;
                    if (typeof File === 'function') {
                        newFile = new File([blob], name, {
                            type: fileType,
                            lastModified: Date.now()
                        });
                    } else {
                        newFile = blob
                        Object.defineProperty(newFile, 'name', {
                            value: name,
                            writable: false
                        });
                        Object.defineProperty(newFile, 'lastModified', {
                            lastModified: Date.now(),
                            writable: false
                        });
                    }
                    let fReader = new FileReader();
                    fReader.onload = (e) => {
                        let img = new Image();
                        img.onload = (imgEvent) => {
                            const imgE = imgEvent.srcElement ? imgEvent.srcElement : imgEvent.path[0];
                            callBack(newFile, { width: imgE.width, height: imgE.height })
                        }
                        img.src = e.target.result;
                    }
                    fReader.readAsDataURL(newFile);

                }, fileType, 100)

            });
        },
        getFileExt(name) {
            let name_arr = name.split('.')
            return name_arr[name_arr.length - 1]
        },
        updateFile(newFile) {
            let elementName = this.target + '.file'
            this.$store.dispatch('form/setElementValue', {
                formName: this.lqForm.name,
                elementName,
                value: newFile
            })
            this.$store.dispatch('form/setElementValue', {
                formName: this.lqForm.name,
                elementName: this.target + '.cropped',
                value: true
            })
            this.$store.dispatch('form/setElementValue', {
                formName: this.lqForm.name,
                elementName: this.target + '.uid',
                value: Date.now()
            })
        },
        createFileName(name, include) {
            let name_arr = name.split('.')
            name_arr[name_arr.length - 1] = include + '.' + name_arr[name_arr.length - 1]
            return name_arr.join('.')
        },
        validateSize(width, height) {
            if (this.minWidth && width < this.minWidth) {
                return false
            }
            if (this.minHeight && height < this.minHeight) {
                return false
            }
            return true;
        },
        genProcessBar() {
            if (!this.loading) return
            return this.$createElement('el-progress', { props: { percentage: 50 } })
        },
        genCropper() {
            return this.$createElement(
                'vue-croppie',
                {
                    ref: 'croppieRef',
                    props: {
                        // enableExif: true,
                        viewport: this.viewport,
                        showZoomer: this.showZoomer,
                        enableResize: this.enableResize,
                        enableOrientation: true,
                        ...this.$attrs
                    }
                }
            )
        },
        imageWarning() {
            if (!this.showWarning) return;
            return this.$createElement(
                'el-alert',
                {
                    props: {
                        type: 'warning',
                        closable: false,
                        title: `Original Image dimensions are ${this.orgWidth}x${this.orgHeight} and after cropped Image dimensions are ${this.cropWidth}x${this.cropHeight} but mininum required dimensions are ${this.minWidth}x${this.minHeight}. So Please Zoom out image and try again.`
                    }
                })
        }
    }
})