<template>
    <div>
        <el-form-item label="编号">
            <el-input v-model="id" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="name" readonly></el-input>
        </el-form-item>
        <el-form-item label="表单标识" v-show="false">
            <el-input v-model="formKey" readonly></el-input>
        </el-form-item>
        <el-form-item label="文档" v-show="false">
            <el-input type="textarea" v-model="documentation" readonly></el-input>
        </el-form-item>
    </div>
</template>
<script>
import bpmnHelper from '../js/helper/BpmnHelper';
export default {
    props: ['element'],
    data(){
        return {
            id : this.element.id || '',
            name:'',
            formKey:'',
            documentation:'',
        }
    },

    watch: {
        element: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    if(newVal.type === 'bpmn:EndEvent') { // 防止修改其他子组件的属性
                        this.name = newVal.businessObject.name;

                    }
                }
            },
            immediate: true,
            deep: true
            
        },
    }
}
</script>
<style>

</style>