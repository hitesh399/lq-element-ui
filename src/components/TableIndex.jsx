import Vue from 'vue'
export default Vue.extend({
    name: 'lq-table-index',
    inject: ['lqelTable'],
    inheritAttrs: false,
    render() {
        return this.$createElement('el-table-column', {
            props: {
                ...this.$attrs,
                type: 'index',
                index: this.getIndex
            }
        })
    },
    methods: {
        getIndex(index) {
            return ((this.lqelTable.currentPage - 1) * this.lqelTable.defaultPageSize) + (index + 1)
        }
    }
})