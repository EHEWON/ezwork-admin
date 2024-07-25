<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import {getOtherSettingData,setOtherSettingData} from '@/api/setting'
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "接口配置"
})

const setting = ref({
    prompt: "",
    threads: "",
})

const settingForm=ref()

const rules={
    prompt: [
      { required: true, message: '请填写默认提示语', trigger: 'blur' },
    ],
    threads: [
      { required: true, message: '请填写默认线程数', trigger: 'blur' },
    ],
}


onMounted(()=>{
    getOtherSettingData().then(data=>{
        setting.value=data.data
    })
})

function onSubmit(settingForm){
    settingForm.validate((valid,messages)=>{
        if(valid){
            setOtherSettingData(setting.value).then((data)=>{
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
            }
        }
    })
}

</script>

<template>
    <el-form ref="settingForm" :model="setting" label-width="auto" style="padding:35px 20px" :rules="rules">
        <el-form-item label="默认提示语" required prop="prompt">
            <el-input type="textarea"  :rows="5" v-model="setting.prompt" />
        </el-form-item>
        <el-form-item label="默认线程数" required prop="threads">
            <el-input v-model="setting.threads" />
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
