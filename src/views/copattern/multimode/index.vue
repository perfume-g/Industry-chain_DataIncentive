<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!-- 第一部分，占界面的上半部分 -->
        <el-card class="card" style="width: 1000px; height: 600px;">
            <template #header><span>任务迁移图示</span></template>
      <div class="top-section"> 
      <div class="chart-container" style="margin-right: 20px;" >
        <!-- 第一个图表 -->

        <div ref="taskLinkageInfo" style="width:100%; height: 350px; "/>
      </div>
      <div class="chart-container" style="margin-left: 20px;" v-show="showRightSection">
        <!-- 第二个图表 -->

        <div ref="taskLinkageInfo1" style="width:480px; height: 350px" />
      </div>
    </div>
    <div class="bottom-section">
      <el-button type="primary" @click="showRightSection = !showRightSection">{{ showRightSection ? '隐藏关系图' : '任务迁移' }}</el-button>
    </div>
    </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script setup name="Model">
import * as echarts from "echarts";
import { onMounted } from 'vue';
import { ref } from 'vue'


const onSubmit = () => {
  console.log('submit!')
}
const taskLinkageInfo = ref(null);
var taskLinkageInfoIntance;
const taskLinkageInfo1 = ref(null);
var taskLinkageInfoIntance1;

const showLeftSection = ref(false);
const showRightSection = ref(false);


onMounted(() => {
  taskLinkageInfoIntance = echarts.init(taskLinkageInfo.value);
  taskLinkageInfoIntance.setOption(option2);

  taskLinkageInfoIntance1 = echarts.init(taskLinkageInfo1.value);
  taskLinkageInfoIntance1.setOption(option3);
    });

    


