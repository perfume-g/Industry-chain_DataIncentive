<script setup>
import {useRouter, useRoute} from "vue-router";
import {useCoalitionStore} from "@/store/modules/coalition";

let coalitionStore = useCoalitionStore();
const router = useRouter();
const title = coalitionStore.detail.cname;

const onClickQueryTable = () => {
  router.push({name: 'table'});
}
const onClickQueryMap = () => {
  router.push({name: 'map'});
}
const goBack = () => {
  router.push({path: '/allocation/detail'});
}
</script>

<template>
  <div>
    <h1 style="font-size:20px;text-align: center;font-weight: 700">{{ title }}详情</h1>
    <div style="text-align: center;margin-top: 10px">
      <el-button-group>
        <el-button type="primary" @click="onClickQueryTable">表格视图</el-button>
        <el-button  type="primary" @click="onClickQueryMap">地图视图</el-button>
        <el-button  type="primary" @click="goBack">返回</el-button>
      </el-button-group>
    </div>
    <div  style="margin-top: 10px">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>