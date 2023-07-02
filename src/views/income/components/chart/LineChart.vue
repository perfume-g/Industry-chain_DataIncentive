<template>
    <div id="main" style="width:1400px;height:400px"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

let myChart = null;
onMounted(async () => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);

  //绘制ECharts关系图
  myChart.setOption({
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      name: '预估收益（万）',
      axisLabel: {
        show: true,
        formatter: '{value}' // 这里可以自定义y轴标签的显示格式
      }
    },
    legend: {
      data: ['评估企业收益', '关联企业群收益']
    },
    series: [{
      name: '评估企业收益', itemStyle: {
        normal: {
          color: '#FF005A',
          lineStyle: {
            color: '#FF005A',
            width: 2
          }
        }
      },
      smooth: true,
      type: 'line',
      data: [50, 200, 360, 300, 250, 400],
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: '关联企业群收益',
      smooth: true,
      type: 'line',
      itemStyle: {
        normal: {
          color: '#3888fa',
          lineStyle: {
            color: '#3888fa',
            width: 2
          },
          areaStyle: {
            color: '#f3f8ff'
          }
        }
      },
      data: [200, 450, 670, 600, 510, 770],
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }]
  });

});

onUnmounted(() => {
  myChart.dispose();
});

</script>

<style>
/* 设置容器高度 */
.el-main {
  height: 100%;
}
</style>