// 指定图表的配置项和数据
var option2 = {
  title: {
    text: '展示当前执行的任务之间的关系'
  },
  tooltip: {},
  animationDurationUpdate: 50,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 35,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [1, 5],
      edgeLabel: {
        fontSize: 10
      },
      data: [
        {
          name: '任务 1',
          x: 20,
          y: 20,
          tooltip: {
            show: true,
            trigger: 'item',
      formatter: function(params) {
    return '节点信息：任务 1---橡胶';
  }
    }
        },
        {
          name: '任务 2',
          x: 35,
          y: 20,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter:function(params) {
    return  '节点信息：任务 2---塑料';
          }
        }
        },
        {
          name: '任务 3',
          x: 45,
          y: 10,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter:function(params) {
    return  '节点信息：任务 3---轮胎';
          }
        }
        },
        {
          name: '任务 4',
          x: 35,
          y: 30,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 4---密封';
          }
          }
        },
        {
          name: '任务 5',
          x: 45,
          y: 35,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 5---螺丝';
          }
          }
        },
        {
          name: '任务 6',
          x: 50,
          y: 20,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 6---螺母';
          }
          }
        },
        {
          name: '任务 7',
          x: 20,
          y: 30,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 7---链条';
          }
          }
        },
        {
          name: '任务 8',
          x: 60,
          y: 10,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter:function(params) {
    return  '节点信息：任务 8---铰链';
          }
          }
        },
        {
          name: '任务 9',
          x: 60,
          y: 30,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter:function(params) {
    return  '节点信息：任务 9---中控台';
          }
          }
        },
        {
          name: '任务 10',
          x: 60,
          y: 40,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 10---垫片';
          }
          }
        },
        {
          name: '任务 11',
          x: 35,
          y: 40,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter:function(params) {
    return  '节点信息：任务 11---固化剂';
          }
          }
        },
        {
          name: '任务 12',
          x: 70,
          y: 20,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 12---封蜡';
          }
          }
        },
        {
          name: '任务 13',
          x: 70,
          y: 60,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 13---毛毡';
          }
          }
        },
        {
          name: '任务 14',
          x: 70,
          y: 35,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 14---皮革';
          }
          }
        },
        {
          name: '任务 15',
          x: 50,
          y: 50,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 15---油漆';
          }
          }
        },
        {
          name: '任务 16',
          x: 20,
          y: 45,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 16---热固胶';
          }
          }
        },
        {
          name: '任务 17',
          x: 80,
          y: 40,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 17---支架';
          }
          }
        },
        {
          name: '任务 18',
          x: 80,
          y: 10,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter: function(params) {
    return '节点信息：任务 18---箱盖';
          }
          }
        },
        {
          name: '任务 19',
          x: 90,
          y: 30,
          tooltip: {
            show: true,
            trigger: 'item',
          formatter:function(params) {
    return  '节点信息：任务 19---纺布';
          }
          }
        },

      ],
      // links: [],
      links: [

{
  source: '任务 2',
  target: '任务 1',

  lineStyle: {
    curveness: 0.2
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 3',
  target: '任务 4',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 1',
  target: '任务 3',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 2',
  target: '任务 3',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 2',
  target: '任务 4',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 1',
  target: '任务 4',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 3',
  target: '任务 5',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 6',
  target: '任务 4',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 5',
  target: '任务 10',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 8',
  target: '任务 10',
  lineStyle: {
    curveness: 0.2,
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 12',
  target: '任务 14',
  lineStyle: {
    curveness: 0.2,
    color: ''
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 11',
  target: '任务 15',
  lineStyle: {
    curveness: 0.2
  },
},
{
  source: '任务 13',
  target: '任务 17',
  lineStyle: {
    curveness: 0.2
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 18',
  target: '任务 16',
  lineStyle: {
    curveness: 0.2
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 16',
  target: '任务 19',
  lineStyle: {
    curveness: 0.2
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
}
},
{
  source: '任务 7',
  target: '任务 16',
  lineStyle: {
    curveness: 0.2
  },
  tooltip: {
formatter: '连线信息：任务 2 -> 任务 1'
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

var option3 = {
  title: {
    text: '任务迁移后执行的任务之间的关系'
  },
  tooltip: {},
  animationDurationUpdate: 50,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      type: 'graph',
      layout: 'none',
      symbolSize: 35,
      roam: true,
      label: {
        show: true
      },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [1, 5],
      edgeLabel: {
        fontSize: 10
      },
      data: [
        {
          name: '任务 1',
          x: 20,
          y: 20,
          itemStyle: {
          color: '#e6ccff',
          },
          tooltip: {
      formatter: '节点信息：任务 1---橡胶 \n 企业群：山东矿业'
    }
 // 红色
        },
        {
          name: '任务 2',
          x: 35,
          y: 20,
          itemStyle: {
          color: '#e6ccff',
          },
          tooltip: {
          formatter: '节点信息：任务 2---塑料 \n 企业群：山东矿业'
          }
 // 红色
        },
        {
          name: '任务 3',
          x: 45,
          y: 10,
          itemStyle: {
          color: '#e6ccff',
          },
          tooltip: {
          formatter: '节点信息：任务 3---轮胎 \n 企业群：山东矿业'
          }
 // 红色
        },
        {
          name: '任务 4',
          x: 35,
          y: 30,
          itemStyle: {
          color: '#e6ccff',
          },
          tooltip: {
          formatter: '节点信息：任务 4---密封 \n 企业群：山东矿业'
          }
 // 红色
        },
        {
          name: '任务 5',
          x: 45,
          y: 35,
          itemStyle: {
          color: '#e6ccff',
          },
          tooltip: {
          formatter: '节点信息：任务 5---螺丝 \n 企业群：山东矿业'
          }
 // 红色
        },
        {
          name: '任务 6',
          x: 50,
          y: 20,
          itemStyle: {
          color: '#ccffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 6---螺母 \n 企业群：江苏金融'
          }
 // 绿色
        },
        {
          name: '任务 7',
          x: 20,
          y: 30,
          itemStyle: {
          color: '#ccffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 7---链条 \n 企业群：江苏金融'
          }
 // 绿色
        },
        {
          name: '任务 8',
          x: 60,
          y: 10,
          itemStyle: {
          color: '#ccffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 8---铰链 \n 企业群：江苏金融'
          }
 // 绿色
        },
        {
          name: '任务 9',
          x: 60,
          y: 30,
          itemStyle: {
          color: '#ccffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 9---中控台 \n 企业群：江苏金融'
          }
 // 绿色
        },
        {
          name: '任务 10',
          x: 60,
          y: 40,
          itemStyle: {
          color: '#ccffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 10---垫片 \n 企业群：江苏金融'
          }
 // 绿色
        },
        {
          name: '任务 11',
          x: 35,
          y: 40,
          itemStyle: {
          color: '#ffffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 11---固化剂 \n 企业群：河北工业'
          }
 // 黄色
        },
        {
          name: '任务 12',
          x: 70,
          y: 20,
          itemStyle: {
          color: '#ffffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 12---封蜡 \n 企业群：河北工业'
          }
 // 黄色
        },
        {
          name: '任务 13',
          x: 70,
          y: 60,
          itemStyle: {
          color: '#ffffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 13---毛毡 \n 企业群：河北工业'
          }
 // 黄色
        },
        {
          name: '任务 14',
          x: 70,
          y: 35,
          itemStyle: {
          color: '#ffffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 14---皮革 \n 企业群：河北工业'
          }
 // 黄色
        },
        {
          name: '任务 15',
          x: 50,
          y: 50,
          itemStyle: {
          color: '#ffffcc',
          },
          tooltip: {
          formatter: '节点信息：任务 15---油漆 \n 企业群：河北工业'
          }
 // 黄色
        },
        {
          name: '任务 16',
          x: 20,
          y: 45,
          itemStyle: {
          color: '#ccf5ff',
          },
          tooltip: {
          formatter: '节点信息：任务 16---热固胶 \n 企业群：浙江加工'
          }
        },
        {
          name: '任务 17',
          x: 80,
          y: 40,
          itemStyle: {
          color: '#ccf5ff',
          },
          tooltip: {
          formatter: '节点信息：任务 17---支架 \n 企业群：浙江加工'
          }
        },
        {
          name: '任务 18',
          x: 80,
          y: 10,
          itemStyle: {
          color: '#ccf5ff',
          },
          tooltip: {
          formatter: '节点信息：任务 18---箱盖 \n 企业群：浙江加工'
          }
        },
        {
          name: '任务 19',
          x: 90,
          y: 30,
          itemStyle: {
          color: '#ccf5ff',
          },
          tooltip: {
          formatter: '节点信息：任务 19---纺布 \n 企业群：浙江加工'
          }
        },

      ],
      // links: [],
      links: [

        {
          source: '任务 2',
          target: '任务 1',

          lineStyle: {
            curveness: 0.2,
            color: 'red'
          },
          tooltip: {
      formatter: '连线信息：任务 2 -> 任务 1 \n 跨企业跨链跨群'
    }
        },
        {
          source: '任务 3',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2,
            color: 'green'
          },
          tooltip: {
      formatter: '连线信息：任务 2 -> 任务 1 \n 跨企业跨链'
    }
        },
        {
          source: '任务 1',
          target: '任务 3',
          lineStyle: {
            curveness: 0.2,
            color: 'blue'
          },
          tooltip: {
      formatter: '连线信息：任务 3 -> 任务 1 \n 跨企业跨群'
    }
        },
        {
          source: '任务 2',
          target: '任务 3',
          lineStyle: {
            curveness: 0.2,
            color: 'gray'
          },
          tooltip: {
      formatter: '连线信息：任务 2 -> 任务 3 \n 跨链跨群'
    }
        },
        {
          source: '任务 2',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2,
            color: 'yellow'
          },
          tooltip: {
      formatter: '连线信息：任务 2 -> 任务 4  \n 跨企业'
    }

        },
        {
          source: '任务 1',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2,
            color: 'purple'
          },
          tooltip: {
      formatter: '连线信息：任务 1 -> 任务 4 \n 跨链'
    }

        },
        {
          source: '任务 3',
          target: '任务 5',
          lineStyle: {
            curveness: 0.2,
            color: 'orange'
          },
          tooltip: {
      formatter: '连线信息：任务 3 -> 任务 5  \n 跨群'
    }

        },
        {
          source: '任务 6',
          target: '任务 4',
          lineStyle: {
            curveness: 0.2,
            color: 'orange'
          },
          tooltip: {
      formatter: '连线信息：任务 6 -> 任务 4 \n 跨群'
    }

        },
        {
          source: '任务 5',
          target: '任务 10',
          lineStyle: {
            curveness: 0.2,
            color: 'purple'
          },
          tooltip: {
      formatter: '连线信息：任务 5 -> 任务 10  \n 跨链'
    }

        },
        {
          source: '任务 8',
          target: '任务 10',
          lineStyle: {
            curveness: 0.2,
            color: 'yellow'
          },
          tooltip: {
      formatter: '连线信息：任务 8 -> 任务 10  \n 跨企业'
    }

        },
        {
          source: '任务 12',
          target: '任务 14',
          lineStyle: {
            curveness: 0.2,
            color: 'gray'
          },
          tooltip: {
      formatter: '连线信息：任务 12 -> 任务 14  \n 跨链跨群'
    }

        },
        {
          source: '任务 11',
          target: '任务 15',
          lineStyle: {
            curveness: 0.2,
            color: 'blue'
          },
          tooltip: {
      formatter: '连线信息：任务 11 -> 任务 15 \n 跨企业跨群'
    }

        },
        {
          source: '任务 13',
          target: '任务 17',
          lineStyle: {
            curveness: 0.2,
            color: 'green'
          },
          tooltip: {
      formatter: '连线信息：任务 13 -> 任务 17 \n 跨企业跨链'
    }

        },
        {
          source: '任务 18',
          target: '任务 16',
          lineStyle: {
            curveness: 0.2,
            color: 'red'
          },
          tooltip: {
      formatter: '连线信息：任务 18 -> 任务 16 \n 跨企业跨链跨群'
    }

        },
        {
          source: '任务 16',
          target: '任务 19',
          lineStyle: {
            curveness: 0.2,
            color: 'red'
          },
          tooltip: {
      formatter: '连线信息：任务 16 -> 任务 19 \n 跨企业跨链跨群'
    }

        },
        {
          source: '任务 7',
          target: '任务 16',
          lineStyle: {
            curveness: 0.2,
            color: 'green'
          },
          tooltip: {
      formatter: '连线信息：任务 7 -> 任务 16 \n 跨企业跨链'
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
// nextTick(() => {
// //getCache().then(() => {
//   taskLinkageInfoIntance = echarts.init(taskLinkageInfo.value, "macarons");
//   taskLinkageInfoIntance.setOption(option2);
// });

onMounted(() => {
  taskLinkageInfoIntance = echarts.init(taskLinkageInfo.value, "macarons");
  taskLinkageInfoIntance.setOption(option2);
  taskLinkageInfoIntance1 = echarts.init(taskLinkageInfo1.value, "macarons");
  taskLinkageInfoIntance1.setOption(option3);
    });


    // const handleTaskMigration = () => {
    //   showLeftSection.value = !showLeftSection.value;
    //   showRightSection.value = !showRightSection.value;
    // };

</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.chart-container {
    width: 50%;
    display: inline-block;
    vertical-align: top;
}

.top-section {
  display: flex;
  justify-content: space-between;
  height: 50%;
}

.chart-container {
  width: 50%;
  border-right: 1px solid #ccc;
}

.bottom-section {
  display: flex;
  height: 50%;
  justify-content: center;
  align-items: center;
  margin-top: 40px;

}

.left-container {
  width: 25%;
}

.right-container {
  width: 75%;
}
.slider-demo-block {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.slider-demo-block .demonstration+.el-slider {
  flex: 0 0 70%;
}

.slider-labels {
  display: block;
  text-align: center;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 14px;
  color: #606266;
  margin-top: 10px;
}

.slider-demo-block {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.slider-block {
  width: 100%;
}


.el-slider__runway {
  width: 50%;
}

.blank-space {
  margin-top: 10px;
}
</style>
