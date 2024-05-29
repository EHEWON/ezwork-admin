<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getCustomerDetailApi,changeCustomerStatusApi, updateCustomerDataApi, getCustomerDataApi } from "@/api/customer"
import { type CreateOrUpdateCustomerRequestData, type GetCustomerData } from "@/api/customer/types/customer"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateCustomerRequestData = {
  id: undefined,
  email: "",
  password: "",
  level:"common"
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateCustomerRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateCustomerRequestData> = {
  email: [{ required: true, trigger: "blur", message: "请输入注册邮箱" }],
  password: [{ min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }],
  level: [{ required: true, trigger: "blur", message: "请选择用户等级" }],
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    // const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi
    updateCustomerDataApi(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getCustomerData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleStatus = (id:number, status:string) => {
  changeCustomerStatusApi(id, status).then(() => {
    ElMessage.success("更改状态成功")
    getCustomerData()
  })
}
//#endregion

//#region 改
const handleUpdate = (row: GetCustomerData) => {
  dialogVisible.value = true
  // formData.value = cloneDeep(row)
  formData.value=Object.assign(cloneDeep(row), {password:""})
}
//#endregion

//#region 查
const customerData = ref<GetCustomerData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  keyword: "",
})
const getCustomerData = () => {
  loading.value = true
  getCustomerDataApi({
    page: paginationData.currentPage,
    limit: paginationData.pageSize,
    keyword: searchData.keyword || undefined,
  })
    .then(({ data }) => {
      paginationData.total = data.total
      customerData.value = data.data
    })
    .catch(() => {
      customerData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getCustomerData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getCustomerData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="">
          <el-input v-model="searchData.keyword" placeholder="输入查询" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="table-wrapper">
        <el-table :data="customerData">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column prop="customer_no" label="用户编号" align="center" />
          <el-table-column prop="email" label="注册邮箱" align="center" />
          <el-table-column prop="level" label="用户等级" align="center">
             <template #default="scope">
              <el-tag v-if="scope.row.level=='vip'" type="primary" effect="plain">会员用户</el-tag>
              <el-tag v-else type="warning" effect="plain">普通用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账户状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status=='enabled'" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="注册时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button type="danger" v-if="scope.row.status=='enabled'" text bg size="small" @click="handleStatus(scope.row.id,'disabled')">禁用</el-button>
              <el-button type="danger" v-else text bg size="small" @click="handleStatus(scope.row.id,'enabled')">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '修改用户'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="email" label="注册邮箱">
          <el-input v-model="formData.email" placeholder="请输入注册邮箱" />
        </el-form-item>
        <el-form-item prop="level" label="用户等级">
          <el-select v-model="formData.level" placeholder="">
            <el-option label="会员用户" value="vip"></el-option>
            <el-option label="普通用户" value="common"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
