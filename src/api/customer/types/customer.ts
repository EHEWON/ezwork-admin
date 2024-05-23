export interface CreateOrUpdateCustomerRequestData {
  id?: int
  email: string
  password?: string
  level: string
}

export interface GetCustomerRequestData {
  /** 当前页码 */
  page: number
  /** 查询条数 */
  pagesize: number
  /** 关键字 */
  keyword?: string
}

export interface GetCustomerData {
  id: int,
  created_at: string
  email: string
  level: string
  status: boolean
}

export type GetCustomerResponseData = ApiResponseData<{
  data: GetCustomerData[]
  total: number
}>
