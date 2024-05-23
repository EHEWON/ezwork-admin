import { request } from "@/utils/service"
import type * as Customer from "./types/customer"


/** 更新账户状态 */
export function changeCustomerStatusApi(id: int, status:string) {
  return request({
    url: `customer/status/${id}`,
    method: "post",
    data:{status}
  })
}

/** 编辑 */
export function updateCustomerDataApi(data: Customer.CreateOrUpdateCustomerRequestData) {
  return request({
    url: `customer/${data.id}`,
    method: "post",
    data
  })
}

/** 列表 */
export function getCustomerDataApi(params: Customer.GetCustomerRequestData) {
  return request<Customer.GetCustomerResponseData>({
    url: `customers`,
    method: "get",
    params
  })
}


/** 详情 */
export function getCustomerDetailApi(id:int) {
  return request<Customer.GetCustomerData>({
    url: `customer/${id}`,
    method: "get"
  })
}
