<script setup>
import {ref, onMounted, getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance();
const map = ref(null);
let chartInstance = null;
let enterprises = null;
onMounted(() => {
  initChart();
  getData();
})
const initChart = async () => {
  chartInstance = proxy.$echarts.init(map.value, 'light');
  const res = await proxy.$axios.get('/src/assets/taskAllocation/china.json');
  proxy.$echarts.registerMap('china', res.data);
  const initOption = {
    backgroundColor: '#013154',
    title: {
      text: '联盟成员分布',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#fff',
        fontSize: 30,
      }
    },
    geo: {
      type: 'map',
      map: 'china',
      top: '5%',
      bottom: '5%',
      itemStyle: {
        normal: {
          borderColor: 'rgba(17, 235, 248, 1)',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [{
              offset: 0,
              color: 'rgba(147, 25, 28, 0)' // 0% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(147, 235, 248, .2)' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          },
          shadowColor: 'rgba(18, 27, 28, 1)',
          shadowOffsetX: -2,
          shadowOffsetY: 2,
          shadowBlur: 10
        },
      },
    },
    tooltip:{
      trigger:'item',
    }
  }
  chartInstance.setOption(initOption)
}
const getData = async () => {
  const {data: ret} = await proxy.$axios.get('/src/assets/taskAllocation/scatter.json');
  enterprises = ret;
  updateChart();
}
const updateChart = () => {
  // 处理图表需要的数据
  const seriesArr =
      [{
        type: 'effectScatter',
        rippleEffect: {
          scale: 5,
          color: 'yellow',
          brushType: 'fill'
        },
        label: {
          show: true, // 显示标签
          position: 'right', // 标签位置
          formatter: '{b}', // 标签内容为数据项的名称
          fontSize:20,
          fontWeight:'bold'
        },
        data: enterprises,
        coordinateSystem: 'geo',
        tooltip: {
          formatter: '{a}<br/>{b}'
        },
        name: '联盟成员分布图',
      }]
  const dataOption = {
    series: seriesArr
  }
  chartInstance.setOption(dataOption)
}
</script>

<template>
  <div ref="map" style="height: 600px; width: 70%; margin:0 auto"></div>
</template>

<style scoped lang="less">

</style>