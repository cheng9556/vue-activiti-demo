<template>
    <div>
        <el-form-item label="编号" v-show="false">
            <el-input v-model="id" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称">
            <el-input v-model="name" readonly></el-input>
        </el-form-item>
        <el-form-item label="跳转条件" v-show="needConditiona">
                <el-input v-model="condition" readonly ></el-input>
        </el-form-item>
        <!-- <el-form-item label="默认跳线" v-show="needConditiona">
            <el-select v-model="defaultflow" filterable readonly>
                <el-option label="是" :value=true></el-option>
                <el-option label="否" :value=false></el-option>
            </el-select>
        </el-form-item>  暂时不用  -->
    </div>
</template>
<script>
import bpmnHelper from '../js/helper/BpmnHelper';
import {is} from 'bpmn-js/lib/util/ModelUtil';
import AdjacencyMatrixGraph from '../js/util/AdjacencyMatrixGraph';
import {OperatorAllOptions,LogicOptions,wfResult,OperatorLessOptions} from '../../static/js/static';
import {isBlank} from '../js/util/CommonUtils';
import {IntAttri} from '../../static/js/static';

const eventDefinitionHelper = require('../js/helper/EventDefinitionHelper'),
      isAny = require('bpmn-js/lib/features/modeling/util/ModelingUtil').isAny,
      elementHelper = require('../js/helper/ElementHelper'),
      forEach = require('lodash/forEach'),
      filter = require('lodash/filter'),
      find = require('lodash/find'),
      findIndex = require('lodash/findIndex'),
      includes = require('lodash/includes'),
      replace = require('lodash/replace'),
      map = require('lodash/map'),
      uuid = require('uuid/v1');
