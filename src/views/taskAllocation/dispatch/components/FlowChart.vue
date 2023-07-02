<script setup>
import {ref, getCurrentInstance, onMounted} from 'vue';

const {proxy} = getCurrentInstance();
const chartRef = ref(null);

const option = {
  title: {
    text: '任务执行流程图',
    left: 'center'
  },
  tooltip: {},
  legend:[{
    data: ['未分配','已分配','失败','已完成'],
    textStyle: {
      color: 'black'
    },
    orient: 'horizontal', // 设置图例的布局方向为水平
    top: '10%'
  }
  ],
  series: [
    {
      type: 'graph',
      layout: 'none',
      roam: false,
      left: '30%',
      top: '20%',
      bottom: '10%',
      categories:[
        { name: '未分配', itemStyle: { color: 'gray' } },
        { name: '已分配', itemStyle: { color: 'yellow' } },
        { name: '失败', itemStyle: { color: 'red' } },
        { name: '已完成', itemStyle: { color: 'green' } }
      ],
      label: {
        show: true,
      },
      data: [
        {
          id: "1", name: '任务1', x: 10, y: 10,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 0
        },
        {
          id: "2", name: '任务2', x: 10, y: 20,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {
          id: "3", name: '任务3', x: 10, y: 30,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {
          id: "4", name: '任务4', x: 10, y: 40,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 0
        },
        {
          id: "5", name: '任务5', x: 10, y: 50,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 2
        },
        {
          id: "6", name: '任务6', x: 10, y: 60,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 2
        },
        {
          id: "7", name: '任务7', x: 10, y: 70,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {
          id: "8", name: '任务8', x: 10, y: 80,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {id:"9",name: '任务9', x: 40, y:55,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {id:"10",name: '任务2', x: 40, y: 20,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3
        },
        {id:"11",name: '任务1', x: 40, y: 10,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {id:"12",name: '任务4', x: 40, y: 40,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 0
        },
        {id:"13",name: '任务7', x: 40, y: 70,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3
        },
        {id:"14",name: '任务8', x: 40, y: 80,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3
        },
        {id:"15",name: '任务3', x: 40, y: 30,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {id:"16",name: '任务10', x: 70, y: 75,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 1
        },
        {id:"17",name: '任务4', x: 70, y: 40,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 2
        },
        {id:"18",name: '任务1', x: 70, y: 10,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3
        },
        {id:"19",name: '任务3', x: 70, y: 30,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3
        },
        {id:"20",name: '任务10', x: 100, y: 75,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3,
        },
        {id:"21",name: '任务9', x: 70, y: 55,
          symbol: 'rect',
          symbolSize: [100, 40],
          category: 3,
        },
      ],
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [2, 6],
      links: [
        {
          source: '9', target: '21',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '15', target: '19',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '16', target: '20',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '11', target: '18',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '5', target: '9',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '2', target: '10',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '7', target: '13',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '8', target: '14',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '12', target: '17',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '4', target: '12',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '2', target: '11',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '3', target: '15',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '1', target: '11',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '13', target: '16',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '14', target: '16',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        },
        {
          source: '6', target: '9',
          lineStyle: {
            color: 'gray',
            width: 3
          }
        }
      ],
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 5
        }
      }
    }
  ]
}
onMounted(() => {
  const chart = proxy.$echarts.init(chartRef.value);
  chart.setOption(option);
})
</script>

<template>
  <div style="padding:10px">
    <div ref="chartRef" style="width: 100%; height: 800px;">
    </div>
  </div>
</template>

<style scoped lang="less">

</style>