<template>
  <div class="charts-container">
    <div id="chart1" style="width: 450px; height: 300px;"></div>
    <div id="chart2" style="width: 450px; height: 300px;"></div>
    <div id="chart3" style="width: 450px; height: 300px"></div>
  </div>
</template>
  
<script setup>
import * as echarts from 'echarts';
import { onMounted } from 'vue';

let myChart1 = null;
let myChart2 = null;
let myChart3 = null;
const animationDuration = 1500;
onMounted(async () => {
  //雷达图（参数权重）
  const chartDom1 = document.getElementById('chart1');
  myChart1 = echarts.init(chartDom1);
  var option1 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    radar: {
      radius: '66%',
      center: ['50%', '45%'],
      splitNumber: 8,
      splitArea: {
        areaStyle: {
          color: 'rgba(127,95,132,.3)',
          opacity: 1,
          shadowBlur: 45,
          shadowColor: 'rgba(0,0,0,.5)',
          shadowOffsetX: 0,
          shadowOffsetY: 15
        }
      },
      indicator: [
        { name: '企业关联关系', max: 1, textStyle: { color: '#000' } },
        { name: '风险选择', max: 1, textStyle: { color: '#000' } },
        { name: '合作策略', max: 1, textStyle: { color: '#000' } },
        { name: '企业地位', max: 1, textStyle: { color: '#000' } },
      ],
      // center: ['75%', '50%'],
      // radius: 120,
      axisName: {
        color: '#fff',
        backgroundColor: '#666',
        borderRadius: 3,
        padding: [3, 5]
      },
    },
    legend: {
      left: 'center',
      bottom: '1',
      data: ['参数权重'],
      textStyle: {
        color: '#000' //修改字体颜色为黑色
      }
    },
    series: [{
      type: 'radar',
      symbolSize: 0,
      areaStyle: {
        normal: {
          shadowBlur: 13,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
          opacity: 1
        }
      },
      data: [
        {
          value: [0.95, 0.71, 0.87, 0.66],
          name: '参数权重'
        }
      ],
      animationDuration: animationDuration
    }]

  }
  myChart1.setOption(option1);

  //饼图（关联关系）
  const chartDom2 = document.getElementById('chart2');
  myChart2 = echarts.init(chartDom2);

  var option2 = {
    title: {
      text: '企业群关联关系统计图', // 设置标题文本
      textStyle: { // 设置标题样式
        color: '#333',
        fontSize: 15,
        fontWeight: 'bold'
      },
      left: 'center', // 设置标题水平居中
      // top: 10 // 设置标题距离顶部的距离
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      top: 'bottom' // 将图例放置在图表底部
    },
    series: [
      {
        name: '关联关系统计图',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 1048, name: '竞争关系' },
          { value: 735, name: '合作关系' },
          { value: 580, name: '供应关系' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart2.setOption(option2);


  //柱状图(企业数、盈利率)
  const chartDom3 = document.getElementById('chart3');
  myChart3 = echarts.init(chartDom3);

  var months = ['2022-01', '2022-02', '2022-03', '2022-04', '2022-05', '2022-06',
    '2022-07', '2022-08', '2022-09', '2022-10', '2022-11', '2022-12'];

  var option3 = {
    title: {
      text: '汽车/家电产业链企业盈利数/率', // 设置标题文本
      textStyle: { // 设置标题样式
        color: '#333',
        fontSize: 15,
        fontWeight: 'bold'
      },
      left: 'center', // 设置标题水平居中
      // top: 10 // 设置标题距离顶部的距离
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['汽车产业链企业数', '家电产业链企业数', '汽车产业链盈利率', '家电产业链盈利率'],
      top: 'bottom' // 将图例放置在图表底部
    },
    xAxis: {
      type: 'category',
      data: months
    },
    yAxis: [
      {
        type: 'value',
        name: '盈利企业数',
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          formatter: '{value} '
        }
      },
      {
        type: 'value',
        name: '盈利企业率',
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: {
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: '汽车产业链企业数',
        type: 'bar',
        data: [100, 120, 130, 150, 160, 180, 190, 200, 180, 160, 140, 120]
      },
      {
        name: '家电产业链企业数',
        type: 'bar',
        data: [80, 90, 100, 110, 120, 130, 140, 150, 130, 110, 90, 70]
      },
      {
        name: '汽车产业链盈利率',
        type: 'line',
        yAxisIndex: 1,
        data: [50, 52, 53, 55, 56, 58, 60, 62, 64, 66, 68, 70]
      },
      {
        name: '家电产业链盈利率',
        type: 'line',
        yAxisIndex: 1,
        data: [40, 45, 48, 50, 52, 55, 57, 60, 63, 65, 68, 70]
      }
    ]
  };
  myChart3.setOption(option3);
})

</script>
<style>
.charts-container {
  display: flex;
  justify-content: space-between;
}
</style>