const DEFAULT_VALUE = {
    condition:'未配置任何条件',
    logicLabel:'无'
}
export default {
    props:['element'],
    inject: [],
    data(){
        return {
            modeling: null,
            id : this.element.id || '',
            name: '',
            condition:DEFAULT_VALUE.condition,
            // defaultflow:false,
            //时都需要条件
            needConditiona:false,
            dialogTableVisible:false,
            //条件列表
            conditionList:[],
            logicOptions: LogicOptions,
            conditionalOpts:[],
            formShow:false,
            form:{
                id:'',
                variable:'',
                conditionalOpt:'',
                conditionalVal:'',
                logic:'',
                tmp:{
                    //变量的详细信息
                    variableInfo:undefined,
                    componentType:'input',
                    conditionalValData:undefined
                }
            },
            table:{
                conditions: [],
                selectedRow:undefined
            }
            
        }
    },

    mounted(){
    },

    methods:{
        loadCondition(bo){
            bo = bo || bpmnHelper.getBo(this.element);
            let conditionalEventDefinition = eventDefinitionHelper.getConditionalEventDefinition(this.element);
            let conditionExpression = conditionalEventDefinition? conditionalEventDefinition.condition:bo.conditionExpression;
            this.condition ='未配置任何条件';
            if(conditionExpression){
                //获取配置的条件表达
                let condition = conditionExpression.get('body');
                this.parseCondition(condition);
            } 
        },
        parseCondition(conditionExpress){
            let operators = ['!','=','>','<'];
            let logicOperators = ['&','|'];
            conditionExpress = conditionExpress.replace('$','').replace('{','').replace('}','').replace(new RegExp('"','g'),'');
            this.table.conditions = [];
            let self = this;
            splitConditionExpress(conditionExpress);
            //截取表达时候
            function splitConditionExpress(str){
                //正查找查找操作符 
                let idx = findChar(str,true,true,logicOperators);
                if(idx == -1){
                    let row = createConditionRow(str);
                    self.table.conditions.push(row);
                    return;
                }else{
                    //操作符
                    let logic = str.substring(idx,idx+2);
                    let conditionExpress = str.substring(0,idx);
                    let row = createConditionRow(conditionExpress,logic);
                    self.table.conditions.push(row);
                    let newStr = str.substring(idx+2);
                    splitConditionExpress(newStr);
                }
            }
            function createConditionRow(conditionExpress,logic){
                let row  = {};
                //纯表达式
                let headOptIdx = findChar(conditionExpress,true,false,operators);
                let footOptIdx = findChar(conditionExpress,false,false,operators);
                //变量
                let variable = conditionExpress.substring(0,headOptIdx).trim();
                //值
                let val = conditionExpress.substring(footOptIdx+1,conditionExpress.length).trim();
                //操作符
                let opt =  conditionExpress.substring(headOptIdx,footOptIdx+1).trim();
                row.id = uuid();
                row.variable = variable;
                row.conditionalOpt = opt;
                row.conditionalVal = val;
                row.logic = logic
                return row;
            }
            /**
             * @description 检索第一个的操作操作符
             * @param str 需要被检索的字符串
             * @param  type 类型 true:正查找 false:反查找
             * @param report 检索的字符是否需要重复 true | false
             */
            function findChar(str,type,report,operators){
                let index = -1;
                let len = str.length;
                if(type){
                    for(let i = 0;i < len; i++){
                        let char = str.charAt(i);
                        if(includes(operators,char)){
                            //查找第一个
                            if(report){
                                if(char == str.charAt(i+1)){
                                    index = i;
                                    break;
                                }
                            }else{
                                index = i;
                                break;
                            }
                        }
                    }
                }else if(!type){
                    for(let i = (len-1);i >= 0; i--){
                        let char = str.charAt(i);
                        if(includes(operators,char)){
                            //从末尾查找最后一个
                            if(report){
                                if(char == str.charAt(i-1)){
                                    index = i;
                                    break ;
                                }
                            }else{
                                index = i;
                                break ;
                            }
                        }
                    }
                }
                return index;
            }
        },
        //设置组件的值
        initSubComponent(variableInfo){
            variableInfo  = variableInfo || this.getVariableInfo();
            if(variableInfo){
                if(variableInfo.type == 'result'){
                    this.conditionalOpts = [];
                    this.conditionalOpts = OperatorLessOptions;
                    this.form.tmp.componentType = 'select';
                    this.form.tmp.conditionalValData = wfResult;
                }
                if (variableInfo.type == "number") {
                    $scope.dataStatus.INPUT = true;
                    return;
                }

                //如果是select型则要获取select列表数据
                if (variableInfo.type == 'select') {
                    // TODO
                    return;
                }
                //如果是日期控件
                if (variableInfo.type == 'date') {
                    // TODO
                    return;
                }

                //如果是tree
                if (variableInfo.type == 'inputtree') {
                    // TODO
                    return;
                }

                //如果是lookup
                if (variableInfo.type == 'lookup') {
                   // TODO
                    return;
                }
            }
        },
        translateAllConditions(){
            let conditions = this.table.conditions;
            let conditionList = this.conditionList;
            forEach(conditions,function(condition){
                let conditionInfo = find(conditionList,{VALUE:condition.variable});
                if(conditionInfo){
                    //翻译变量名称
                    condition.variableLabel = conditionInfo.TEXT;
                    //如果条件类型为结果类型的
                    if(conditionInfo.type = 'result'){
                        //翻译条件值
                        let resultInfo = find(wfResult,{VALUE:condition.conditionalVal});
                        condition.conditionalValLabel = resultInfo.TEXT;
                    }
                }
                let optInfo = find(OperatorAllOptions,{VALUE:condition.conditionalOpt});
                if(optInfo){
                    //翻译操作符
                    condition.conditionalOptLabel = optInfo.TEXT;
                }
                let logicInfo = find(LogicOptions,{VALUE:condition.logic});
                if(logicInfo){
                    //翻译逻辑符
                    condition.logicLabel = logicInfo.TEXT;
                }else{
                    condition.logicLabel = '无';
                }
            });
        },
        getVariableInfo(variableVal){
            if(variableVal === undefined){
                variableVal = this.form.variable;
            }
            return find(this.conditionList,{VALUE:variableVal});
        }
    },
    watch:{
        element:{
            deep:true,
            immediate: true, 
            handler(element,oldVal){
                this.name = element.businessObject.name;
                let bo = bpmnHelper.getBo(element);
                if(!idNeedCondition(element,bo)){
                    return;
                };
                //显示条件配置选项
                this.needConditiona = true;
                // this.defaultflow = false;
                //获取source节点
                let sourceBo = bpmnHelper.getBo(element.source);
                if(!sourceBo){
                    return;
                }
                //获取source上的默认连线
                // let defalutSequence = element.businessObject.get('defaultflow');
                // if(defalutSequence === bo){
                //     this.defaultflow = true;
                // }
                //加载条件
                this.loadCondition();
            }
        },
        //监控变量的值
        'form.variable':{
            immediate: true, 
            handler:function(newVal,oldVal){
                if(newVal === ''){
                    return;
                }
                let variableInfo = this.getVariableInfo(newVal);
                //初始化组组件的值
                this.initSubComponent(variableInfo);
                if(variableInfo){
                    let currentRow = this.table.selectedRow;
                    let index = findIndex(this.table.conditions,{id:currentRow.id});
                    currentRow.variable = newVal,
                    currentRow.variableLabel = variableInfo.TEXT;
                    this.$set(this.table.conditions,index,currentRow);
                }
                
            }
        },
        'form.conditionalOpt':function(newVal,oldVal){
            let variableInfo = this.getVariableInfo();
            let currentRow =this.table.selectedRow;
            if(currentRow){
                if(variableInfo){
                    let index = findIndex(this.table.conditions,{id:currentRow.id});
                    if(variableInfo.type == 'result'){
                        currentRow.conditionalOpt = newVal;
                        let opt = find(OperatorLessOptions,{VALUE:newVal})
                        if(opt){
                            currentRow.conditionalOptLabel = opt.TEXT;
                        }
                        this.$set(this.table.conditions,index,currentRow);
                    }
                }
            }
            
          
        },
        'form.conditionalVal':function(newVal,oldVal){
            if(newVal !== oldVal){
                let variableInfo = this.getVariableInfo();
                let currentRow = this.table.selectedRow;
                if(currentRow){
                    if(variableInfo){
                        let index = findIndex(this.table.conditions,{id:currentRow.id});
                        if(variableInfo.type == 'result'){
                            currentRow.conditionalVal = newVal;
                            let result = find(wfResult,{VALUE:newVal});
                            if(result){
                                currentRow.conditionalValLabel = result.TEXT;
                            }
                            this.$set(this.table.conditions,index,currentRow);
                        }
                    }
                }
               
            }
        },
        'form.logic':{
            immediate: true, 
            handler:function(newVal,oldVal){
                let currentRow = this.table.selectedRow;
                if(currentRow){
                    let index = findIndex(this.table.conditions,{id:currentRow.id});
                    if(newVal !== oldVal){
                        currentRow.logic = newVal;
                        if(newVal == ''){
                            currentRow.logicLabel = '无';
                        }else{
                            let logicOpt = find(LogicOptions,{VALUE:newVal});
                            if(logicOpt){
                                currentRow.logicLabel = logicOpt.TEXT;
                            }
                        }
                        this.$set(this.table.conditions,index,currentRow);
                    }

                }
            }
        },
        'table.selectedRow':{
            deep:true,
            immediate: true, 
            handler:function(newVal){
                if(newVal !== undefined){
                    this.formShow = true;
                    this.form.variable = newVal.variable;
                    let variableInfo = this.getVariableInfo();
                    this.initSubComponent(variableInfo);
                    this.form.conditionalOpt = newVal.conditionalOpt;
                    this.form.conditionalVal = newVal.conditionalVal;
                    this.form.logic = newVal.logic;
                    this.form.tmp.variableInfo = undefined;
                }else{
                    this.formShow = false;
                }
             }
        },
        'table.conditions':{
            immediate: true, 
            handler:function(conditions){
                if(conditions === undefined || conditions.length == 0){
                     this.condition = '未配置任何条件';
                }else{
                    this.condition = '已配置'+conditions.length+'条件';
                }
            }
        }
    }
}
//只有网关和活动才需要配置条件
const CONDITIONAL_SOURCES = [
  'bpmn:Activity',
  'bpmn:ExclusiveGateway',
  'bpmn:InclusiveGateway',
  'bpmn:ComplexGateway'
];

