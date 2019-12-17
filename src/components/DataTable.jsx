import Vue from 'vue'
import { lqOptions } from '../defaultOptions'

export default Vue.extend({
    name: 'lq-v-datatable',
    provide() {
        return {
            lqVDataTable: this
        };
    },
    props: {
        tableName: {
            type: String,
            required: true
        },
        action: {
            type: String,
            required: true
        },
        method: {
            type: String,
            default: () => 'GET'
        },
        defaultSortBy: String,
        defaultSortOrder: {
            type: String,
            default: () => 'asc'
        },
        keepAlive: {
            type: Boolean,
            default: () => lqOptions.keepAlive
        },
        defaultPageSize: {
            type: Number,
            default: () => lqOptions.pageSize
        },
        staticData: Object,
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
    },
    data() {
        return {
            isLoaded: false
        }
    },
    created() {
        if (!this.sortBy) {
            if (this.defaultSortBy) {
                this.$lqForm.setElementVal(this.tableName, 'sort_by', { [this.defaultSortBy]: this.defaultSortOrder })
                this.$nextTick(() => {
                    this.$refs.elTable.sort(this.defaultSortBy, this.defaultSortOrder === 'asc' ? 'ascending' : 'descending' )
                })
            }
        } else {

            this.$nextTick(() => {
                const sortByKeys = Object.keys(this.sortBy);
                sortByKeys.forEach((_key) => {
                    this.$refs.elTable.sort(_key, this.sortBy[_key] === 'asc' ? 'ascending' : 'descending')
                })                
            })
        }
    },
    render: function () {
        return this.getLqList()
    },
    mounted: function () {
        this.isLoaded = true
    },
    computed: {
        // currentPage: function () {
        //     return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'page'], 1);
        // },
        // pageSize: function () {
        //     return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'page_size'], 15);
        // },
        // sortBy: function () {
        //     return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'sort_by'], null);
        // },
        // descending: function () {
        //     return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'descending'], false);
        // },
        // total: function () {
        //     return this.$helper.getProp(this.$store.state, ['table', this.tableName, 'settings', 'total'], 0);
        // },
        // requesting: function () {
        //     return this.$helper.getProp(this.$store.state, ['table', this.tableName, 'requesting'], false);
        // },
        // selectedKeys: function () {
        //     return this.$helper.getProp(this.$store.state, ['form', this.tableName, 'values', 'selected'], []);
        // }
    },
    methods: {
        getDataTable(scope) {
            const self = this;
            // const header = this.$scopedSlots.header;
            // console.log('scope.items', scope.items)
            return this.$createElement(
                'el-table',
                {
                    
                    on: {
                        ...this.$listeners,
                        'selection-change':  (val) =>  {
                            const ids = val ? val.map(v => v[this.itemKey]) : val
                            this.$lqForm.setElementVal(this.tableName, 'selected', ids)
                            this.$emit('selection-change', val)

                        },
                        'sort-change': ({column, prop, order}) => {
                            if (!order) {
                                this.$lqForm.setElementVal(this.tableName, 'sort_by', null)
                                
                            } else {

                                this.$lqForm.setElementVal(this.tableName, 'sort_by', {
                                    [prop]: order === 'ascending' ? 'asc' : 'desc'
                                })
                            }
                            this.$lqTable.refresh(this.tableName, false);
                        }
                    },
                    props: {
                        ...this.$attrs,
                        data: scope.items,
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
                    extraDataKeys: ['sort_by'],
                    autoFilter: this.autoFilter,
                    keepSelectedOnPageChange: this.keepSelectedOnPageChange,
                    defaultPageSize: this.defaultPageSize,
                    staticData: this.staticData,
                    otherServerData: this.otherServerData
                },
                scopedSlots: {
                    ...this.$scopedSlots,
                    default: props => this.getDataTable(props),
                }
            })
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