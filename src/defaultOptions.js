const lqOptions = {
    options: {
        rowsPerPageItems: [10, 15, 30, 50, 100, 200, 500],
        itemKey: 'id',
        pageSize: 30,
        keepSelected: true,
        autoFilter: true,
        dataKey: 'data.data',
        keepSelectedOnPageChange: true,
        keepAlive: true,
        loadingText: 'Fetching...',
        noDataText: 'No data available',
        noResultsText: 'No matching records found',
        ascStr: 'ascending',
        descStr: 'descending',
        pageKey: 'page',

        // File Options
        cropperPopupWidth: 400,
        rotateRightIcon: 'fa-repeat',
        rotateLeftIcon: 'fa-undo',
        deleteIcon: 'fa-trash',
        changeIcon: 'fa-file',
        cropIcon: 'fa-crop',
        addIcon: 'el-icon-plus',
        viewIcon: 'fa-eye',
        deleteIconTitle: 'Delete',
        changeIconTitle: 'Change',
        cropIconTitle: 'Crop',
        addIconTitle: 'Add',
        viewIconTitle: 'View',
        primaryKey: 'id',
        resetIconTitle: 'Reset',
        resetIcon: 'fa-refresh',
        uploadUrl: 'http://localhost/lq_server_sample/public/api/media',
        tokenUrl: 'http://localhost/lq_server_sample/public/api/media-token',
        uploadFileName: 'file',
        uploadResponseKey: 'data.media',
        formatterFnc: function (onlyPrimary = false) {
            let fileObject = !this.multiple && this.fileObject ? [this.fileObject] : this.fileObject;
            if (!fileObject) return
            let outPut = fileObject.map(f => {
                const primaryVal = f[this.primaryKey] ? f[this.primaryKey] : ''
                return onlyPrimary ? primaryVal : {
                    file: f.file ? f.file : '',
                    [this.primaryKey]: primaryVal,
                }
            });
            return !this.multiple && outPut ? outPut[0] : outPut;
        },
        uploadFnc: async function () {
            // console.log('I am ok.')
            if (this.uploading) { return false }
            if (this.error && !this.isOnlyUploadError()) { return false }
            const token = await this.generateToken()
            this.upload(token.data.media_token.token)

        }
    },
    get rowsPerPageItems() {
        return this.options.rowsPerPageItems
    },
    get ascStr() {
        return this.options.ascStr
    },
    get pageKey() {
        return this.options.pageKey
    },
    get dataKey() {
        return this.options.ascStr
    },
    get descStr() {
        return this.options.descStr
    },
    get itemKey() {
        return this.options.itemKey
    },
    get pageSize() {
        return this.options.pageSize
    },
    get keepSelected() {
        return this.options.keepSelected
    },
    get autoFilter() {
        return this.options.autoFilter
    },
    get loadingText() {
        return this.options.loadingText
    },
    get noDataText() {
        return this.options.noDataText
    },
    get keepSelectedOnPageChange() {
        return this.options.keepSelectedOnPageChange
    },
    get keepAlive() {
        return this.options.keepAlive
    },
    get noResultsText() {
        return this.options.noResultsText
    },


    // File Getter
    get uploadUrl() {
        return this.options.uploadUrl
    },
    get primaryKey() {
        return this.options.primaryKey
    },
    get formatterFnc() {
        return this.options.formatterFnc
    },
    get uploadResponseKey() {
        return this.options.uploadResponseKey
    },
    get uploadFnc() {
        return this.options.uploadFnc
    },
    get uploadFileName() {
        return this.options.uploadFileName
    },
    get tokenUrl() {
        return this.options.tokenUrl
    },
    get cropperPopupWidth() {
        return this.options.cropperPopupWidth
    },
    get rotateRightIcon() {
        return this.options.rotateRightIcon
    },
    get rotateLeftIcon() {
        return this.options.rotateLeftIcon
    },
    get deleteIcon() {
        return this.options.deleteIcon
    },
    get changeIcon() {
        return this.options.changeIcon
    },
    get cropIcon() {
        return this.options.cropIcon
    },
    get addIcon() {
        return this.options.addIcon
    },
    get viewIcon() {
        return this.options.viewIcon
    },
    get deleteIconTitle() {
        return this.options.deleteIconTitle
    },
    get changeIconTitle() {
        return this.options.changeIconTitle
    },
    get cropIconTitle() {
        return this.options.cropIconTitle
    },
    get addIconTitle() {
        return this.options.addIconTitle
    },
    get viewIconTitle() {
        return this.options.viewIconTitle
    },
    get resetIconTitle() {
        return this.options.resetIconTitle
    },
    get resetIcon() {
        return this.options.resetIcon
    },
    merge: function (options) {
        this.options = {
            ...this.options,
            ...this.extractOptions(options)
        }
    },
    extractOptions(attrs) {
        const option_keys = Object.keys(this.options)
        let data = {}
        option_keys.forEach(k => {
            const val = attrs[k]
            if (val !== undefined) {
                data[k] = val
            }
        })
        return data;
    }
}
export { lqOptions }