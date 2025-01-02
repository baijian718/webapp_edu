import {StudentAll} from '@/services/api'
import {request, METHOD} from '@/utils/request'
import {count} from "@antv/data-set/lib/util/statistics";

/**
 * 课程创建
 * @param name  学生姓名
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function GetAllStudent(name,studentIds) {
    let params = {}
    if (name){
        params.name = name
    }
    if (studentIds && count(studentIds) > 0) {
        params.id = studentIds
    }
    return request(StudentAll, METHOD.GET,params)
}


