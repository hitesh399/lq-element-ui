const lqOptions = {
    options: {
        rowsPerPageItems: [10, 15, 30, 50, 100, 200, 500],
        itemKey: 'id',
        pageSize: 30,
        keepSelected: true,
        autoFilter: true,
        keepSelectedOnPageChange: true,
        keepAlive: true,
        loadingText: 'Fetching...',
        noDataText: 'No data available',
        noResultsText: 'No matching records found',
        can: null
    },
    get rowsPerPageItems() {
        return this.options.rowsPerPageItems
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
    get can () {
        return this.options.can
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