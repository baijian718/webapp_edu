<template>
  <a-card>
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
        <div slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px" @click="addStudent(record.id)">
            <a-icon type="plus"/> 学生管理
          </a>
        </div>
      </standard-table>
      <!-- 表单弹窗 -->
      <a-modal
          :visible="createStudentFormVisible"
          :width = 800
          title="学生管理"
          :footer="null"
          @cancel="addStudentClose"
      >
        <!-- 使用 AddStudent 组件 -->
        <AddStudent
            :visible="createStudentFormVisible"
            @success="reload"
            @close="addStudentClose"
            ref="addStudent"
            :formS="formData"
            :width="600"
         />

      </a-modal>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import {request} from '@/utils/request'
import AddCourse from "@/pages/course/add/AddCourse.vue";
import AddStudent from "@/pages/course/student/AddStudent.vue";

const columns = [
  {
    title: '课程Id',
    dataIndex: 'id'
  },
  {
    title: '课程编号',
    dataIndex: 'sn',
  },
  {
    title: '课程名称',
    dataIndex: 'course_name',
  },
  {
    title: '课程年月',
    dataIndex: 'year_month',
  },
  {
    title: '课程费用',
    dataIndex: 'fee',
    customRender: (text) => { return ((text / 100).toFixed(2)) + '元'}
  },
  {
    title: '创建时间',
    dataIndex: 'create_at',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]


export default {
  name: 'CourseList',
  computed: {
    form() {
      return this.$form.createForm(this, { name: 'add_course' })
    }
  },
  components: {AddStudent, AddCourse, StandardTable},
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
      console.info('addCourseSuccess')
      this.load()
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
      this.load()
    },
    addNew () {
      this.createCourseFormVisible = true
      this.$nextTick(() => {
        this.$refs.addCourse.open()
      })
    },
    addStudent (courseId) {
      console.log(courseId);
      this.createStudentFormVisible = true
      this.$nextTick(() => {
        this.$refs.addStudent.makeData(courseId)
      })
    },
    courseCreateClose() {
      console.info("324242423434")
      this.createCourseFormVisible = false
    },
    addStudentClose() {
      this.createStudentFormVisible = false
    }
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
