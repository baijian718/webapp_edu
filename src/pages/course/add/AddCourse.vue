<template>
  <a-card :body-style="{padding: '24px 32px',width: '600px'}" :bordered="false">
    <a-form  ref="form">
      <a-form-item
        :label="$t('course_sn')"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input
            :placeholder="$t('course_sn_placeholder')"
            v-model="formData.course_sn"/>
      </a-form-item>

      <a-form-item
          :label="$t('course_name')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input :placeholder="$t('course_name_placeholder')" v-model="formData.course_name" />
      </a-form-item>

      <a-form-item
          :label="$t('course_fee')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-input-number :placeholder="$t('course_fee_placeholder')" v-model="formData.course_fee"   class="input-number-width"  />
      </a-form-item>
      <a-form-item
          :label="$t('course_month')"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}"
      >
        <a-month-picker style="width: 100%" ref="course_month" format="YYYY-MM"  v-model="formData.course_month" />
      </a-form-item>
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" @click="submitForm" :disabled="isSubmitDisabled">{{$t('submit')}}</a-button>
        <a-button style="margin-left: 8px" @click="close">{{$t('save')}}</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>

import {Form, Input} from "ant-design-vue";
import {courseCreate} from "@/services/course";

export default {
  components: {
    'a-form': Form,
    'a-input': Input,
    'a-form-item': Form.Item,
  },
  props: {
    visible:{
      type: Boolean,
      default: false
    },
    formData:{
      type:Object,
      default: () => {
        return {
          course_sn: "",
          course_name: "",
          course_fee: null,
          course_month: null,
        }
      }
    }
  },
  name: 'AddCourse',
  i18n: require('./i18n'),
  data () {
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      form: this.$form.createForm(this, { name: 'add_course' }),
      formFields: {
        course_sn: '',
        course_name: '',
        course_fee: null,
        course_month: null,
        course_month_str: ''
      },
      isSubmitting: false //提交状态
    }
  },
  watch: {
  },
  computed: {
    desc() {
      return this.$t('pageDesc')
    },
    isSubmitDisabled() {
      return this.isSubmitting || !(this.formData.course_sn && this.formData.course_name && this.formData.course_fee && this.formData.course_month)
    }
  },
  methods: {
    submitForm(e){
      e.preventDefault()
      let _this = this
      this.form.validateFields((err) => {
        if (!err) {
          const name = this.formData.course_name
          const sn = this.formData.course_sn
          //将date对象转化中202412的格式
          let month_str = ""
          if (this.formData.course_month){
            month_str = this.formData.course_month.format('YYYYMM')
          }
          const fee = this.formData.course_fee
          _this.isSubmitting = true
          courseCreate(sn, name, month_str, fee).then(function (res){
            _this.isSubmitting = false
            if(res.data.code === 0 ){
              _this.$message.success(res.data.message)
              _this.$emit('success');
              _this.$emit('close');
            }else{
              _this.$message.error(res.data.message)
            }
          })
        }
      });
    },
    close(){
      this.$emit('close');
    },
    open(){
      this.$set(this.formData, 'course_month', 0);
      this.$set(this.formData, 'course_sn', "");
      this.$set(this.formData, 'course_name', "");
      this.$set(this.formData, 'course_fee', null);
    }
  },
  mounted(){
  },
}
</script>

<style scoped>
.input-number-width {
  width: 100%;
}
</style>
