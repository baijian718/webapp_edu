import {InvoiceCreate,InvoiceSendUri,InvoiceCreatePayUri} from '@/services/api'
import {request, METHOD} from '@/utils/request'

export async function CreateInvoice(courseId,studentId,remark) {
    let params = {
        course_id: courseId,
        student_id: studentId,
    }
    if (remark.length>0){
        params.remark = remark
    }
    return request(InvoiceCreate, METHOD.POST,params)
}


export async function InvoiceSend(courseId) {
    let params = {
        invoice_id: courseId,
    }
    return request(InvoiceSendUri, METHOD.POST,params)
}


export async function InvoiceCreatePay(courseId) {
    let params = {
        invoice_id: courseId,
    }
    return request(InvoiceCreatePayUri, METHOD.POST,params)
}
