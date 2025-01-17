<template>
  <div class="custom-card">
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新增课程</a-button>
      </a-space>
      <!-- 表单弹窗 -->
      <a-modal
          :visible="createCourseFormVisible"
          :width = 600
          title="新增课程"
          :footer="null"
          @cancel="courseCreateClose"
      >
        <!-- 使用 AddCourse 组件 -->
        <AddCourse
            :visible="createCourseFormVisible"
            @close="courseCreateClose"
            @success="addCourseSuccess"
            ref="addCourse"
            :width="600"
        />
      </a-modal>
      <CourseListView
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="rowKey"
          :pagination="{...pagination, onChange: onPageChange}"
          @change="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import {request} from '@/utils/request'
import AddCourse from "@/pages/course/add/AddCourse.vue";
import CourseListView from "@/pages/course/list/CourseListView.vue";

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
  },
  {
    title: '课程编号',
    dataIndex: 'sn',
    width: '10%',
  },
  {
    title: '课程名称',
    dataIndex: 'course_name',
    width: '20%',
  },
  {
    title: '课程年月',
    dataIndex: 'year_month',
    width: '10%',
  },
  {
    title: '课程费用',
    dataIndex: 'fee',
    customRender: (text) => { return ((text / 100).toFixed(2)) + '元'},
    width: '10%',
  },
  {
    title: '创建时间',
    dataIndex: 'create_at',
    sorter: true,
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    width: '10%',
  }
]


export default {
  name: 'CourseList',
  computed: {
    form() {
      return this.$form.createForm(this, { name: 'add_course' })
    }
  },
  components: {CourseListView, AddCourse},
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
    this.load()
  },
  methods: {
    load() {
      request(process.env.VUE_APP_API_BASE_URL + '/api/course/list', 'get', {page: this.pagination.current,
        pageSize: this.pagination.pageSize}).then(res => {
        const {list, page, pageSize, total} = res?.data?.data ?? {}
        this.dataSource = list
        this.pagination.current = page
        this.pagination.pageSize = pageSize
        this.pagination.total = total
      })
    },
    reload(){
      this.load()
    },
    addCourseSuccess(){
      this.load()
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onPageChange(pagination) {
      console.log(pagination)
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.load()
    },
    addNew () {
      this.createCourseFormVisible = true
      this.$nextTick(() => {
        this.$refs.addCourse.open()
      })
    },
    courseCreateClose() {
      this.createCourseFormVisible = false
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
.custom-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
}
</style>
