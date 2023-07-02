<template>
  <div class="text-2xl">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span >已分配任务的完成进度变化图</span>
          </template>
          <div ref="taskInfo" style="width:100%; height: 350px"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :shadow="'hover'">
          <template #header>
            <span>当前任务间的关系图</span>
          </template>
          <div ref="taskLinkageInfo" style="width:100%; height: 350px"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin: 10px 0">
      <el-col :span="16">
        <el-card :shadow="'hover'">
          <template #header>
            <span>任务分配情况</span>
          </template>
          <div style="width:100%; height: 400px">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="tname" label="任务名称" width="180"/>
              <el-table-column prop="ttype" label="任务类型" width="180"/>
              <el-table-column prop="duration" label="任务工作时长"/>
              <el-table-column prop="tarrival" label="任务到来时间"/>
              <el-table-column prop="tddl" label="任务截止时间"/>
              <el-table-column prop="cid" label="任务所属联盟编号"/>
              <el-table-column label="任务所属联盟名称">
                <template #default="{row,$index}">
                  <el-link type="primary" @click="handleCoalition($index)">{{ row.cname }}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card :shadow="'hover'">
          <template #header>
            <span>任务完成情况</span>
          </template>
          <div ref="taskFinishInfo" style="width:100%; height: 400px"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {ref, onMounted, getCurrentInstance, onUnmounted} from "vue";
import {useCoalitionStore} from "@/store/modules/coalition";
import {useRouter} from "vue-router";

const coalitionStore = useCoalitionStore();
const router = useRouter();
const taskInfo = ref(null);
const {proxy} = getCurrentInstance();
const taskLinkageInfo = ref(null);
let taskFinishInfo = ref(null);
let taskInfoInstance;
let year = [
 //1到40
    1,2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,12,13,14,15,16,17,18,19,20,
    21,22,23,24,25,26,27,28,29,30,
    31,32,33,34,35,36,37,38,39,40
];
let data = [
  [431, 550, 878, 989, 351, 391, 508, 118],
  [428, 521, 868, 950, 335, 377, 506, 116],
  [422, 512, 867, 936, 316, 367, 502, 116],
  [423, 502, 867, 936, 299, 354, 478, 115],
  [411, 486, 850, 915, 300, 355, 461, 111],
  [409, 478, 837, 889, 285, 370, 458, 109],
  [405, 462, 828, 879, 271, 380, 443, 105],
  [407, 452, 801, 872, 261, 376, 430, 102],
  [400, 462, 790, 868, 253, 356, 430, 983],
  [384, 454, 790, 839, 254, 346, 420, 970],
  [372, 452, 770, 823, 259, 347, 394, 932],
  [359, 448, 770, 802, 240, 349, 394, 923],
  [357, 460, 751, 761, 230, 364, 365, 901],
  [343, 444, 735, 733, 226, 353, 363, 871],
  [331, 453, 722, 718, 225, 364, 339, 856],
  [312, 424, 717, 702, 226, 339, 325, 837],
  [307, 407, 713, 674, 220, 336, 314, 809],
  [300, 409, 686, 661, 211, 308, 312, 774],
  [298, 380, 664, 633, 192, 298, 309, 760],
  [282, 377, 657, 621, 181, 280, 289, 721],
  [279, 367, 646, 578, 178, 264, 285, 682],
  [280, 361, 645, 572, 172, 278, 278, 682],
  [276, 359, 641, 545, 171, 274, 278, 633],
  [261, 348, 629, 527, 168, 256, 263, 590],
  [258, 332, 601, 512, 156, 244, 243, 567],
  [238, 313, 601, 467, 151, 225, 237, 521],
  [227, 286, 594, 424, 137, 201, 237, 488],
  [226, 287, 571, 411, 127, 200, 210, 486],
  [230, 274, 548, 381, 120, 178, 201, 466],
  [218, 262, 541, 334, 103, 188, 187, 421],
  [205, 260, 525, 330, 93, 162, 187, 375],
  [190, 264, 502, 295, 86, 161, 186, 330],
  [190, 264, 502, 295, 86, 161, 186, 330],
  [173, 236, 473, 292, 76, 140, 159, 282],
  [162, 215, 453, 251, 68, 113, 140, 253],
  [159, 192, 444, 210, 71, 89, 134, 243],
  [140, 198, 434, 206, 64, 99, 123, 196],
  [120, 213, 420, 206, 52, 83, 108, 186],
  [119, 192, 413, 193, 47, 90, 82, 142],
  [120, 206, 392, 150, 45, 60, 80, 120],
];

