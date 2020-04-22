<template>
    <div>
        <el-form-item label="编号" >
            <el-input v-model= "id" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称" >
            <el-input v-model= "name" readonly></el-input>
        </el-form-item>
        <el-form-item label="文档" v-show="false" >
            <el-input type="textarea" v-model="documentation" readonly></el-input>
        </el-form-item>
        <el-form-item label="多实例类型">
            <el-select v-model= "multiinstance_type" disabled> <!--相当于bpmn2.0标准中的isSequential-->
                <el-option label="非多实例" value="None"></el-option>
                <el-option label="同时进行" value="Parallel"></el-option>
                <el-option label="顺序进行" value="Sequential"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="基数 (多实例)" v-show="false"><!--后端暂时没用到-->
            <el-input v-model= "multiinstance_cardinality" type="number"></el-input>
        </el-form-item>
        <el-form-item label="元素的变量(多实例)" v-show="false"><!--后端暂时没用到-->
            <el-input v-model= "multiinstance_variable" ></el-input>
        </el-form-item>
        <el-form-item label="用户任务的优先级[1-100]" v-show="false"><!--暂时没用上-->
            <el-input v-model= "priority" type="number"></el-input>
        </el-form-item>
        <el-form-item label="通过权重[1-100]">
            <el-input v-model= "multiinstance_condition" type="number" readonly></el-input>
        </el-form-item>
        <el-form-item label="表单标识"  required>
            <el-input v-model= "formKey" readonly></el-input>
        </el-form-item>
        <el-form-item label="任务派遣">
            <el-select v-model= "candidateGroups" multiple filterable placeholder="请选择" disabled>
                <el-option
                v-for=" p in positions"
                :key="p.id"
                :label="p.name"
                :value="p.id">
                </el-option>
            </el-select>
        </el-form-item>
    </div>
</template>
<script>
const forEach = require('lodash/forEach');
import {findObjFromArrayByField,isNeedUpdate} from '../js/util/CommonUtils'; 
import bpmnHelper from '../js/helper/BpmnHelper';
import {NodeTypeMap,TxTypeMap} from '../../static/js/static'; 
// 用户任务属性组件
export default {
    props:['element'],
    inject: [],
    data(){
        return {
            // 共有
            id: this.element.id || '',
            name: '',
            formKey:'',
            documentation: '',
            multiinstance_type: '',
            multiinstance_collection: '',
            multiinstance_condition: '',
            multiinstance_cardinality: null,
            multiinstance_variable: null,
            positions:[],
            priority:'',
            candidateGroups: '没有受让人'
        }
    },
    methods:{

    },
    mounted() {

    },
    watch:{
       
        //监视元素变化
        element:{
            deep: true,
            immediate: true, 
             handler(newVal,oldVal){
                const businessObject = newVal.businessObject;
                this.name = businessObject.name;
                this.formKey = businessObject.get('formKey') || businessObject.get('activiti:formKey');
                if(businessObject.get('candidateGroups') && businessObject.get('candidateGroups').length > 0) {
                    this.candidateGroups = businessObject.get('candidateGroups').split(',');
                }

                this.multiinstance_type = businessObject.get('multiinstance_type') || 'None';
                this.multiinstance_condition = businessObject.get('multiinstance_condition') || '';
             }
        },
        
    }
   
}
</script>
<style>

</style>