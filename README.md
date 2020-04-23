# 前端：vue+bpmn-js实现activiti的流程设计器，后端Springboot+Activiti开发工作流

> 前端：vue + bpmn-js项目，实现activiti设计器， 后端： springboot + activiti 

鉴于广大程序员们开发设计器苦不堪言以及后端不知道怎么解析自定义属性，于是我就开发了这个基础版本的demo，供广大程序员们学习用，如果有问题请在issue中提问👏👏👏

项目中有什么问题欢迎指出，也欢迎👏👏👏大家帮我一起完善demo

看我这么辛苦为你们整理demo，不给个star你们肯定都不好意思😄😄😄

如果你是后端开发，请从最后面开始往上看😄

![流程图](https://github.com/griabcrh/vue-activiti-demo/blob/master/vue-activiti-demo/static/process-design1.png)

## 一 前端启动项目🌟

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

## 二 详细介绍🌟

可以结合这篇文章进行阅读 ：https://juejin.im/post/5e7330c36fb9a07cd248ef00

关于bpmn-js如何使用建议搭建去github上面搜索，这里贴上官网地址： https://github.com/bpmn-io/bpmn-js

官网案例地址：https://github.com/bpmn-io/bpmn-js-examples

由于bpmn-js官方是适配camunda的，所以对activiti存在不兼容的地方，为了让bpmn-js能使用activiti，我们需要在BpmnModeler中扩展activiti 主要代码如下：
``` bash
import activitiModdleDescriptor from '../js/activiti.json';
```

``` bash
this.bpmnModeler = new BpmnModeler({
  container: canvas,
  //添加属性面板，添加翻译模块
  additionalModules: [
      customTranslateModule,
      customControlsModule  
  ],
  //模块拓展，拓展activiti的描述
  moddleExtensions: {
      activiti: activitiModdleDescriptor
  }
});
```

### 1 关于activiti.json文件怎么配置🌟

``` bash
{
  "name": "Activiti", // 标识是activiti
  "uri": "http://activiti.org/bpmn", // 添加activiti的命名空间
  "prefix": "activiti", // 属性前缀
  "xml": {
    "tagAlias": "lowerCase"
  },
  "associations": [],
  "types": [
    {
      "name": "Process", // <bpmn2:process> 标签
      "isAbstract": true, 
      "extends": [
        "bpmn:Process" // 继承自<bpmn2:process>
      ],
      "properties": [ // 这个标签的属性
        {
          "name": "candidateStarterGroups", // 属性名
          "isAttr": true,  // 是否是属性
          "type": "String" // 属性类型
        },
        {
          "name": "candidateStarterUsers",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "versionTag",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "historyTimeToLive",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "isStartableInTasklist",
          "isAttr": true,
          "type": "Boolean",
          "default": true // 给属性添加默认值，但这个默认值没有写入xml中
        },
        {
          "name":"executionListener", // 监听器属性
          "isAbstract": true, // 抽象
          "type":"Expression" // 类型是表达式
        }
      ]
    },
    // 在这里接着加其他节点
    
    
  ],
  "emumerations": [ ]
}
```


**例子**： 我的项目中需要给用户任务添加自定义的属性 nodeType(节点类型)

``` bash
{
  "name": "UserTask",
  "isAbstract": true, 
  "extends": [
    "bpmn:UserTask"
  ],
  "properties": [
    {
      "name": "nodeType",
      "isAttr": true,
      "type": "String"
    },
  ] 
}
```


### 2 关于部分扩展和完全自定义🌟

拿左侧工具栏来说，前端vue-activiti-demo项目：src/edit-modeler/js/customController/CustomPalette.js文件


**问：**

可以看到我自定义了用户任务和调用活动节点，其他的节点我用bpmn-js自带的；
那如果我不想用bpmn-js自带的怎么办呢？

**解答**：

src/edit-modeler/js/customController/index.js文件
``` bash
import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';

export default {
    __init__: [ 'customContextPad', 'customPalette' ],
    customContextPad: [ 'type', CustomContextPad ],
    customPalette: [ 'type', CustomPalette ]
};
```

这里用的是customPalette，如果要完全自定义则换成paletteProvider;

**同理**：完全自定义contextPad用contextPadProvider,完全自定义属性面板用propertiesProvider

``` bash
import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';

export default {
    __init__: [ 'contextPadProvider', 'paletteProvider' ],
    contextPadProvider: [ 'type', CustomContextPad ],
    paletteProvider: [ 'type', CustomPalette ]
};
```

### 3 关于属性前缀🌟

**问：**

我们都知道，bpmn-js生成的xml文件属性前缀都是camunda，那如何换成我们需要的前缀呢？

**答：**

**有两种方法**

一种是扩展json文件，例如我们需要activiti前缀就扩展了activiti.json

第二种就是直接修改初始化xml文件，我们打开设计器时会importXML一个空节点的xml，我们需要在这个xml中加。
例如：我需要加一个normal的前缀，生成属性后为：normal:nodeType;我们在xml中加上这句话：xmlns:normal="http://flowable.org/bpmn/normal"；以此类推

``` bash
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" 
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
xmlns:normal="http://flowable.org/bpmn/normal" 
xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" 
id="sample-diagram" targetNamespace="http://activiti.org/bpmn">
<bpmn2:process id="Process_1" isExecutable="true">
</bpmn2:process>
<bpmndi:BPMNDiagram id="BPMNDiagram_1">
<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</bpmn2:definitions>
```

xml中加上后，设计器生成的属性如何加？

其实很简单，我们updateProperties时可以加上前缀，例如：
``` bash
modeling.updateProperties(element, {
  'normal:nodeType': 'nodeType'
})
```

### 4 由于属性面板是自定义的，修改了属性面板的属性值，如何同步到xml中；以及我在图形上修改了属性如何同步属性面板🌟

项目是vue架构，那就充分发挥vue的优势: **监听**

部分代码如下：

``` bash
watch: {
  id (newVal, oldVal) {
    const bpmnModeler = this.bpmnModeler();
    const modeling = bpmnModeler.get('modeling');
    modeling.updateProperties(this.element,{'id':newVal});
  },
  name(newVal, oldVal){
    const bpmnModeler = this.bpmnModeler();
    const modeling = bpmnModeler.get('modeling');
    modeling.updateProperties(this.element,{'name':newVal}); 
  },
  // 监控element值，当发生改变时获取响应的属性
  element: {
    deep: true,
    immediate: true,
    handler(newVal, oldVal) {
      if(newVal) {
        const bpmnModeler = this.bpmnModeler(); // 我这里由于项目原因用的是方法获取bpmnModeler
        this.id = newVal.businessObject.get('id');
        this.name = newVal.businessObject.get('name');
        // 初始化赋值
        const modeling = bpmnModeler.get('modeling');
        modeling.updateProperties(this.element,{'name':this.name});
        modeling.updateProperties(this.element,{'process_namespace':this.process_namespace});
        modeling.updateProperties(this.element,{'process_id':this.id});
      }
    }
  }
}
```

由于element是一个复杂的类型，所以深度监听一定要打开。

同步xml：用的是modeling.updateProperties方法，也可以使用newVal.businessObject.$attrs['name'] = this.name修改

修改图形属性同步属性面板：由于深度监听了element，所以修改了图形属性就等于修改了element，所以这里会监听到


### 5 如何添加监听器🌟

可以查看vue-activiti-demo\src\edit-modeler\components\CommonProps.vue这个文件

### 6 如何添加自定义的标签🌟

我建议你看：[自定义元模型示例](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-meta-model)

### 7 如何添加多实例🌟

这里提供代码添加的方法，可以直接在图形中点击扳手设置多实例

``` bash
const moddle = bpmnModeler.get('moddle');
loopCharacteristics = moddle.create('bpmn:MultiInstanceLoopCharacteristics');
loopCharacteristics['collection'] = 'flow_assignee';
loopCharacteristics['elementVariable'] = 'flow_assignee';
let completionCondition = elementsHelper.createElement('bpmn:FormalExpression', { body: '${mulitiInstance.completeTask(execution,passResult,mulitiActivityId)}' }, loopCharacteristics, bpmnFactory);

loopCharacteristics['completionCondition'] = completionCondition;
modeling.updateProperties(element, { loopCharacteristics: loopCharacteristics });
```

### 8 获取根节点
``` bash
bpmnModeler._definitions.rootElements[0]
```

### 9 如何给节点的同级添加节点

**例如：**
![](https://github.com/griabcrh/vue-activiti-demo/blob/master/vue-activiti-demo/static/process-design2.png)

给SequenceFlow的同级添加了BoundaryEvent,只要获取根节点下的所有节点然后push进入你添加的节点就行了
``` bash
bpmnModeler._definitions.rootElements[0].flowElements.push(boundaryEvent);
```

此处应有掌声👏👏👏

### 怼回去🤔️🤔️🤔️

如果后端传给前端的是json文件，不是xml；请大胆的怼回去🤔️🤔️🤔️

### 结语🌟 

如果你有好的解决方案欢迎私我，让我学习学习🤔️

针对后端开发程序员们，我也真整理了后端springboot + activiti的demo；其中介绍了如何解析自定义的属性、如何扩展解析器📒，地址：![后端demo](https://github.com/griabcrh/vue-activiti-demo/tree/master/vue-activiti-service-demo)

针对react + bpmn-js 近期即将上线

针对前后端没有分离，可以参考我之前写的activiti项目请移步：https://github.com/griabcrh/ActivitiDemo

加油呀💪💪💪💪


