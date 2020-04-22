<template>
    <div>
        <el-form-item label="编号" required>
            <el-input v-model= "id"></el-input>
        </el-form-item>
        <el-form-item label="名称" required>
            <el-input v-model= "name"></el-input>
        </el-form-item>
        <el-form-item label="调用子流程" v-show="true">
            <el-input v-model="calledElement"></el-input>
        </el-form-item>
        <el-form-item label="文档" v-show="true">
            <el-input type="textarea" v-model="documentation"></el-input>
        </el-form-item>
        <el-form-item label="多实例类型" v-show="false">
            <el-select v-model= "multiinstance_type"> <!--相当于bpmn2.0标准中的isSequential-->
                <el-option label="非多实例" value="None"></el-option>
                <el-option label="同时进行" value="Parallel"></el-option>
                <el-option label="顺序进行" value="Sequential"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="基数 (多实例)" v-show="false"><!--后端暂时没用到-->
            <el-input v-model= "multiinstance_cardinality"></el-input>
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
    inject: ['bpmnModeler'],
    data(){
        return {
            modeling: null,
            id: this.element.id || '',
            name: '',
            calledElement: '',
            documentation:'',
            multiinstance_type: '',
            multiinstance_cardinality: null,
            multiinstance_variable: null,
        }
    },
    mounted() {
        const bpmnModeler = this.bpmnModeler();
        this.modeling = bpmnModeler.get('modeling');
        
    },
    methods:{
        
    },
    watch:{
        name: {
            handler(newVal, oldVal) {
                this.modeling.updateProperties(this.element,{
                    name: newVal
                });
            }
        },
        //监控的元素的变化
        element:{
            deep: true,
            immediate: true, 
            handler:function(newVal,oldVal){
                debugger
                const bpmnModeler = this.bpmnModeler();
                const modeling = bpmnModeler.get('modeling');
                const businessObject = newVal.businessObject;
                this.name = businessObject.name;
                this.calledElement = businessObject.get('calledElement') || '';
                this.documentation = businessObject.get('documentation') || '';
                //this.multiinstance_type = businessObject.get('multiinstance_type') || 'None';
                modeling.updateProperties(newVal,{
                    name: this.name,
                    calledElement: this.calledElement,
                    documentation: this.documentation,
                    //'multiinstance_type':this.multiinstance_type,
                });
                
            }
        },
        
        documentation:{
            handler(newVal,oldVal){
                this.modeling.updateProperties(this.element,{'activiti:documentation':newVal});
            }
        },
        calledElement: {
            handler(newVal, oldVal) {
                this.modeling.updateProperties(this.element,{'calledElement':newVal});
            }
        },
        // multiinstance_type: {
        //     handler(newVal, oldVal) {
        //         this.modeling.updateProperties(this.element,{'multiinstance_type':newVal});
        //     }
        // },
        
    }
}
</script>