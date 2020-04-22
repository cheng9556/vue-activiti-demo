<template>
  <div>
    <el-container style="height: 700px">
      <el-aside width="80%" style="border: 1px solid #DCDFE6" >
        <div ref="canvas" style="width: 100%;height: 100%"></div>
      </el-aside>
      <el-main style="border: 1px solid #DCDFE6;background-color:#FAFAFA
      ">
          <el-form label-width="auto" size="mini" label-position="top">
            <!-- 动态显示属性面板 -->
            <component :is= "propsComponent" :element= "element" :key= "key"></component>
          </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import BpmnViewer from 'bpmn-js/lib/Viewer';
import bpmnHelper from '../js/helper/BpmnHelper';
import CommonPropsReadonly from './CommonPropsReadonly.vue';
import ProcessProps from './ProcessProps.vue';
import StartEventPropsReadonly from './StartEventPropsReadonly.vue';
import EndEventPropsReadonly from './EndEventPropsReadonly.vue';
import IntermediateThrowEventPropsReadonly from './IntermediateThrowEventPropsReadonly.vue';
import ExclusiveGatewayPropsReadonly from './ExclusiveGatewayPropsReadonly.vue';
import ParallelGatewayPropsReadonly from './ParallelGatewayPropsReadonly.vue';
import InclusiveGatewayPropsReadonly from './InclusiveGatewayPropsReadonly.vue';
import UserTaskPropsReadonly from './UserTaskPropsReadonly.vue';
import SequenceFlowPropsReadonly from './SequenceFlowPropsReadonly.vue';
import CallActivityPropsReadonly from './CallActivityPropsReadonly.vue';
// import customControlsModule from '../js/customControls';
const forEach = require('lodash/forEach');

