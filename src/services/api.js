//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  LOGIN: `${BASE_URL}/api/login`,
  ROUTES: `${BASE_URL}/routes`,
  CourseCreate: `${BASE_URL}/api/course/create`,
  CourseAll:  `${BASE_URL}/api/course/all`,
  CourseStudent:  `${BASE_URL}/api/course/student`,
  CourseStudentAddUri:  `${BASE_URL}/api/course/student/add`,
  CourseStudentDeleteUri:  `${BASE_URL}/api/course/student/del`,
  StudentAll: `${BASE_URL}/api/student/select`,

  InvoiceCreate: `${BASE_URL}/api/invoice/create`,
  InvoiceSendUri: `${BASE_URL}/api/invoice/send`,
  InvoiceCreatePayUri: `${BASE_URL}/api/invoice/pay/create`,
  InvoiceTeacherList: `${BASE_URL}/api/invoice/teacher-list`,
}
