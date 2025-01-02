<template>
  <a-card>
    <div>
      <standard-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="rowKey"
          :selectedRows.sync="selectedRows"
          @clear="onClear"
          :pagination="{...pagination, onChange: onPageChange}"
      >
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {request} from '@/utils/request'


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
    title: '课程名称',
    dataIndex: 'course_name',
  },
  {
    title: '课程月份',
    dataIndex: 'course_year_month',
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
    title: '加入时间',
    dataIndex: 'create_at',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name: 'MyCourseList',
  computed: {
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
      request(process.env.VUE_APP_API_BASE_URL + '/api/course/student/list', 'get', {page: this.pagination.current,
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
