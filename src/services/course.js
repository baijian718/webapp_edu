import {CourseAll, CourseCreate, CourseStudent, CourseStudentAddUri, CourseStudentDeleteUri} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 课程创建
 * @param sn  课程编号
 * @param name 课程名称
 * @param month 课程年月
 * @param fee 课程费用
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function courseCreate(sn,name,month,fee) {
    return request(CourseCreate, METHOD.POST, {
        name: name,
        sn: sn,
        month:month,
        fee:fee,
    })
}

export async function GetAllCourse(name) {
    return request(CourseAll, METHOD.GET, {
        name: name,
    })
}

export async function GetCourseStudent(courseId) {
    return request(CourseStudent, METHOD.GET, {
        course_id: courseId,
    })
}


export async function CourseStudentAdd(courseId,studentId) {
    return request(CourseStudentAddUri, METHOD.POST, {
        course_id: courseId,
        student_id: studentId,
    })
}


export async function CourseStudentDelete(courseId,studentId) {
    return request(CourseStudentDeleteUri, METHOD.POST, {
        course_id: courseId,
        student_id: studentId,
    })
}
