import { request } from "@/utils/service"
import type * as Translate from "./types/tranlate"


/** 列表 */
export function getTranslateDataApi(params: Translate.GetTranslateRequestData) {
  return request<Translate.GetTranslateResponseData>({
    url: `translates`,
    method: "get",
    params
  })
}