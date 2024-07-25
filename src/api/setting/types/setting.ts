
export interface ApiSetting {
  api_url: stirng,
  api_key: string
  models: string
  default_model: string
  default_backup: string
}

export type GetApiSettingResponseData = ApiResponseData<{
  data: ApiSetting
}>


export interface OtherSetting {
  prompt: stirng,
  threads: string
}

export type GetOtherSettingResponseData = ApiResponseData<{
  data: OtherSetting
}>

export type SettingNoResponseData=ApiResponseData<[]>