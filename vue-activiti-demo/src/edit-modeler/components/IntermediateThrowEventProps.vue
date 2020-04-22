<template>
    <div>
        <el-form-item label="编号" required>
            <el-input v-model="id"></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="表单标识" v-show="false">
            <el-input v-model="fromKey"></el-input>
        </el-form-item>
        <el-form-item label="文档" v-show="false">
            <el-input type="textarea" v-model="documentation"></el-input>
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
        id: function(newVal, oldVal) {
            const bpmnModeler = this.bpmnModeler();
            const modeling = bpmnModeler.get('modeling')
            modeling.updateProperties(this.element,{
                id: newVal
            })
        },
        name: function(newVal, oldVal) {
            const bpmnModeler = this.bpmnModeler();
            const modeling = bpmnModeler.get('modeling')
            modeling.updateProperties(this.element,{
                name: newVal
            })
        },
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