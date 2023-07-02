<template>
    <div class="common-layout">
      <div id="main"
           style="width: 1000px;height:400px;margin-left:100px;background-color: rgba(250,247,247,0.5)"></div>
      <div style="display: flex; justify-content: flex-end;">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['task:taskAllocation:add']"
        >新任务输入</el-button>
      </div>
      <el-dialog :title="title" v-model="open" width="500px" append-to-body>
        <el-form ref="taskAllocationRef" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="任务资源需求" prop="requirements">
            <el-input v-model="form.requirements" placeholder="请输入任务资源需求" />
          </el-form-item>
          <el-form-item label="任务预估产量" prop="products">
            <el-input v-model="form.products" placeholder="请输入任务预估产量" />
          </el-form-item>
          <el-form-item label="任务截止天数" prop="ddl">
            <el-input v-model="form.ddl" placeholder="请输入任务截止天数" />
          </el-form-item>
          <el-form-item label="任务持续时长" prop="duration">
            <el-input v-model="form.duration" placeholder="请输入任务持续天数"/>
          </el-form-item>
          <el-form-item label="任务参与企业数量" prop="number">
            <el-input v-model="form.number" placeholder="任务参与企业数量"/>
          </el-form-item>
          <el-form-item label="任务参与企业名单" prop="lists">
            <el-input v-model="form.lists" placeholder="任务参与企业名单"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
</template>
  
  
<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import jsonData from "@/assets/income/networkRelation.json"
import * as echarts from 'echarts'
import axios from "axios";  //引入echarts
const open = ref(false);
const title = ref("");
const { proxy } = getCurrentInstance();
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    requirements: null,
    products: null,
    ddl: null,
    duration: null,
    number: null,
    lists:null
  },
  rules: {
    name: [
      { required: true, message: "任务名称不能为空", trigger: "blur" }
    ],
    requirements: [
      { required: true, message: "任务资源需求不能为空", trigger: "change" }
    ],
    products: [
      { required: true, message: "任务预估产量不能为空", trigger: "change" }
    ],
    ddl: [
      { required: true, message: "任务截止时间不能为空", trigger: "blur" }
    ],
    duration: [
      { required: true, message: "任务持续时长不能为空", trigger: "blur" }
    ],
    number: [
      { required: true, message: "任务参与企业数量不能为空", trigger: "blur" }
    ],
    lists: [
      { required: true, message: "任务参与企业名单不能为空", trigger: "change" }
    ]
  }
});
const { queryParams, form, rules } = toRefs(data);
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加任务表 ";
}

function reset() {
  form.value = {
    id: null,
    name: null,
    requirements:null,
    products:null,
    ddl: null,
    duration: null,
    number: null,
    lists: null,
  };
  proxy.resetForm("taskAllocationRef");
}

function submitForm() {
  // proxy.$refs["taskAllocationRef"].validate(valid => {
  //   if (valid) {
  //     if (form.value.id != null) {
  //       updateTaskAllocation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("修改成功");
  //         open.value = false;
  //         getList();
  //       });
  //     } else {
  //       addTaskAllocation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("新增成功");
  //         open.value = false;
  //         getList();
  //       });
  //     }
  //   }
  // });
  proxy.$refs["taskAllocationRef"].validate(valid => {
    if(valid){
      proxy.$modal.msgSuccess("新增成功");
      open.value=false;
    }
  });
}

