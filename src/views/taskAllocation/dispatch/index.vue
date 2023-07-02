<script setup>
import {onMounted, onUnmounted} from "vue";
import {onBeforeRouteUpdate} from "vue-router";
onMounted(()=>{
  console.log('dispatch mounted');
})
onUnmounted(()=>{
  console.log('dispatch unmount');
})
onBeforeRouteUpdate((to, from, next) => {
  console.log('dispatch route update');
  next();
})
</script>

<template>
  <div>
    <div class="header">
      <el-button-group>
        <el-button @click="$router.push({name:'table'})" type="primary">表格视图</el-button>
        <el-button @click="$router.push({name:'flowchart'})" type="primary">流程图视图</el-button>
        <el-button @click="$router.push({name:'operator'})" type="primary">操作员管理</el-button>
      </el-button-group>
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>