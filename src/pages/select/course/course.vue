<template>
  <a-select
      v-model="selectedValue"
      style="width: 100%; margin-top: 16px; margin-bottom: 8px; margin-right: 8px"
  >
    <a-select-option
        v-for="course in courses"
        :key="course.id"
        :value="course.id"
    >
      {{ course.name }}
    </a-select-option>
  </a-select>
</template>

<script>
import {GetAllCourse} from "@/services/course";

export default {
  name: 'CourseSelect',
  props: {
    courses: {
      type: Array,
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
  mounted() {
    this.getCourses()
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
    filteredCourses() {
      return this.courses.filter(course => {
        // 根据 filterConditions 过滤学生
        // 这里假设 filterConditions 是一个对象，键是属性名，值是要匹配的值
        return Object.keys(this.filterConditions).every(key => {
          return course[key] === this.filterConditions[key];
        });
      });
    }
  },
  methods: {
    getCourses() {
      if (this.courses.length > 0){
        return this.courses
      }
      let _this = this
      GetAllCourse("").then(function (res){
        console.log(res)
        let ret = res.data
        if (ret.code > 0){
          this.$message.error(ret.message)
        }else {
          ret.data.forEach(function (item){
            _this.courses.push({"id":item.id,"name":item.name})
          })
        }
      })
      return this.courses;
    }
  }
};
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