function cancel() {
  open.value = false;
  reset();
}
//定义组件的自定义事件
let myChart = null;
onMounted(async () => {
  const chartDom = document.getElementById('main');
  myChart = echarts.init(chartDom);
  const response = await axios.get('/src/assets/dataFusion/task.json');
  const graph = response.data;
  //console.log(graph)
  const containerWidth = document.getElementById('main').clientWidth;// 图形容器的宽度
  const containerHeight = document.getElementById('main').clientHeight;// 图形容器的高度

  //计算polygon的相对坐标点
  function calculatePoints(points) {
    const widthRatio = containerWidth / 800; // 宽度比例
    const heightRatio = containerHeight / 500; // 高度比例
    return points.map(point => [point[0] * widthRatio, point[1] * heightRatio]);
  }

  // 计算节点的相对位置
  graph.nodes.forEach(node => {
    node.x = node.x / 800 * containerWidth;
    node.y = node.y / 500 * containerHeight;
  });

  //绘制ECharts关系图
  myChart.setOption({
    graphic: [
      {
        type: 'group',
        position: [100, 70], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, -10], [650, -10], [600, 110], [-50, 110]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'red',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [-50, 70], // 相对于 group 左上角位置的偏移量
            style: {
              text: '汽车产业链', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [100, 190], // 左上角位置，根据需要进行调整
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[-10, -40], [650, -40], [615, 50], [-50, 50]])  // 左上、右上、右下、左下
            },
            style: {
              fill: '#eee',
              stroke: 'black',
              lineWidth: 3,
              opacity: 0.3,
            }
          },
          {
            type: 'text',
            position: [-50, 25], // 相对于 group 左上角位置的偏移量
            style: {
              text: '虚拟共有层', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      },

      {
        type: 'group',
        position: [50, 310], // 左上角位置
        children: [
          {
            type: 'polygon',
            shape: {
              points: calculatePoints([[0, 30], [650, 30], [700, -100], [55, -100]])  // 左下、右下、右上、左上
            },
            style: {
              fill: '#eee',
              stroke: 'blue',
              lineWidth: 3,
              opacity: 0.3,
              shadowBlur: 10,
              shadowColor: 'gray',
              shadowOffsetX: 5,
              shadowOffsetY: 5
            }
          },
          {
            type: 'text',
            position: [15, 5], // 相对于 group 左上角位置的偏移量
            style: {
              text: '家电产业链', // 你要显示的文字
              fill: 'black', // 文字颜色
              fontSize: 14 // 文字大小
            }
          }
        ]
      }
    ],

    title: {
      text: '多重产业链任务结构模型',
      // subtext: '这是一个副标题',
      top: 'bottom',
      left: 'center'
    },


    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function (params) {
        // console.log(params)
        if (params.dataType === 'node') {

          var id = params.data.id;
          var name = params.data.name;
          var requirements = params.data.requirements;
          var products = params.data.products;
          var deadline = params.data.deadline;
          var lastTime = params.data.lastTime;
          var numbers = params.data.numbers;
          var lists = params.data.lists;
          return "id: " + id + '<br/>' + "任务名称：" + name + '<br/>' + "资源需求：" + requirements + '<br/>' + "预期产量：" + products + '<br/>' + "截止时间：" + deadline + '<br/>' + "预估耗时：" + lastTime + '<br/>' + "参与企业数量：" + numbers + '<br/>' + "参与企业名单：" + lists;
        }

      }
    },
    animationDuration: 1500, //初始动画的时长
    animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
    series: [{
      type: 'graph',
      layout: 'none',
      data: graph.nodes,
      links: graph.links,
      //categories: graph.categories,
      //network: graph.network,
      roam: true,     //开启鼠标缩放和平移漫游

      // 设置节点样式
      itemStyle: {
        // 指定节点的默认样式
        normal: {
          color: '#61a0a8',  // 节点的默认颜色
        },
        // 指定节点的高亮样式
        emphasis: {
          color: '#c23531',  // 节点的高亮颜色
        },
      },

      label: {
        show: false,     //是否显示节点标签
        // position: 'right',  //节点标签的位置
        formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
      },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [4, 6],
      lineStyle: {
        color: 'source',
        curveness: 0.2,
        width: 2,
        type: 'solid',
        arrow: {
          show: true,
          size: 6,
          offset: 0,
          symbol: 'arrow',
          symbolSize: [6, 12]
        }
      },

      emphasis: {
        focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
        lineStyle: {    //边的设置
          width: 10,
          type: "dotted",
          opacity: 0.7,
        }
      },
    }]


  });

  myChart.on('click', params => {
    // if (params.componentType === 'polygon') {
    //     const nodes = myChart.getOption().series[0].data;
    //     const nodesInPolygon = nodes.filter(node => {
    //         const point = myChart.convertToPixel('grid', [node.x, node.y]);
    //         return myChart.graphic.isPointInGraphic(params.componentIndex, point);
    //     });
    //     const selectedNodes = nodesInPolygon.map(node => node.name);
    //     myChart.dispatchAction({
    //         type: 'highlight',
    //         seriesIndex: 0,
    //         name: selectedNodes
    //     });
    // }
    if (params.dataType == "node") {
      taskData.name = params.data.name;
      taskData.requirements = params.data.requirements;
      taskData.products = params.data.products;
      taskData.deadline = params.data.deadline;
      taskData.lastTime = params.data.lastTime;
      taskData.numbers = params.data.numbers;
      taskData.lists = params.data.lists;
      //console.log(params.data.name)
    }
  });

  myChart.on('mousedown', params => {
    if (params.event.target.tagName === 'CANVAS') {
      const startPoint = myChart.convertFromPixel('grid', [params.event.offsetX, params.event.offsetY]);
      let rect = null;

      const mousemoveHandler = e => {
        const curPoint = myChart.convertFromPixel('grid', [e.offsetX, e.offsetY]);
        const minX = Math.min(startPoint[0], curPoint[0]);
        const maxX = Math.max(startPoint[0], curPoint[0]);
        const minY = Math.min(startPoint[1], curPoint[1]);
        const maxY = Math.max(startPoint[1], curPoint[1]);

        if (!rect) {
          rect = myChart.graphic.add({
            type: 'rect',
            shape: {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            },
            style: {
              fill: 'rgba(255, 255, 255, 0.3)',
              stroke: '#666',
              lineWidth: 2
            }
          });
        } else {
          rect.setShape({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
          });
        }

        const nodes = myChart.getOption().series[0].data;
        const nodesInRect = nodes.filter(node => {
          const point = myChart.convertToPixel('grid', [node.x, node.y]);
          return myChart.graphic.isPointInGraphic(rect, point);
        });
        const selectedNodes = nodesInRect.map(node => node.name);
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          name: selectedNodes
        });
      };

      const mouseupHandler = () => {
        myChart.off('mousemove', mousemoveHandler);
        myChart.off('mouseup', mouseupHandler);
        if (rect) {
          myChart.graphic.remove(rect);
        }
      };

      myChart.on('mousemove', mousemoveHandler);
      myChart.on('mouseup', mouseupHandler);
    }
  });


});
// 初始化ECharts实例


</script>

<style>
.header-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex-container {
    display: flex;
    align-items: center;
}

.header-text {
    margin-right: 10px;
    font-weight: bold
}

.my-table {
    border: 1px solid #ebeef5;
    border-radius: 4px;
}
</style>