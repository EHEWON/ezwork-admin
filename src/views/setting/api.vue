<script lang="ts" setup>
import { reactive, ref, watch,onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import {getApiSettingData,setApiSettingData} from '@/api/setting'
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "接口配置"
})

const setting = ref({
    api_url: "",
    api_key: "",
    models: "",
    default_model: "",
    default_backup: "",
})

const models=ref<string[]>([])
const settingForm=ref<FormInstance | null>(null)

const rules={
    api_url: [
        { required: true, message: '请填写接口配置', trigger: 'blur' },
    ],
    api_key: [
        { required: true, message: '请填写API秘钥', trigger: 'blur' },
    ],
    models: [
        { required: true, message: '请填写模型配置', trigger: 'blur' },
    ],
}

onMounted(()=>{

    getApiSettingData().then(data=>{
        if(data.data){
            setting.value=data.data
            let arr:string[]=data.data.models.split(",")
            models.value=arr.filter(item=>item!='')
        }
    })
})

function changeModel(){
    if(!setting.value.models)
        return
    let arr:string[]=setting.value.models.split(",")
    models.value=arr.filter(item=>item!='')
    if(arr.indexOf(setting.value.default_model)==-1){
        setting.value.default_model=""
    }
    if(arr.indexOf(setting.value.default_backup)==-1){
        setting.value.default_backup=""
    }
}

function onSubmit(settingForm:FormInstance | null){
    console.log(setting.value)
   
    settingForm?.validate((valid,messages) => {
        console.log(valid)
        console.log(messages)
        if(valid){
            setApiSettingData({
                api_url:setting.value.api_url,
                api_key:setting.value.api_key,
                models:setting.value.models,
                default_model:setting.value.default_model,
                default_backup:setting.value.default_backup
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
        <el-form-item label="接口配置" prop="api_url"  required>
            <el-input v-model="setting.api_url" placeholder="https://api.openai.com" />
        </el-form-item>
        <el-form-item label="API秘钥" prop="api_key" required>
            <el-input v-model="setting.api_key" placeholder="sk-******" />
        </el-form-item>
        <el-form-item label="模型配置" prop="models" required>
            <el-input type="textarea" :rows="3" v-model="setting.models" @blur="changeModel" placeholder="请至少输入1个模型，多个模型用,隔开" />
        </el-form-item>
        <el-form-item label="默认模型">
          <el-select v-model="setting.default_model" placeholder="未选择默认模型将采用配置中的第1个">
            <el-option v-for="model in models" :label="model" :value="model" />
          </el-select>
        </el-form-item>
        <el-form-item label="默认备用模型">
          <el-select v-model="setting.default_backup" placeholder="未选择默认备用模型将采用配置中的第1个">
            <el-option v-for="model in models" :disabled="setting.default_model==model ? true :false" :label="model" :value="model" />
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
