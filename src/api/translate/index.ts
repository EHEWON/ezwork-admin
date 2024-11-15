import { request } from "@/utils/service"
import type * as Translate from "./types/translate"


/** 列表 */
export function getTranslateDataApi(params: Translate.GetTranslateRequestData) {
  return request<Translate.GetTranslateResponseData>({
    url: `translates`,
    method: "get",
    params
  })
}

export function deleteTranslateDataApi(id:number){
  return request<Translate.TranslateNoResponseData>({
    url:`/translate/${id}`,
    method:'delete',
  })
}

export function deleteMoreTranslateDataApi(params:object){
  return request<Translate.TranslateNoResponseData>({
    url:`/translates/delete`,
    method:'post',
    params
  })
}

export function downloadMoreTranslateDataApi(params:object){
  return request<Translate.TranslateNoResponseData>({
    url:`/translates/download`,
    method:'post',
    params
  })
}
