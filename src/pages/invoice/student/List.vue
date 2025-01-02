<template>
  <a-card>
    <div>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="rowKey"
          :selectedRows.sync="selectedRows"
          @clear="onClear"
          @change="onChange"
          :pagination="{...pagination, onChange: onPageChange}"
          @selectedRowChange="onSelectChange"
      >
        <div slot="description" slot-scope="{text}">
          {{text}}
        </div>
        <div v-if="record.invoice_status === 2" slot="action" slot-scope="{text, record}">
          <a-popconfirm :title="$t('payConfirm')" @confirm="invoicePayTo(record.id)">
            <a a-icon type="delete">{{$t('pay')}}</a>
          </a-popconfirm>
        </div>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {request} from '@/utils/request'
import invoice from "@/pages/invoice/index";
import {InvoiceCreatePay} from "@/services/invoice";


const columns = [
  {
    title: '课程Id',
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
  components: {StandardTable},
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
      formData: {},
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  mounted() {
    this.getData()
  },
  methods: {
    onPageChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.getData()
    },
    getData() {
      request(process.env.VUE_APP_API_BASE_URL + '/api/invoice/student-list', 'get', {page: this.pagination.current,
        pageSize: this.pagination.pageSize}).then(res => {
        const {list, page, pageSize, total} = res?.data?.data ?? {}
        this.dataSource = list
        this.pagination.current = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
      })
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear() {

    },
    onChange() {

    },
    onSelectChange() {

    },
    invoicePayTo(invoiceId){
      let _this = this
      InvoiceCreatePay(invoiceId).then(function (res){
        if(res.data.code === 0){
          _this.$message.success(res.data.message)
          //打开一个新页面去支付
          window.open(res.data.data.payment_url)
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
