<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header-container">
                <div class="flex-container">
                    <span class="header-text">评估企业：</span>
                    <el-select v-model="selectedNode" class="m-2" placeholder="请选择企业" size="large" filterable>
                        <el-option v-for="item in nodeData" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </div>
            </el-header>
            <el-container>
                <el-main>
                    <span class="content-text">企业关系图：</span>
                    <div ref="relationGraph" style="height:550px;width:500px"></div>
                </el-main>
                <el-main>
                    <div style="margin-bottom: 15px;"><span class="content-text">关联企业：</span></div>
                    <el-table :data="pagedFilteredNodes" style="width: 800px;height:500px" highlight-current-row
                        :header-cell-style="{height: '60px',}" :row-style="{ textAlign: 'center', height: '54px', }" class="my-table">
                        <el-table-column fixed type="index" :index="indexMethod" label="序号" width="100" />
                        <el-table-column prop="id" label="企业id" width="100" />
                        <el-table-column prop="name" label="企业名称" width="150" />
                        <el-table-column prop="filed" label="所处领域" width="150" />
                        <el-table-column prop="category" label="所处产业链" width="150" />
                        <el-table-column prop="relation" label="关联关系" width="150" :filters="[
                            { text: '供应关系', value: '供应关系' },
                            { text: '合作关系', value: '合作关系' },
                            { text: '竞争关系', value: '竞争关系' },
                        ]" :filter-method="(value, row) => filterTag(value, row, relatedNodesWithout)"
                            filter-placement="bottom-end">
                            <template #default="scope">
                                <el-dropdown trigger="click" placement="bottom-end">
                                    <span class="el-dropdown-link">
                                        <el-tag
                                            :type="scope.row.relation === '供应关系' ? 'warning' : (scope.row.relation === '合作关系' ? 'success' : 'info')"
                                            disable-transitions>
                                            {{ scope.row.relation }}
                                        </el-tag>
                                        <i class="el-icon-arrow-down" el-icon--right></i>
                                    </span>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                        <el-table-column prop="infomation" label="企业信息" width="120">
                            <template #default="scope">
                                <el-button link type="primary" @click="handleInfo(scope.row)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="11" layout="prev, pager, next"
                        :total="relatedNodesWithout.length" @current-change="handleCurrentChange"
                        @size-change="handleSizeChange" />

                    <el-dialog v-model="infoDialogVisible" title="企业详情" align-center>
                        <el-form :model="info">
                            <el-form-item label="" :label-width="formLabelWidth">
                                企业id：{{ info.id }}
                            </el-form-item>
                            <el-form-item label="" :label-width="formLabelWidth">
                                企业名称：{{ info.name }}
                            </el-form-item>
                            <el-form-item label="" :label-width="formLabelWidth">
                                企业所处领域：{{ info.filed }}
                            </el-form-item>
                            <el-form-item label="" :label-width="formLabelWidth">
                                企业所处产业链：{{ info.category }}
                            </el-form-item>
                            <el-form-item label="" :label-width="formLabelWidth">
                                关联关系：{{ info.relation }}
                            </el-form-item>
                        </el-form>
                    </el-dialog>

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
  
<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import jsonData from "../../../assets/income/networkRelation.json"
import * as echarts from 'echarts'  //引入echarts

//定义组件的自定义事件
const emits = defineEmits(['onNodeSelected']);
// 初始化ECharts实例
const myChart = ref(null);
const relationGraph = ref(null);
onMounted(() => {
    relationGraph.value && (myChart.value = echarts.init(relationGraph.value))
});

// 读取json数据并将其存储到nodeData数组和linkData数组中
const nodeData = reactive([]);
const linkData = reactive([]);
for (const node of jsonData.nodes) {
    nodeData.push({
        id: node.id,
        name: node.name,
        filed: node.filed,
        category: node.category,
        network: node.network,
        x: node.x,
        y: node.y
    });
}
for (const link of jsonData.links) {
    linkData.push({
        source: link.source,
        target: link.target,
        relation: link.label.formatter,
    });
}

