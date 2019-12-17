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
        pageKey: 'page'
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