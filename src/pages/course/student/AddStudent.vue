<template>
  <form :autoFormCreate="(form) => this.form = form">
    <a-table
        :columns="dataColumns"
        :dataSource="dataSource"
        :pagination="false"
    >
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm :title="$t('deleteConfirm')" @confirm="remove(record.key)">
          <a>{{$t('delete')}}</a>
        </a-popconfirm>
      </template>
    </a-table>
    <div style="display: flex; align-items: center;">
      <a-select
          v-model="selectValue"
          style="width: 100%; margin-top: 16px; margin-bottom: 8px; margin-right: 8px"
      >
        <a-select-option
            v-for="student in students"
            :key="student.id"
            :value="student.id"
            :disabled="student.disabled"
        >
          {{ student.name }}
        </a-select-option>
      </a-select>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="addStudent" :disable="isSubmittingComputed">{{$t('newMember')}}</a-button>
    </div>

  </form>
</template>

<script>
import {GetAllStudent} from "@/services/student";
import {CourseStudentAdd, CourseStudentDelete, GetCourseStudent} from "@/services/course";

const columns = [
  {
    title: '学生ID',
    dataIndex: 'key',
    key: 'key',
    width: '20%',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '学生编号',
    dataIndex: 'number',
    key: 'number',
    width: '20%',
    scopedSlots: { customRender: 'number' }
  },
  {
    title: '学生姓名',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  name: 'AddStudent',
  i18n: require('./i18n'),
  data () {
    return {
      columns,
      dataSource:[],
      students: [],
      selectValue:null,
      selectData:[],
      selectFetching: false,
      selectedStudentId:[],
      courseId:0,
      isSubmitting: false,
    }
  },
  computed: {
    dataColumns() {
      return this.columns.map(column => {
        column.title = this.$t('table.' + column.key)
        return column
      })
    },
    isSubmittingComputed(){
      return this.isSubmitting || !(this.selectValue);
    }
  },
  mounted() {
    this.students.length = 0
    this.dataSource.length = 0
    GetAllStudent("",[]).then(this.storeStudentSelect)
  },
  methods: {
    storeStudentSelect(res){
      const selectT = res.data
      if (selectT.code === 0) {
        for(let i in selectT.data){
          this.students.push({
            id: selectT.data[i].id,
            sn: selectT.data[i].sn,
            name: selectT.data[i].name,
            disabled: false,
          })
        }
      } else {
        this.$message.error(selectT.message)
      }
    },
    addStudent () {
      let addId = this.selectValue
      let _this = this
      if(this.selectedStudentId.includes(addId)){
        return true
      }
      if(!this.selectValue){
        return false
      }
      CourseStudentAdd(this.courseId,addId).then(function (res){
        if (res.data.code > 0){
          _this.$message.error(res.data.message)
          return
        }
        _this.students.forEach(function (item) {
          if(item.id === addId){
            _this.dataSource.push({
              key: addId,
              name: item.name,
              number: item.sn,
            })
            item.disabled = true
            return true
          }
        })
        _this.selectValue = null
      })
    },
    remove (key) {
      let _this = this
      CourseStudentDelete(this.courseId,key).then(function (res){
        if (res.data.code > 0){
          _this.$message.error(res.data.message)
          return
        }
        _this.students.forEach(function (value) {
          if (value.id === key){
            value.disabled = false
          }
        })
        _this.dataSource = _this.dataSource.filter(item => item.key !== key)
        _this.selectedStudentId = _this.selectedStudentId.filter(item => item !== key)
      })
    },
    toggle (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    handleChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    makeData(courseId){
      this.courseId = courseId
      this.selectedStudentId.length = 0
      this.dataSource.splice(0, this.dataSource.length)
      this.selectFetching = false;
      let _this = this
      _this.students.forEach(function (value) {
        value.disabled = false
      })
      GetCourseStudent(courseId).then((res) => {
        if (res.data.code > 0){
          _this.$message.error("数据异常")
          return
        }
        res.data.data.forEach(function (item){
          _this.selectedStudentId.push(item.id)
          _this.dataSource.push({
            name: item.name,
            number: item.sn,
            key:item.id,
          })
          _this.students.forEach(function (value) {
            if (value.id === item.id){
              value.disabled = true
            }
          })
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
