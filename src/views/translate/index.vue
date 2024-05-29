<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getTranslateDataApi,deleteTranslateDataApi } from "@/api/translate"
import { type GetTranslateData } from "@/api/table/types/translate"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"
const BASE_URL=import.meta.env.VITE_BASE_API
defineOptions({
  // 命名当前组件
  name: "Translate"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 删
const handleDelete = (row: GetTranslateData) => {
  ElMessageBox.confirm(`正在删除用户：${row.translate_no}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTranslateDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 查
const translateData = ref<GetTranslateData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  keyword: "",
})
const getTableData = () => {
  loading.value = true
  getTranslateDataApi({
    page: paginationData.currentPage,
    limit: paginationData.pageSize,
    keyword: searchData.keyword || undefined,
  })
    .then(({ data }) => {
      paginationData.total = data.total
      translateData.value = data.data
    })
    .catch(() => {
      translateData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="keyword" label="">
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
        <el-table :data="translateData">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column prop="customer_no" label="所属用户ID" align="center" />
          <el-table-column prop="origin_filename" label="文档名称" align="center" />
          <el-table-column prop="status" label="任务状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 'none'" type="primary" effect="plain">未完成</el-tag>
              <el-tag v-else-if="scope.row.status === 'process'" type="warning" effect="plain">翻译中</el-tag>
              <el-tag v-else type="success" effect="plain">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="start_at" label="任务开始时间" align="center" />
          <el-table-column prop="end_at" label="完成用时" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-link :href="BASE_URL+scope.row.target_filepath">下载</el-link>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
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
