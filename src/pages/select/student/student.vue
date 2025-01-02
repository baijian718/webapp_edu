<template>
  <a-select
      v-model="selectedValue"
      style="width: 100%; margin-top: 16px; margin-bottom: 8px; margin-right: 8px"
  >
    <a-select-option
        v-for="student in students"
        :key="student.id"
        :value="student.id"
    >
      {{ student.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import {GetAllStudent} from "@/services/student";

export default {
  name: 'StudentSelect',
  props: {
    students: {
      type: Array,
      required: true,
      default: () => []
    },
    value: {
      type: [String, Number],
      required: true
    },
    filterConditions: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
  },
  methods:{
    getStudent(ids) {
      if (this.students.length > 0){
        return this.students
      }
      let _this = this
      GetAllStudent("",ids).then(function (res){
        console.log(res)
        let ret = res.data
        if (ret.code > 0){
          this.error = ret.message
        }else {
          ret.data.forEach(function (item){
            _this.students.push({"id":item.id,"name":item.name})
          })
        }
      })
      return this.students;
    },
    reset(studentIds){
      this.students.splice(0, this.students.length);
      this.getStudent(studentIds)
    }
  }
};
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
