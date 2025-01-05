<template>
  <a-card :body-style="{width: '600px'}" :bordered="false">
    <a-form  ref="form">
      <a-form-item
          :label="$t('course_name')"
          :labelCol="{span: 7,style: { paddingTop: '10px' }}"
          :wrapperCol="{span: 10}"
      >
        <CourseSelect
            ref="CourseSelect"
            v-model="selectCourseValue"
        />
      </a-form-item>
      <a-form-item
        :label="$t('student_name')"
        :labelCol="{span: 7,style: { paddingTop: '10px' }}"
        :wrapperCol="{span: 10}"
      >
        <StudentSelect
            ref="studentSelect"
            :students="students"
            v-model="selectStudentValue"
        />
      </a-form-item>

      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 10}">
        <a-button type="primary"  :disabled="isSubmitDisabled" @click="submitForm">{{$t('submit')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>

import {Form} from "ant-design-vue";
import {GetCourseStudent} from "@/services/course";
import StudentSelect from "@/pages/select/student/student.vue";
import CourseSelect from "@/pages/select/course/course.vue";
import {CreateInvoice} from "@/services/invoice";

export default {
  components: {
    StudentSelect,
    CourseSelect,
    'a-form': Form,
    'a-form-item': Form.Item,
  },
  props: {
    action_type : {
      type : String,
      required: true,
      default: 'create'
    }
  },
  name: 'AddInvoice',
  i18n: require('./i18n'),
  data () {
    return {
      visible: false,
      // eslint-disable-next-line vue/no-dupe-keys
      form: this.$form.createForm(this, { name: 'add_course' }),
      formFields: {
        course_sn: '',
        course_name: '',
        course_fee: null,
        course_month: null,
        course_month_str: ''
      },
      isSubmitting: false, //提交状态
      students: [],
      selectCourseValue:  '',
      selectStudentValue: '',
    }
  },
  watch: {
    selectCourseValue: {
      immediate: true,
      handler(newVal) {
        this.getStudent(newVal)
      }
    }
  },
  computed: {
    isSubmitDisabled(){
      return this.isSubmitting || !(this.selectCourseValue && this.selectStudentValue);
    }
  },
  methods: {
    submitForm(){
      this.form.validateFields((err) => {
        if (!err) {
          this.createInvoice(this.selectCourseValue,this.selectStudentValue,'')
        }
      });
    },
    createInvoice(courseId,studentId,remark){
      let _this = this
      _this.isSubmitting = true
      CreateInvoice(courseId,studentId,remark).then(function (res){
        _this.isSubmitting = false
        if (res.data.code > 0){
          _this.$message.error(res.data.message)
          return false
        }else {
          _this.$message.success(res.data.message)
          _this.$emit('success');
          _this.$emit('close-dialog');
        }
      })
    },
    getStudent(course_id){
      let _this = this
      //获取课程的学生
      GetCourseStudent(course_id).then(function (res){
        let data = res.data
        if (data.code > 0){
          _this.$message.error(data.message)
        }else {
          let stuId = []
          data.data.forEach(function (item) {
            stuId.push(item.id)
          })
          _this.$refs.studentSelect.reset(stuId)
        }
      })
    },
    clear(){
      this.form.resetFields()
      this.selectCourseValue = ""
      this.selectStudentValue = ""
    }
  },
  mounted(){
  },
}
</script>

<style scoped>
.label-margin {
  padding-top: 10px;
}
</style>
