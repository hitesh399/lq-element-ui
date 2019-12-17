import Vue from 'vue'

export default Vue.extend({
  name: 'lq-el-pagination',
  inject: ['lqForm'],
  render () {
    return this.$createElement(
        'el-pagination', 
        {
            
            on: {
                ...this.$listeners,
                'current-change': (page) => {
                    if(page !== this.lqForm.currentPage) {
                        this.lqForm.switchPage(page)
                        this.$emit('current-change', page)
                    }
                }
            },
            props: {
                ...this.$attrs,
                pageSize: this.lqForm.pageSize,
                total: this.lqForm.total,
                disabled: this.lqForm.requesting,
                currentPage: this.lqForm.currentPage
            },
            scopedSlots: this.$scopedSlots,
            ref: 'pagination',
        },            
        this.renderSlots()
    )
  },
  methods: {
    renderSlots () {
        const slotNames = Object.keys(this.$slots);
        return slotNames.map(
            slotName => this.$createElement(
                'template', 
                { slot: slotName }, 
                this.$slots[slotName]
            )
        )
    }
  }
})