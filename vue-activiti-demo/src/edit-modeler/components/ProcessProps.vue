<template>
    <div>
        <el-form-item label="目标命名空间" >
            <el-input v-model="targetNamespace" readonly></el-input>
        </el-form-item>
        <el-form-item label="标签版本" v-show="isShow">
            <el-input v-model="versionTag" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-checkbox v-model="isExecutable" v-show="isShow">是否可执行</el-checkbox>
        </el-form-item>
        <el-form-item label="任务优先级" v-show="isShow">
            <el-input v-model="taskPriority"  ></el-input>
        </el-form-item>
        <el-form-item label="工作优先级" v-show="isShow">
            <el-input v-model="jobPriority"  ></el-input>
        </el-form-item>
        <el-form-item label="候选开始组"  v-show="isShow">
            <el-select v-model="candidateStarterGroups" multiple filterable placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="候选开始用户"  v-show="isShow">
            <el-input v-model="candidateStarterUsers"></el-input>
        </el-form-item>
        <el-form-item label="历史生存时间"  v-show="isShow">
            <el-input v-model="historyTimeToLive"></el-input>
        </el-form-item>
        <el-form-item label="监听器配置"  v-show="isShow">
            <el-input v-model="historyTimeToLive"></el-input>
        </el-form-item>
    </div>
</template>
<script>
import bpmnHelper from '../js/helper/BpmnHelper';

export default {
    props:['element'],
    inject: ['bpmn'],
    methods:{
    },
    data(){
        return {
            targetNamespace:'',
            isShow:false,
            versionTag:'',
            isExecutable:true,
            taskPriority:'',
            jobPriority:'',
            candidateStarterGroups:'',
            candidateStarterUsers:'',
            historyTimeToLive:'',
            historyTimeToLive:'',
            options: [{
                value: '1',
                label: '黄金糕'
            }, {
                value: '2',
                label: '双皮奶'
            }],
            candidateStarterGroups: []
        }
    },
    mounted(){
        let modelInfo = this.$root.params.modelInfo;
        let modelId = modelInfo.modelId;
        let definition = this.element.parent;
        if(definition){
            let definitionBo = bpmnHelper.getBo(definition);
            definitionBo.set('targetNamespace',modelId);
        }
        this.targetNamespace = modelId;
        this.$emit('updateProperties',{commonProperties:{id:modelId,name:modelInfo.name}});
    }
}
</script>
<style>

</style>