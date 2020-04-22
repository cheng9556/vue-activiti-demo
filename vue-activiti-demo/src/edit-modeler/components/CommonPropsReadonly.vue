<template>
  <div>
    <el-form-item label="编号" v-show="false" >
      <el-input v-model="id" readonly></el-input>
    </el-form-item>
    <el-form-item label="流程名称" required>
      <el-input v-model="name" readonly></el-input>
    </el-form-item>
    <el-form-item label="目标命名空间" v-show="false">
      <el-input v-model="process_namespace" readonly></el-input>
    </el-form-item>
    <el-form-item label="描述" v-show="false">
      <el-input type="textarea" v-model="description" readonly></el-input>
    </el-form-item>
  </div>
</template>
<script>
import bpmnHelper from '../js/helper/BpmnHelper';
export default {
  //依赖注入
  data () {
    return {
      id: '',
      name: '',
      process_namespace: '',
      description: ''
    }
  },
  watch: {
    // 监控element值，当发生改变时获取响应的属性
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal) {
          const bpmnModeler = this.bpmnModeler();
          this.id = newVal.businessObject.get('id');
          this.name = newVal.businessObject.get('name');
          this.process_id = this.id;
          this.process_namespace = newVal.businessObject.get('process_namespace');
        }
      }
    }
  }
}

</script>
