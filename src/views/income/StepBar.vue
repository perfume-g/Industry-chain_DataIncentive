<template>
<<<<<<< HEAD
  <div>
<!--    <el-card class="step-card">-->
<!--      <el-steps :active="active" align-center>-->
<!--        <el-step title="选择企业" :icon="OfficeBuilding" description="Step 1" finish-status="success"/>-->
<!--        <el-step title="修改连接关系" :icon="Switch" description="Step 2"/>-->
<!--        <el-step title="确定参数" :icon="Edit" description="Step 3"/>-->
<!--        <el-step title="收益评估" :icon="TrendCharts" description="Step 4"/>-->
<!--      </el-steps>-->
<!--    </el-card>-->

    <el-card class="content-card">
      <div v-show="active === 0">
        <Step1 @onGraph="handleGraph" @onRelatedNodesWith="handleRelatedNodesWith"></Step1>
      </div>
      <div v-show="active === 1">
        <Step2 @onRelationModify="handleRelatedNodesWithout" :relatedNodesWithGlobal="relatedNodesWithGlobal"></Step2>
      </div>
      <div v-show="active === 2">
        <Step3 @onFormInput="onFormInput" :graphGlobal="graphGlobal"
               :relatedNodesWithoutGlobal="relatedNodesWithoutGlobal"></Step3>
      </div>
      <div v-show="active === 3">
        <Step4 :step3Param="step3Param"></Step4>
      </div>
    </el-card>
    <div class="button-container">
      <el-button :icon="ArrowLeft" type="primary" plain style="margin-top: 12px" @click="back"
                 v-show="active !== 0">上一步
      </el-button>
      <div class="right-button-container">
        <el-button type="primary" plain style="margin-top: 12px" @click="next" v-show="active !== 3">下一步
          <el-icon>
            <ArrowRight/>
          </el-icon>
        </el-button>
      </div>
=======
  <el-card class="step-card">
    <el-steps :active="active" align-center>
      <el-step title="选择企业" :icon="OfficeBuilding" description="Step 1" finish-status="success" />
      <el-step title="修改关联关系" :icon="Switch" description="Step 2" />
      <el-step title="确定参数" :icon="Edit" description="Step 3" />
      <el-step title="收益评估" :icon="TrendCharts" description="Step 4" />
    </el-steps>
  </el-card>

  <el-card class="content-card">
    <div v-show="active === 0">
      <Step1 @onGraph="handleGraph" @onRelatedNodesWith="handleRelatedNodesWith"></Step1>
    </div>
    <div v-show="active === 1">
      <Step2 @onRelationSubmit="handleRelatedNodesWithout" @onRelationModify="handleRelationModify"
        :relatedNodesWithGlobal="relatedNodesWithGlobal"></Step2>
    </div>
    <div v-show="active === 2">
      <Step3 @onFormInput="onFormInput" :graphGlobal="graphGlobal" :relatedNodesWithoutGlobal="relatedNodesWithoutGlobal">
      </Step3>
    </div>
    <div v-show="active === 3">
      <Step4 :formGlobal="formGlobal" :relatedNodesWithGlobal="relatedNodesWithGlobal"
       :relatedNodesWithoutGlobal="relatedNodesWithoutGlobal" :relatedNodesWithoutGlobalRefs="relatedNodesWithoutGlobalRefs"></Step4>
    </div>
  </el-card>
  <div class="button-container">
    <el-button :icon="ArrowLeft" type="primary" plain style="margin-top: 12px" @click="back"
      v-show="active !== 0">上一步</el-button>
    <div class="right-button-container">
      <el-button type="primary" plain style="margin-top: 12px" @click="next" v-show="active !== 3">下一步<el-icon>
          <ArrowRight />
        </el-icon></el-button>
>>>>>>> 714bb107be4fbfe734d75ab6da67bc55d5f60bab
    </div>
  </div>
</template>