const handleCoalition = (index) => {
  router.push({
    name: "coalition",
  });
  coalitionStore.setDetail( {
    cname: tableData[index].cname,
    tname: tableData[index].tname,
  })
}
//对data每个元素除以10
data = data.map(function (item) {
  return item.map(function (value) {
    return value / 10;
  });
});
let option1 = {
  tooltip: {formatter: "{b}<br/>{c}%"},
  yAxis: {
    data: [
      "销售汽车玻璃",
      "生产汽车车身",
      "生产汽车轮胎",
      "销售汽车玻璃",
      "销售电动汽车",
      "任务1",
      "汽车锂电池生产",
      "购买汽车玻璃",
    ],
    inverse: true,
  },
  xAxis: {
    axisLabel: {
      formatter: "{value}%",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  series: [
    {
      realtimeSort: true,
      name: "Agent",
      showBackground: true,
      label: {
        show: true,
        position: "right",
        valueAnimation: true,
        formatter: "{c}%",
      },
      stack: {},
      type: "bar",
    },
  ],
  animationDuration: 0,
  animationDurationUpdate: 500,
  animationEasing: "linear",
  animationEasingUpdate: "linear",
};
let option2 = {
  title: {
    text: '展示系统中的当前任务之间的关系'
  },
  tooltip: {
    trigger: 'item',
    formatter: (params)=>{
      return params.data.desc?params.data.desc:params.data.name;
    }
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 43,
      roam: false,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20
      },
      data: [
        {
          name: '任务 1',
          x: 200,
          y: 200,
          desc: '生产汽车车身'
        },
        {
          name: '任务 2',
          x: 350,
          y: 200,
          desc: '生产汽车轮胎'
        },
        {
          name: '任务 3',
          x: 450,
          y: 100,
          desc: '销售汽车玻璃'
        },
        {
          name: '任务 4',
          x: 350,
          y: 300,
          desc: '销售电动汽车'
        },
        {
          name: '任务 5',
          x: 450,
          y: 350,
          desc: '任务1'
        },
        {
          name: '任务 6',
          x: 500,
          y: 200,
          desc: '汽车锂电池生产'
        },
        {
          name: '任务 7',
          x: 200,
          y: 300,
          desc: '购买汽车玻璃'
        },
        {
          name: '任务 8',
          x: 600,
          y: 100,
          desc: '购买汽车玻璃'
        },
        {
          name: '任务 9',
          x: 600,
          y: 300,
          desc: '任务1'
        },
        {
          name: '任务 10',
          x: 600,
          y: 450,
          desc: '汽车发动机生产'
        },
        {
          name: '任务 11',
          x: 350,
          y: 400
        },
        {
          name: '任务 12',
          x: 700,
          y: 200
        },
        {
          name: '任务 13',
          x: 700,
          y: 60
        },
        {
          name: '任务 14',
          x: 700,
          y: 350
        },
        {
          name: '任务 15',
          x: 500,
          y: 500
        },
        {
          name: '任务 16',
          x: 200,
          y: 450
        },
        {
          name: '任务 17',
          x: 800,
          y: 400
        },
        {
          name: '任务 18',
          x: 800,
          y: 100
        },
        {
          name: '任务 19',
          x: 900,
          y: 300
        },

      ],
      links: [
        {
          source: '任务 2',
          target: '任务 1',

          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 3',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 1',
          target: '任务 3',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 2',
          target: '任务 3',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 2',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 1',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 3',
          target: '任务 5',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 6',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 5',
          target: '任务 10',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 8',
          target: '任务 10',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 12',
          target: '任务 14',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 11',
          target: '任务 15',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 13',
          target: '任务 17',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 18',
          target: '任务 16',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 16',
          target: '任务 19',
          lineStyle: {
            curveness: 0.2
          }
        },
        {
          source: '任务 7',
          target: '任务 16',
          lineStyle: {
            curveness: 0.2
          }
        },
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0
      }
    }
  ]
};
let option3 = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}'+'\n'+'{d}%',
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10
      },
      data: [
        {value: 30, name: '已完成任务'},
        {value: 20, name: '现存任务'},
        {value: 8, name: '已分配任务'},
        {value: 12, name: '等待执行任务'},
        {value: 4, name: '失败任务'}
      ]
    }
  ]
};
//表格数据，关于任务分配情况滴
const tableData = [
  {
    tname: '生产汽车车身',
    ttype: '生产任务',
    duration: 200,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '0',
    cname: '0号联盟'
  }, {
    tname: '汽车锂电池生产',
    ttype: '销售任务',
    duration: 150,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '2',
    cname: '2号联盟'
  }, {
    tname: '购买汽车玻璃',
    ttype: '生产任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '0',
    cname: '0号联盟'
  }, {
    tname: '生产汽车座椅',
    ttype: '生产任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '1',
    cname: '1号联盟'
  }, {
    tname: '销售汽车玻璃',
    ttype: '生产任务',
    duration: 160,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '0',
    cname: '0号联盟'
  }, {
    tname: '生产汽车轮胎',
    ttype: '采购任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '3',
    cname: '3号联盟'
  }, {
    tname: '销售电动汽车',
    ttype: '生产任务',
    duration: 180,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '0',
    cname: '0号联盟'
  }, {
    tname: '汽车锂电池生产',
    ttype: '采购任务',
    duration: 100,
    tarrival: '2021-4-5',
    tddl: '2021-5-4',
    cid: '0',
    cname: '0号联盟'
  },
]
const intervalTask = () => {
  for (let i = 0; i < data.length; i++) {
    setTimeout(function () {
      var smalloption = {
        title: {
          text:"前"+ year[data.length - i - 1].toString() + "小时任务完成率",
        },
        series: [
          {
            data: data[data.length - i - 1],
          },
        ],
      };
      taskInfoInstance.setOption(smalloption);
    }, 500 * i);
  }
}
let timer = null;
onMounted(() => {
  router.addRoute('Allocation', {
    path: "coalition",
    name: 'coalition',
    component: () => import("@/views/taskAllocation/detail/coalition/index.vue"),
    redirect:{name:'table'},
    meta: {
      title: '联盟详情',
    },
    children: [
      {
        path: 'table',
        name: 'table',
        component: () => import('@/views/taskAllocation/detail/coalition/Table.vue'),
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/taskAllocation/detail/coalition/Map.vue'),
      }
    ]
  })
  taskInfoInstance = proxy.$echarts.init(taskInfo.value);
  const taskLinkageInfoInstance = proxy.$echarts.init(taskLinkageInfo.value);
  const taskFinishInstance = proxy.$echarts.init(taskFinishInfo.value);
  taskInfoInstance.setOption(option1);
  taskFinishInstance.setOption(option3);
  intervalTask();
  timer = setInterval(intervalTask, 30000);
  taskLinkageInfoInstance.setOption(option2);
})
onUnmounted(() => {
  clearInterval(timer);
})

</script>

<style scoped lang="less">
.text-2xl
{
  font-size: 1.5rem;
}
</style>