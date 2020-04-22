<template>
  <el-dialog
  title="流程追踪"
  :visible.sync="dialogViewModelVisible"
  width="80%"
  :before-close="handleClose">
  <Viewer ref="viewer" :params="params"></Viewer>
  <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleOk">确 定</el-button>
  </span>
</el-dialog>
</template>


<script>
import Viewer from './components/Viewer'
  export default {
    props: ['dialogViewModelVisible', 'params'],
    components: {
      Viewer
    },
    data() {
      return {
        
      };
    },
    methods: {
      handleOk() {
        this.$emit('handleViewModelVisiable', { visiable: false })
        this.$refs.modeler.saveXML();
      },
      handleClose(done) {
        this.$emit('handleViewModelVisiable', { visiable: false })
      },
    }
  };
</script>