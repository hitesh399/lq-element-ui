import Vue from 'vue'
import { lqOptions } from '../defaultOptions'

export default Vue.extend({
    name: 'lq-el-table',
    provide() {
        return {
            lqelTable: this
        };
    },
    props: {
        tableName: {
            type: String,
            required: true
        },
        dataKey: {
            type: [String, Array],
            default: () => lqOptions.dataKey
        },
        action: {
            type: String,
            required: true
        },
        method: {
            type: String,
            default: () => 'GET'
        },
        defaultSort: Object,
        keepAlive: {
            type: Boolean,
            default: () => lqOptions.keepAlive
        },
        defaultPageSize: {
            type: Number,
            default: () => lqOptions.pageSize
        },
        staticData: Object,
        descStr: {
            type: String,
            default: () => lqOptions.descStr
        },
        ascStr: {
            type: String,
            default: () => lqOptions.ascStr
        },
        rowsPerPageItems: {
            type: Array,
            default: () => lqOptions.rowsPerPageItems
        },
        itemKey: {
            type: String,
            default: () => 'id'
        },
        keepSelected: {
            type: Boolean,
            default: () => lqOptions.keepSelected
        },
        autoFilter: {
            type: Boolean,
            default: () => lqOptions.autoFilter
        },
        loadingText: {
            type: String,
            default: () => lqOptions.loadingText
        },
        noDataText: {
            type: String,
            default: () => lqOptions.noDataText
        },
        noResultsText: {
            type: String,
            default: () => lqOptions.noResultsText
        },
        keepSelectedOnPageChange: {
            type: Boolean,
            default: () => lqOptions.keepSelectedOnPageChange
        },
        otherServerData: Array,
        paginationProps: Object,
        pageKey: {
            type: String,
            default: () => lqOptions.pageKey
        }
    },
    data() {
        return {
            isLoaded: false
        }
    },
    created() {
        if (!this.sortBy) {
            if (this.defaultSort) {
                const { prop, order } = this.defaultSort
                if (order) {
                    this.$lqForm.setElementVal(this.tableName, 'sort_by', {
                        [prop]: this.getOrderStr(order, this.ascStr, this.descStr)
                    })
                }
            }
        }
    },
    render: function () {
        return this.getLqList()
    },
    mounted: function () {
        this.isLoaded = true
    },
    computed: {
        sortBy: function () {
            return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'sort_by'], null);
        },
        sortObjectForElement() {
            let sort = []
            if (this.sortBy) {
                const keys = Object.keys(this.sortBy)
                keys.forEach(prop => {
                    sort.push({
                        prop,
                        order: this.getOrderStr(this.sortBy[prop], 'ascending', 'descending')
                    })
                })
            }
            return sort.length ? sort[0] : undefined
        },
        currentPage: function () {
            return this.$helper.getProp(this.$store.state, `form.${this.tableName}.values.${this.pageKey}`, 1);
        },
        selectedKeys: function () {
            return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'selected'], []);
        },
        items: function () {
            let dataKey = ['table', this.tableName, 'data', 'page_' + this.currentPage]
            return this.$helper.getProp(this.$store.state, dataKey, []);
        },
    },
    methods: {
        getAscString(order, ascStr) {
            if (['asc', 'ascending'].includes(order.toString().toLocaleLowerCase())) {
                return ascStr ? ascStr : 'asc'
            }
            return null
        },
        getDescString(order, descStr) {
            if (['desc', 'descending'].includes(order.toString().toLocaleLowerCase())) {
                return descStr ? descStr : 'desc'
            }
            return null
        },
        getOrderStr(order, ascDefault, descDefault) {
            const ascStr = this.getAscString(order, ascDefault)
            const descStr = this.getDescString(order, descDefault)
            if (ascStr) {
                return ascStr
            } else if (descStr) {
                return descStr
            }
            return null

        },
        getDataTable(scope) {
            return this.$createElement(
                'el-table',
                {

                    on: {
                        ...this.$listeners,
                        'select': (val, row) => {
                            const _id = row[this.itemKey]
                            const plus = val.some(v => _id === v[this.itemKey])
                            this.setSelectedKeys(val, _id, plus)
                            this.$emit('select', this.selectedKeys)
                        },
                        'select-all': (val) => {
                            this.setSelectedKeys(val)
                            this.$emit('select-all', this.selectedKeys)
                        },
                        'sort-change': ({ prop, order }) => {
                            if (!order) {
                                this.$lqForm.setElementVal(this.tableName, 'sort_by', null)
                            } else {
                                this.$lqForm.setElementVal(this.tableName, 'sort_by', {
                                    [prop]: this.getOrderStr(order, this.ascStr, this.descStr)
                                })
                            }
                            this.$lqTable.refresh(this.tableName, false);
                        }
                    },
                    props: {
                        ...this.$attrs,
                        data: scope.items,
                        defaultSort: this.sortObjectForElement,
                        loading: scope.requesting,
                        disablePagination: scope.requesting,
                        totalItems: scope.total,
                        rowsPerPageItems: this.rowsPerPageItems,
                        pagination: this.pagination,
                        rowKey: this.itemKey,
                        emptyText: scope.requesting ? this.loadingText : this.noDataText,
                    },
                    ref: 'elTable',
                },
                this.renderSlots()
            )
        },
        getLqList() {
            return this.$createElement('lq-list', {
                props: {
                    ...this.$attrs,
                    keepAlive: this.keepAlive,
                    type: 'table',
                    name: this.tableName,
                    requestMethod: this.method,
                    action: this.action,
                    primaryKey: this.itemKey,
                    dataKey: this.dataKey,
                    extraDataKeys: ['sort_by'],
                    autoFilter: this.autoFilter,
                    keepSelectedOnPageChange: this.keepSelectedOnPageChange,
                    defaultPageSize: this.defaultPageSize,
                    staticData: this.staticData,
                    otherServerData: this.otherServerData
                },
                on: {
                    'data-loaded': (response) => {
                        if (this.$refs.elTable && this.selectedKeys && this.selectedKeys.length) {
                            const _data = this.$helper.getProp(response, this.dataKey)
                            this.makeSelection(_data)
                        }
                        this.$emit('data-loaded', response)
                    }
                },
                scopedSlots: {
                    ...this.$scopedSlots,
                    default: props => [
                        this.getDataTable(props),
                        this.$createElement(
                            'lq-el-pagination',
                            {
                                attrs: this.paginationProps,
                                on: {
                                    'current-change': (page) => {
                                        const _data = this.$helper.getProp(this.$store.state, ['table', this.tableName, 'data', `page_${page}`], null)
                                        if (_data) {
                                            this.makeSelection(_data)
                                        }
                                    }
                                }
                            }
                        )
                    ],
                }
            })
        },
        makeSelection(_data) {
            this.$nextTick(() => {
                _data.forEach((item) => {
                    if (this.selectedKeys.includes(item[this.itemKey])) {
                        this.$refs.elTable.toggleRowSelection(item, true)
                    }
                })
            })
        },
        setSelectedKeys(val, _id, plus) {
            let selected = this.keepSelectedOnPageChange ? this.selectedKeys.slice() : []
            if (_id && !plus) {
                const _index = selected.indexOf(_id)
                if (_index !== -1) {
                    selected.splice(_index, 1)
                }
            }
            if (val && val.length) {
                val.forEach(v => !selected.includes(v[this.itemKey]) ? selected.push(v[this.itemKey]) : null)
            } else {
                this.items.forEach((v) => {
                    const id = v[this.itemKey];
                    const index = selected.indexOf(id)
                    if (index !== -1) {
                        selected.splice(index, 1)
                    }
                })
            }
            this.$lqForm.setElementVal(this.tableName, 'selected', selected)
        },
        renderSlots() {
            const slotNames = Object.keys(this.$slots);
            return slotNames.map(
                slotName => this.$createElement(
                    'template',
                    { slot: slotName },
                    this.$slots[slotName]
                )
            )
        }
    },
    beforeDestroy() {
        if (!this.keepSelected) {
            this.$lqForm.removeElement(this.tableName, 'selected')
        }
    }
})