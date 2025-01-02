<template>
  <a-card>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新增账单</a-button>
      </a-space>
      <!-- 表单弹窗 -->
      <a-modal
          :visible="createCourseFormVisible"
          :width = 600
          title="新增账单"
          :footer="null"
          @cancel="closeAdd"
      >
        <!-- 使用 AddInvoice 组件 -->
        <AddInvoice
            :visible="createCourseFormVisible"
            @close-dialog="closeAdd"
            @success="reload"
            :action_type="actionType"
            ref="AddInvoice"
            :width="600"
        />
      </a-modal>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="rowKey"
          :selectedRows.sync="selectedRows"
          :pagination="{...pagination, onChange: onPageChange}"

      >
        <div slot="description" slot-scope="{text}">
          {{text}}
        </div>
        <div v-if="record.invoice_status === 1" slot="action" slot-scope="{text, record}">
          <a-popconfirm :title="$t('deleteConfirm')" @confirm="invoiceSend(record.id)">
            <a a-icon type="delete">{{$t('delete')}}</a>
          </a-popconfirm>
        </div>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {request} from '@/utils/request'
import AddInvoice from "@/pages/invoice/add/AddInvoice.vue";
import invoice from "@/pages/invoice/index";
import {InvoiceSend} from "@/services/invoice";

const columns = [
  {
    title: '账单Id',
    dataIndex: 'id'
  },
  {
    title: '课程编号',
    dataIndex: 'course_sn',
  },
  {
    title: '课程月份',
    dataIndex: 'course_year_month',
  },
  {
    title: '课程名称',
    dataIndex: 'course_name',
  },
  {
    title: '账单费用',
    dataIndex: 'fee',
    customRender: (text) => { return ((text / 100).toFixed(2)) + '元'}
  },
  {
    title: '学生姓名',
    dataIndex: 'student_name',
  },
  {
    title: '学生编号',
    dataIndex: 'student_sn',
  },
  {
    title: '账单状态',
    dataIndex: 'invoice_status',
    customRender: (text) => {
      switch (text) {
        case 1:
          return '待发送'
        case 2:
          return '待支付'
        case 3:
          return '已支付'
        default:
          return '未知状态'
      }
    },
    sorter: true
  },
  {
    title: '账单时间',
    dataIndex: 'create_at',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name: 'InvoiceList',
  computed: {
    invoice() {
      return invoice
    },
    form() {
      return this.$form.createForm(this, { name: 'add_invoice' })
    },
  },
  i18n: require('./i18n'),
  components: {AddInvoice, StandardTable},
  data () {
    return {
      advanced: true,
      columns: columns,
      rowKey: "id",
      dataSource: [],
      selectedRows: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      createCourseFormVisible: false,
      createStudentFormVisible: false,
      actionType:"create",
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  mounted() {
    this.load()
  },
  methods: {
    load(){
      request(process.env.VUE_APP_API_BASE_URL + '/api/invoice/teacher-list', 'get', {page: this.pagination.current,
        pageSize: this.pagination.pageSize}).then(res => {
        const {list, page, pageSize, total} = res?.data?.data ?? {}
        this.dataSource = list
        this.pagination.current = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
      })
    },
    reload() {
      this.load()
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    addNew () {
      this.createCourseFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.AddInvoice && typeof this.$refs.AddInvoice.clear === 'function') {
          this.$refs.AddInvoice.clear();
        }
      });
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.load()
    },
    closeAdd() {
      this.createCourseFormVisible = false
    },
    invoiceSend(invoiceId){
      let _this = this
      InvoiceSend(invoiceId).then(function (res){
        if(res.data.code === 0){
          _this.$message.success(res.data.message)
          _this.reload()
        }else {
          _this.$message.error(res.data.message)
        }
      })
    },
    toggle (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
  }
}
</script>

<style lang="less" scoped>
.search{
  margin-bottom: 54px;
}
.fold{
  width: calc(100% - 216px);
  display: inline-block
}
.operator{
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
