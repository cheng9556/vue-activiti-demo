<template>
    <el-form-item>
        <el-checkbox v-model="asyncBefore" :show="false">异步前</el-checkbox>
        <el-checkbox v-model="asyncAfter">异步后</el-checkbox>
    </el-form-item>
</template>
<script>
export default {
    props:['element','bpmn'],
    data(){
        return {
            asyncBefore:'',
            asyncAfter:''
        }
    }
}
</script>
<style>

</style>