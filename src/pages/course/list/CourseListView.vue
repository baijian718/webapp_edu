<template>
  <div class="table-container">
    <table class="table">
      <thead>
      <tr>
        <th v-for="column in columns" :key="column.dataIndex" :style="{width: column.width}">{{ column.title }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in dataSource" :key="row.id">
        <td v-for="column in columns" :key="column.dataIndex" :style="{width: column.width}">
          <template v-if="column.dataIndex === 'action'">
            <div>
              <a style="margin-right: 8px" @click="addStudent(row.id)">
                <a-icon type="plus"/> 学生管理
              </a>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'fee'">
            {{ row[column.dataIndex]/100 }}
          </template>
          <template v-else>
            <div class="ellipsis" :title="row[column.dataIndex]">
              {{ row[column.dataIndex] }}
            </div>
          </template>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button class="prev" @click="prevPage"  :disabled="isPrevDisabled"  :class="{'disabled': isPrevDisabled}">
        <span class="icon">上一页</span>
      </button>
      <span
          v-for="page in displayedPages"
          :key="page"
          :class="['page', {'current-page': page === pagination.current}]"
          @click="goToPage(page)"
      >
      {{ page }}
    </span>
      <button class="next" @click="nextPage"  :disabled="isNextDisabled" :class="{'disabled': isNextDisabled}">
        <span class="icon">下一页</span>
      </button>
    </div>
    <!-- 表单弹窗 -->
    <a-modal
        :visible="createStudentFormVisible"
        :width = 800
        title="学生管理"
        :footer="null"
        @cancel="addStudentClose"
    >
      <AddStudent
          :visible="createStudentFormVisible"
          @success="reload"
          @close="addStudentClose"
          ref="addStudent"
          :width="600"
      />
    </a-modal>
  </div>
</template>

<script>


import AddStudent from "@/pages/course/student/AddStudent.vue";

export default {
  name: 'CourseListView',
  components: {AddStudent},
  props: {
    dataSource:{
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        pageSize: 10,
        total: 0,
      }),
    },
  },
  data() {
    return {
      createStudentFormVisible : false
    };
  },
  computed: {
    displayedPages() {
      const { current, total,pageSize } = this.pagination;
      const range = 2; // 前后展示的页码数
      const start = Math.max(1, current - range);
      const end = Math.min(Math.ceil(total / pageSize), current + range);
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
    isPrevDisabled() {
      return this.pagination.current === 1;
    },
    isNextDisabled() {
      return (this.pagination.current*this.pagination.pageSize) >= this.pagination.total;
    }
  },
  methods: {
    prevPage() {
      if (this.pagination.current > 1) {
        this.$emit('change', {
          ...this.pagination,
          current: this.pagination.current - 1,
        });
      }
    },
    nextPage() {
      if (this.pagination.current * this.pagination.pageSize < this.pagination.total) {
        this.$emit('change', {
          ...this.pagination,
          current: this.pagination.current + 1,
        });
      }
    },
    goToPage(page) {
      this.$emit('change', {
        ...this.pagination,
        current: page,
      });

    },
    addStudent (courseId) {
      this.createStudentFormVisible = true
      this.$nextTick(() => {
        this.$refs.addStudent.makeData(courseId)
      })
    },
    addStudentClose() {
      this.createStudentFormVisible = false
    },
    onChange(pagination, filters, sorter, {currentDataSource}) {
      this.$emit('change', pagination, filters, sorter, {currentDataSource})
    },
    reload(){

    }
  },
};
</script>

<style lang="less" scoped>
.table-container {
  width: 100%;
  margin: 20px auto;

  .table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
    table-layout: auto;

    thead {
      background-color: #f2f2f2;
      color: #333;
      th {
        padding: 13px 15px;
        text-align: left;
        font-weight: normal;
        font-size: 16px;
        min-width: 50px;
        max-width: 200px;
      }
    }

    tbody {
      tr {
        &:nth-child(even) {
          background-color: #fafafa;
        }

        &:hover {
          background-color: #eaeaea;
        }

        td {
          padding: 15px;
          font-weight: normal;
          font-size: 14px;
          min-width: 50px;
          max-width: 200px;
        }
        .ellipsis {
          width: 100%;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 5px;

    button {
      border: 1px solid #ccc;
      padding: 6px;
      margin: 0 5px;
      cursor: pointer;
      border-radius: 3px;
      transition: background-color 0.3s;
      display: flex;
      align-items: center;

      .icon {
        font-size: 12px;
      }

      &:hover {
        background-color: #d5d5d5;
      }
    }

    .page {
      padding: 5px 10px;
      border: 1px solid #ccc;
      cursor: pointer;
      border-radius: 3px;
    }

    .page:hover {
      background-color: #f0f0f0;
    }

    .current-page {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
    .prev.disabled, .next.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .prev:hover, .next:hover {
      background-color: #e0e0e0;
    }

    .prev.disabled:hover, .next.disabled:hover {
      background-color: #f0f0f0;
    }

  }
}
</style>

