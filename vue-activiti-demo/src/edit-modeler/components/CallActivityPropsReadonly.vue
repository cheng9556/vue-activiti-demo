<template>
    <div>
        <el-form-item label="编号">
            <el-input v-model= "id" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model= "name" readonly></el-input>
        </el-form-item>
        <el-form-item label="调用子流程" v-show="true">
            <el-input type="calledElement" v-model="documentation" readonly></el-input>
        </el-form-item>
        <el-form-item label="调用子流程标识" v-show="true">
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
    </div>
     
</template>
<script>
const forEach = require('lodash/forEach'),
      find = require('lodash/find');
import {findObjFromArrayByField,isNeedUpdate} from '../js/util/CommonUtils'; 
import bpmnHelper from '../js/helper/BpmnHelper';
import {NodeTypeMap} from '../../static/js/static'; 

export default {
    props:['element'],
    data(){
        return {
            id: this.element.id || '',
            name: '',
            documentation:'',
            calledElement: '',
            multiinstance_type: '',
            multiinstance_cardinality: null,
            multiinstance_variable: null,
        }
    },
    mounted() {
        
    },
    methods:{
    
    },
    watch:{
        //监控的元素的变化
        element:{
            deep: true,
            immediate: true, 
            handler:function(newVal,oldVal){
                const businessObject = newVal.businessObject;
                this.name = businessObject.name;
                // documentation和userTaskNode存储的值一样
                this.calledElement = businessObject.get('calledElement');
                this.documentation = businessObject.get('activiti:documentation');

                this.multiinstance_type = businessObject.get('multiinstance_type') || 'None';
                this.multiinstance_condition = businessObject.get('multiinstance_condition') || '';
            }
        }
    }
}
</script>