<script setup>
import { OfficeBuilding, Switch, Edit, TrendCharts, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref, toRef, toRaw, reactive, computed, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'
import Step4 from './components/Step4.vue'


//关联节点和连接信息（含节点自身）——Step1获得
const relatedNodesWithGlobal = reactive({})
//关系图中的节点信息——Step1获得
const graphGlobal = reactive({})
//关联节点和连接信息（不含节点自身）——Step2获得
const relatedNodesWithoutGlobal = reactive({})
const relatedNodesWithoutGlobalRefs = ref({})
// const relatedNodesWithoutGlobal = ref({})
const relatedNodesWithoutModify = reactive({})
//用户输入的参数信息——Step3获得
const formGlobal = reactive({})

//判断是否提交关联关系（true需要在Step2中进行提交）
const isSubmitRelation = ref(false)
const isModifyRelation = ref(false)  //是否在提交之后又修改了关联关系

//获取Step1的关联节点、关系图信息
const handleRelatedNodesWith = (value) => {
  nextTick(() => {
    Object.assign(relatedNodesWithGlobal, value);
    isSubmitRelation.value = true
  });

  // 将响应式对象转换为普通的对象数组
  // console.log("转换前的对象数组：", relatedNodesWithGlobal);
  // const objArray = toRaw(nodeGlobal);
  // console.log("转换后的对象数组：", objArray);
};
const handleGraph = (value) => {
  nextTick(() => {
    Object.assign(graphGlobal, value);
  });
};


//获取Step2的参数信息
const handleRelatedNodesWithout = (value) => {
  nextTick(() => {
    Object.assign(relatedNodesWithoutGlobal, value);
    relatedNodesWithoutGlobalRefs.value = toRef(relatedNodesWithoutGlobal); //将响应式对象转换为普通的对象数组

    isSubmitRelation.value = false
    isModifyRelation.value = false
  });
};
const handleRelationModify = (value) => {
  nextTick(() => {
    Object.assign(relatedNodesWithoutModify, value);
    isModifyRelation.value = true
  });
};

//获取Step3的参数信息
const onFormInput = (value) => {
  Object.assign(formGlobal, value);
};

//计算用户是否选择了节点(Step1)
const isEmptyNode = computed(() => {
  return Object.keys(relatedNodesWithGlobal).length === 0;
});

//计算用户是否输入了参数（Step3）
const isEmptyForm = computed(() => {
  const values = Object.values(formGlobal);
  return values.every(value => {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '';
    }
  });
});


//步骤条
const active = ref(0)
const back = () => {
  if (active.value-- < 0) active.value = 3
}
const next = () => {
  if (active.value === 0) {
    if (!isEmptyNode.value) {
      active.value = 1;
    } else {
      ElMessage({
        type: 'error',
        message: '请先选择收益评估的企业！',
        duration: 3000
      })
    }
  }
  else if (active.value === 1) {
    if (!isSubmitRelation.value && !isModifyRelation.value) {
      active.value = 2;
    } else if (isSubmitRelation.value) {
      ElMessage({
        type: 'error',
        message: '请先提交关联关系！',
        duration: 3000
      })
    } else if (isModifyRelation.value) {
      ElMessage({
        type: 'error',
        message: '关联关系已修改，请重新提交！',
        duration: 3000
      })
    }
  }
  else if (active.value === 2) {
    if (!isEmptyForm.value) {
      active.value = 3;
    } else {
      ElMessage({
        type: 'error',
        message: '请先提交收益评估参数！',
        duration: 3000
      })
    }
  }
}
</script>
<style>
.step-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  height: 120px;
  background-color: (255, 255, 255, 0.1);
}

.content-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  /* height: 650px; */
  height: auto;
  background-color: (255, 255, 255, 0.1);
}

.button-container {
  margin-left: 12px;
  margin-right: 12px;
  display: flex;
  justify-content: space-between;
}

.right-button-container {
  margin-left: auto;
}
</style>

  