export default {
  props: ["params"],
  components: {
    CommonPropsReadonly,
    ProcessProps,
    StartEventPropsReadonly,
    EndEventPropsReadonly,
    IntermediateThrowEventPropsReadonly,
    ExclusiveGatewayPropsReadonly,
    ParallelGatewayPropsReadonly,
    InclusiveGatewayPropsReadonly,
    UserTaskPropsReadonly,
    SequenceFlowPropsReadonly,
    CallActivityPropsReadonly
  },
  provide: function () {
    return {
      bpmnModeler: this.getBpmnModeler,
    }
  },
  data () {
    return {
      propsComponent:'CommonPropsReadonly',
      bpmnModeler: null,
      canvas: null,
      element: null,
      key: '1',
      defaultData: {
        'bpmn:StartEvent': '交易开始',
        'bpmn:EndEvent':'交易完成',
        'bpmn:IntermediateThrowEvent':'交易终止'

      }
    }
  },
  methods: {
      //初始化BpmnModeler
      initBpmnModeler(){
        let canvas = this.$refs.canvas;
        // var customTranslateModule = {
        //     translate: [ 'value', customTranslate ]
        // };
        this.bpmnModeler = new BpmnViewer({
          container: canvas
        });
        this.importBpmnXml()
        
      },
      //导入xml文档
      importBpmnXml(){
        const that = this;
        let bpmnXml = bpmnHelper.getBpmnTempate();
        if(that.params.bpmnXml) {
          bpmnXml = that.params.bpmnXml
        }
        that.bpmnModeler.importXML(bpmnXml,function(err){
            if(err){
                console.log('bpmn文档导入失败');
            } else {
              // 绑定监听事件
              that.success()
            }
        });
      },
      getBpmnModeler() {
        return this.bpmnModeler
      },
      success() {
        console.log('创建成功!')
        this.addModelerListener()
        this.addEventBusListener()
      },
      addModelerListener() {
        // 监听 modeler
        const bpmnjs = this.bpmnModeler
        const that = this
        // 'shape.removed', 'connect.end', 'connect.move'
        const events = ['shape.added', 'shape.move.end', 'shape.removed']
        events.forEach(function(event) {
          that.bpmnModeler.on(event, e => {
            var elementRegistry = bpmnjs.get('elementRegistry')
            var shape = e.element ? elementRegistry.get(e.element.id) : e.shape
            // console.log(shape)
            if (event === 'shape.added') {
              console.log('新增了shape');
              // 展示新增图形的属性
              that.key = e.element.id.replace('_label', '');
              that.propsComponent = bpmnHelper.getComponentByEleType(shape.type + 'Readonly');
              that.element = e.element;
              
            } else if (event === 'shape.move.end') {
              console.log('移动了shape')
              // 展示新增图形的属性
              that.key = shape.id;
              that.propsComponent = bpmnHelper.getComponentByEleType(shape.type + 'Readonly');
              that.element = e.shape;
            } else if (event === 'shape.removed') {
              console.log('删除了shape')
              // 展示默认的属性
              that.propsComponent = 'CommonPropsReadonly'
            }
          })
        })
      },
      addEventBusListener() {
        // 监听 element
        let that = this
        const eventBus = this.bpmnModeler.get('eventBus')
        const eventTypes = ['element.click', 'element.changed', 'selection.changed']
        eventTypes.forEach(function(eventType) {
          eventBus.on(eventType, function(e) {
            if (eventType === 'element.changed') {
              that.elementChanged(e)
            } else if (eventType === 'element.click') {
              console.log('点击了element');
              if (!e || e.element.type == 'bpmn:Process') {
                that.key = '1';
                that.propsComponent = 'CommonPropsReadonly'
                that.element = e.element;
              } else {
                // 展示新增图形的属性
                that.key = e.element.id;
                that.propsComponent = bpmnHelper.getComponentByEleType(e.element.type + 'Readonly');
                that.element = e.element;
              }
              
            }
          })
        })
      },
      isInvalid (param) { // 判断是否是无效的值
        return param === null || param === undefined || param === ''
      },
      isSequenceFlow (type) { // 判断是否是线
        return type === 'bpmn:SequenceFlow'
      },
      elementChanged(e) {
        const id = e.element.id.replace('_label', '');
        var shape = this.getShape(id);
        this.element = shape;
        const that = this;
        console.log(shape);
        if (!shape) {
          // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
          console.log('无效的shape')
          // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
          console.log('删除了shape和connect')
          return
        }
        if (!this.isInvalid(shape.type)) {
          if (this.isSequenceFlow(shape.type)) {
            console.log('改变了线')
          } else {
            that.setDefaultProperties();
          }
        }
      },
      getShape(id) {
        var elementRegistry = this.bpmnModeler.get('elementRegistry')
        return elementRegistry.get(id)
      },
      setDefaultProperties() {
        console.log('setDefaultProperties');
        const that = this;
        const { element } = that;
        if (element) {
          // 这里可以拿到当前点击的节点的所有属性
          const { type, businessObject } = element;
          const { name } = businessObject;
          if (that.verifyIsEvent(type)) {
            const eventType = businessObject.eventDefinitions ? businessObject.eventDefinitions[0]['$type'] : '';
            console.log(eventType);
          } else if (this.verifyIsTask(type)) {
            const taskType = type;
            console.log(taskType);
          }
          that.element['name'] = name || that.defaultData[element.type]
          }
      },
      verifyIsEvent(type) {
        return type.includes('Event')
      },
      verifyIsTask(type) {
        return type.includes('Task')
      },
  },
  mounted () {
    //初始化模型编辑器
    this.initBpmnModeler();
  }
}

</script>

<style>
.el-form-item__label {
  font-size: 13px
}
.el-main {
  padding: 5px
}
.el-input--mini .el-input__inner {
    height: 23px;
    line-height: 23px;
}
.el-form--label-top .el-form-item__label {
    padding: 0 0 0px;
}
.el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label {
    line-height: 23px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 3px;
}
.el-checkbox__label {
    padding-left: 10px;
    line-height: 19px;
    font-size: 13px;
}
.el-input__inner{
      padding: 0 5px;
}
.el-textarea__inner {
  padding: 5px 5px;
}
.el-input--mini .el-input__icon {
    line-height: 23px;
}
</style>
