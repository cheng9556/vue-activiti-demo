<template>
    <div>
        <el-form-item label="编号">
            <el-input v-model="id" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="name" readonly></el-input>
        </el-form-item>
        <el-form-item label="表单标识" v-show="false">
            <el-input v-model="fromKey" readonly></el-input>
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
    inject: ['bpmnModeler'],
    data(){
        return {
            id : this.element.id || '',
            name: '',
            fromKey:'',
            documentation:'',
        }
    },

    watch: {
        element: {
            handler(newVal, oldVal) {
                this.name = newVal.name;
                const businessObject = newVal.businessObject;
                const sequenceFlowOrder = businessObject.get('sequenceFlowOrder');
                if(sequenceFlowOrder) {
                    this.process_order = '连线排序设置';
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