<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import {getSiteSettingData,setSiteSettingData} from '@/api/setting'
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "接口配置"
})

const setting = ref({
    version: "",
})

const settingForm=ref<FormInstance | null>(null)

const rules={
    version: [
      { required: true, message: '请选择版本', trigger: 'blur' },
    ]
}


onMounted(()=>{
    getSiteSettingData().then(data=>{
        setting.value=data.data
    })
})

function onSubmit(settingForm:FormInstance | null){
    console.log(setting.value)
     console.log({
        version:setting.value.version,
    })
    settingForm?.validate((valid,messages)=>{
        if(valid){
            setSiteSettingData({
                version:setting.value.version,
            }).then((data)=>{
                if(data.code==0){
                    ElMessage.success("保存成功")
                }else{
                    ElMessage.error(data.message)
                }
            }).catch((e)=>{
                ElMessage.error(e)
            })
        }else{
            for(var field in messages){
                messages[field].forEach(message=>{
                    ElMessage({
                        message:message['message'],
                        type:"error",
                    })
                })
                break
            }
        }
    })
}

</script>

<template>
    <el-form ref="settingForm" :model="setting" label-width="auto" style="padding:35px 20px" :rules="rules">
        <el-form-item label="选择版本" required prop="version">
            <el-select v-model="setting.version" placeholder="请选择服务商">
                <el-option value="community" label="社区版"></el-option>
                <el-option value="business" label="商业版"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="setting-btns">
          <el-button type="primary" @click="onSubmit(settingForm)">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<style lang="scss">
.setting-btns .el-form-item__content{
    justify-content:center;
}
</style>
<style lang="scss" scoped>
.setting-btns .el-form-item__content{
    justify-content:center;
}
</style>