function isConditionalSource(element) {
  return isAny(element, CONDITIONAL_SOURCES);
}

//判断是否需要条件配置
function idNeedCondition(element,bo){
    if(!bo){
        return false;
    }
    let conditionalEventDefinition = eventDefinitionHelper.getConditionalEventDefinition(element);
    if (!(is(element, 'bpmn:SequenceFlow') && isConditionalSource(element.source))
        && !conditionalEventDefinition) {
        return false;
    }
    return true;
}
//校验表达式的正确性
function validateConditions(conditions){
    let flag = true;
    forEach(conditions,function(condition,index){
            index = index+1;
            if(isBlank(condition.variable)){
                console.error('第'+index+'个条件,变量不能为空');
                flag  = false;
                return;
            };
            if(isBlank(condition.conditionalOpt)){
                console.error('第'+index+'个条件,操作符不能为空');
                flag  = false;
                return;
            };
            if(isBlank(condition.conditionalVal)){
                console.error('第'+index+'个条件,变量值不能为空');
                flag  = false;
                return;
            };
            if(index < conditions.length){
                if(isBlank(condition.logic)){
                    console.error('配置多个条件时，须配置逻辑,第'+index+'个条件逻辑未配置');
                    flag  = false;
                    return  ;
                };
            }
    });
    return flag;
}

</script>
<style>

</style>