// 计算与所选节点相关的所有节点信息和连接信息
const selectedNode = ref(""); //用户选择的节点
const relatedNodesWithout = ref([]); //没有加上选中节点（用于表格）
const relatedNodesWith = ref([]); //加上了选中节点（用于画图）
const relatedNodeIds = new Set();
// const filteredNodes = ref([]); //筛选后的节点
//获取关系图信息（存入graph）
const graph = {
    id: '',
    name: '',
    filed: '',
    category: '',
    network: '',
    nodes: [],
    links: [],
};
//获取表格信息（存入relate）
const relate = {
    nodes: [],
}
//监听用户选择的节点
watch([selectedNode], () => {
    if (!selectedNode.value) {
        relatedNodes.value = [];
        return;
    }
    // 获取与所选节点相关的所有连接
    const relatedLinks = linkData.filter(
        (link) => link.source === selectedNode.value || link.target === selectedNode.value
    );
    relatedNodeIds.clear();
    for (const link of relatedLinks) {
        relatedNodeIds.add(link.source);
        relatedNodeIds.add(link.target);
    }
    let tempRelatedNodes1 = nodeData.filter((node) => relatedNodeIds.has(node.id) && node.id !== selectedNode.value); //没有加上选中节点
    let tempRelatedNodes2 = [// 加上选中节点自身
        nodeData.find(n => n.id === selectedNode.value)
    ].concat(
        nodeData.filter((node) => {
            return relatedNodeIds.has(node.id) && node.id !== selectedNode.value
        })
    )
    // 将相关连接信息添加到相关节点信息中，并添加序号
    tempRelatedNodes1.forEach((node, index) => {
        node.relation = relatedLinks
            .filter((link) => link.source === node.id || link.target === node.id)
            .map((link) => link.relation)
            .join(",");
        node.index = index + 1;
    });
    tempRelatedNodes2.forEach((node, index) => {
        node.relation = relatedLinks
            .filter((link) => link.source === node.id || link.target === node.id)
            .map((link) => link.relation)
            .join(",");
        node.index = index + 1;
    });
    relatedNodesWithout.value = tempRelatedNodes1;
    relatedNodesWith.value = tempRelatedNodes2;
    // filteredNodes.value = tempRelatedNodes1;   //筛选节点


    //清空relate
    relate.nodes = []
    for (const node of relatedNodesWith.value) {
        relate.nodes.push(node);
    }
    //清空graph
    graph.id = ''
    graph.name = ''
    graph.filed = ''
    graph.category = ''
    graph.network = ''
    graph.nodes = []
    graph.links = []
    // 存数据(传给后续步骤)
    const selectedNodeInfo = computed(() => {
        const node = nodeData.find((node) => node.id === selectedNode.value);
        return node ? { id: node.id, name: node.name, filed: node.filed, category: node.category, network: node.network }
            : { id: '', name: '', filed: '', category: '', network: '' };
    });
    //选中节点的信息
    graph.id = selectedNodeInfo.value.id
    graph.name = selectedNodeInfo.value.name
    graph.filed = selectedNodeInfo.value.filed
    graph.category = selectedNodeInfo.value.category
    graph.network = selectedNodeInfo.value.network
    //关联节点和连接信息
    for (const node of relatedNodesWith.value) {
        let type;
        if (node.id === selectedNode.value) {
            type = 0  // 选中节点为0
        } else {
            type = 1 // 其他节点为1
        }
        graph.nodes.push({
            id: node.id,
            name: node.name,
            symbolSize: 25,
            x: node.x,
            y: node.y,
            type
        });
    }
    for (const link of linkData) {
        if (relatedNodeIds.has(link.source) && relatedNodeIds.has(link.target)) {
            graph.links.push({
                source: link.source,
                target: link.target,
                label: {
                    show: true,
                    formatter: link.relation, // 可以设置连接的标签
                },
            });
        }
    }

    //绘制关系图
    const option = {
        animationDuration: 1000, //初始动画的时长
        animationEasingUpdate: 'quinticInOut', //节点和边的动画方式（缓动函数）
        series: [
            {
                type: 'graph',
                layout: 'none', // 可以设置布局方式
                data: graph.nodes, // 节点数据数组
                links: graph.links, // 关系数据数组
                roam: true,     //开启鼠标缩放和平移漫游
                left: 'center',
                top: 'center',

                itemStyle: {//设置节点颜色
                    normal: {
                        color: function (params) {
                            if (params.data.type === 0) return "Crimson";
                            else return "RoyalBlue";
                        },
                    },
                },
                label: {
                    show: true,     //是否显示节点标签
                    formatter: '{b}'  //节点标签的内容格式器，a 代表系列名，b 代表数据名，c 代表数据值。
                },
                lineStyle: {
                    normal: {
                        color: 'slateblue',    //边的颜色是由源节点决定的
                        curveness: 0.2  //边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                    }
                },
                emphasis: {
                    focus: 'adjacency', //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点，'adjacency' 表示只突出显示节点以及节点的边
                    lineStyle: {    //边的设置
                        width: 10,
                        type: "dotted",
                        opacity: 0.7
                    }
                },
            },
        ],
    };
    nextTick(() => {
        myChart.value.setOption(option)
    })

    // 将节点信息和连接信息直接同步传递给父组件
    emits('onGraph', graph)
    emits('onRelatedNodesWith', relate)
}, { deep: true });


//数据分页和连接关系筛选
const currentPage = ref(1)         //当前页
const pageSize = ref(8)           //每页显示的数据条数
const filterValue = ref([]);       //用户想筛选的关系
function handleSizeChange(size) {
    pageSize.value = size;
    currentPage.value = 1;
}
function handleCurrentChange(newPage) {
    currentPage.value = newPage;
}
//分页之后数据的序号
const indexMethod = (index) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
};



// 筛选器
function filterTag(value, row) {
    const filterValues = Array.isArray(value) ? value : [value];
    return filterValues.some(filterValue => row.relation.includes(filterValue));
}
//筛选后的数据
const filteredNodes = computed(() => {
    if (!Array.isArray(filterValue.value) || filterValue.value.length === 0) {
        return relatedNodesWithout.value;
    }
    const nodes = relatedNodesWithout.value.filter((node) => {
        return filterValue.value.every((filter) => {
            return node.relation.indexOf(filter) !== -1;
        });
    });
    return nodes;
});
//分页后的数据
const pagedFilteredNodes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    if (!Array.isArray(filteredNodes.value) || filteredNodes.value.length === 0) { return []; }
    return filteredNodes.value.slice(start, end);
});


//"查看详情"功能
const infoDialogVisible = ref(false)
const formLabelWidth = '140px'
let info = ref({
    id: '',
    name: '',
    index: -1,
    filed: '',
    category: '',
    network: [],
    relation: [],
    x: -1,
    y: -1,
    deleted: false
});
const handleInfo = (row) => {
    infoDialogVisible.value = true
    info.value = row
}


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

.content-text {
    margin-right: 10px;
    margin-bottom: 10px;
    font-weight: bold
}


.my-table {
    border: 1px solid #ebeef5;
    border-radius: 4px;
}
</style>