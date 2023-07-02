<template>
  <div style="width: 100%; margin: 10px auto; text-align: center;">
    <span>当前评估企业：</span>
    <span style="font-weight: bold; font-size: large;">{{nodeName }}</span>
  </div>
  <el-button type="success" plain @click="formulaVisible = true" style="margin-bottom: 10px;">计算公式</el-button>

  <el-dialog v-model="formulaVisible" title="多重产业链收益评估算法">
    <el-form>
      <el-form-item label="计算公式：" :label-width="formLabelWidth">
        <span>收益率=(总收益 - 总成本) / 总成本</span>
      </el-form-item>
      <el-form-item label="参数1：" :label-width="formLabelWidth">
        <span>企业关联关系（权重0.95）</span>
      </el-form-item>
      <el-form-item label="参数2：" :label-width="formLabelWidth">
        <span>风险选择（权重0.71）</span>
      </el-form-item>
      <el-form-item label="参数3：" :label-width="formLabelWidth">
        <span>合作策略（权重0.87）</span>
      </el-form-item>
      <el-form-item label="参数4：" :label-width="formLabelWidth">
        <span>企业地位（权重0.66）</span>
      </el-form-item>
    </el-form>
  </el-dialog>

  <div class="container">
    <LineChart></LineChart>
  </div>
  <div class="container">
    <CombinedChart></CombinedChart>
  </div>
</template>
  
  
<script lang="ts" setup>
import { colProps } from 'element-plus';
import { reactive, ref, toRefs, toRaw } from 'vue'
import { watch, watchEffect, nextTick } from 'vue'
import LineChart from './chart/LineChart.vue'
import CombinedChart from './chart/CombinedChart.vue'
const formulaVisible = ref(false)
const formLabelWidth = '140px'

//接收数据
const props = defineProps({
  formGlobal: Object,
  relatedNodesWithGlobal: Object,
  relatedNodesWithoutGlobal: Object,
  relatedNodesWithoutGlobalRefs: Object,
});
const formData = ref(
  {
    time: '',
    preference: '',
    strategy: '',
    remark: '',
  }
)
//选中节点信息
const nodeId = ref('')
const nodeName = ref('')
const nodeFiled = ref('')
const nodeCategory = ref('')
const nodeNetwork = ref([])
//关联节点信息
const relatedNodesData = ref<Node[]>([]);
// const refs = ref<Node[]>([]);
const refs = reactive<Node[]>([]);
interface Node {
  id: string,
  name: string,
  index: number,
  filed: string,
  category: string,
  network: string[],
  relation: string[],
  x: number,
  y: number,
  deleted: boolean
}

watch(
  () => props.formGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal) {
        formData.value.time = newVal.time;
        formData.value.preference = newVal.preference;
        formData.value.strategy = newVal.strategy;
        formData.value.remark = newVal.remark;
      }
    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);

//监听数据
watch(
  () => props.relatedNodesWithGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal && newVal.nodes) {
        nodeId.value = newVal.nodes[0].id;
        nodeName.value = newVal.nodes[0].name;
        nodeFiled.value = newVal.nodes[0].filed;
        nodeCategory.value = newVal.nodes[0].category;
        nodeNetwork.value = newVal.nodes[0].network;
      }
    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);


// 监听父组件传递的响应式对象数组
watchEffect(() => {

  //只能获取第一次提交的关系，无法实时更新
  Object.assign(relatedNodesData, props.relatedNodesWithoutGlobal);
  console.log("relatedNodesData", relatedNodesData.value);


  // 可以实时更新，但是无法解包获取具体数据
  // 方法一：父组件使用toRef，子组件使用ref对象存储
  // relatedNodesData.value = props.relatedNodesWithoutGlobalRefs as Node[];

  // if (props.relatedNodesWithoutGlobalRefs) {
  //   console.dir(props.relatedNodesWithoutGlobalRefs);
  // }

  // if (props.relatedNodesWithoutGlobalRefs) {
  //   const _object = Reflect.get(props.relatedNodesWithoutGlobalRefs, "_object");
  //   console.log("_object", _object);
  // }


});


</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>