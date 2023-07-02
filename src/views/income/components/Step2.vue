<template>
  <div style="margin-left:20px;margin-top: 10px;"><span>当前评估企业：</span><span style="font-weight: bold;font-size: large;">{{ nodeName }}</span></div>

  <div class="search-box">
    <div class="search-container">
      <span>搜索：</span>
      <el-input v-model.trim="searchParam" placeholder="关联企业名称/关联关系" />
      <el-button :icon="Search" class="search-btn" @click="handleSearch"></el-button>
      <el-button @click="clearSearch">清空搜索</el-button>
    </div>
    <div class="add-container">
      <el-button class="add-btn" type="primary" @click="addDialogVisible = true">新增关联企业</el-button>
      <el-button class="add-btn" type="primary" @click="recoverallRelatedNodes">重置关联关系</el-button>
    </div>
  </div>

  <el-table :data="pagedRelatedNodes" style="width: 100%;height:480px" highlight-current-row :header-cell-style="{
    height: '60px',
  }" :row-style="{ height: '54px' }" class="my-table" >

    <el-table-column fixed type="index" :index="indexMethod" align="center" label="序号" width="100" />
    <el-table-column prop="id" label="企业id" align="center" width="100" />
    <el-table-column prop="name" label="企业名称" align="center" width="240" />
    <el-table-column prop="filed" label="所处领域" align="center" width="240" />
    <el-table-column prop="category" label="所处产业链" align="center" width="240" />
    <el-table-column label="关联关系" align="center" width="240">
      <template #default="scope">
        <span class="el-dropdown-link">
          <template v-for="(rel) in scope.row.relation">
            <el-tag :type="getRelationTagType(rel)" disable-transitions>
              {{ rel }}
            </el-tag>
          </template>
        </span>
      </template>
    </el-table-column>

    <el-table-column prop="tool" label="操作" align="center" width="400">
      <template #default="scope">
        <el-button type="primary" :icon="Edit" circle @click="editNode(scope.row)" />
        <el-button type="danger" :icon="Delete" circle @click="deleteNode(scope.row)" />
      </template>
    </el-table-column>
  </el-table>

  <el-pagination v-model="currentPage" :page-size="pageSize" :pager-count="8" layout="prev, pager, next"
    :total="relatedNodes.length" @current-change="handleCurrentChange" @size-change="handleSizeChange"
    style="float: right; margin: 20px;" />
  <br />
  <el-form-item>
    <el-button type="primary" @click="submitModify">
      提交
    </el-button>
  </el-form-item>

  <el-dialog v-model="editDialogVisible" title="修改关联企业" align-center>
    <el-form :model="nodeGlobal">
      <el-form-item label="" :label-width="formLabelWidth">
        企业id：{{ nodeGlobal.id }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        企业名称：{{ nodeGlobal.name }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        连接关系：
        <el-checkbox label="供应关系" v-model="nodeGlobal.relation" :true-value="'供应关系'" :false-value="''"></el-checkbox>
        <el-checkbox label="合作关系" v-model="nodeGlobal.relation" :true-value="'合作关系'" :false-value="''"></el-checkbox>
        <el-checkbox label="竞争关系" v-model="nodeGlobal.relation" :true-value="'竞争关系'" :false-value="''"></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">确认修改</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="addDialogVisible" title="新增关联企业" align-center>
    <el-form :model="nodeGlobal">
      <el-form-item label="" :label-width="formLabelWidth">
        企业id：{{ nodeGlobal.id }}
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        企业名称：
        <el-select v-model="nodeGlobal.name" @change="getSelectedId" placeholder="请选择企业">
          <el-option v-for="(option, index) in unrelatedNodes" :key="index" :label="option.name" :value="option.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="" :label-width="formLabelWidth">
        连接关系：
        <el-checkbox label="供应关系" v-model="nodeGlobal.relation" :true-value="'供应关系'" :false-value="''"></el-checkbox>
        <el-checkbox label="合作关系" v-model="nodeGlobal.relation" :true-value="'合作关系'" :false-value="''"></el-checkbox>
        <el-checkbox label="竞争关系" v-model="nodeGlobal.relation" :true-value="'竞争关系'" :false-value="''"></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addNode">确认新增</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  Search,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import jsonData from "../../../assets/income/networkRelation.json"
import { ref } from 'vue'
import { watch, nextTick, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const emits = defineEmits(['onRelationSubmit', 'onRelationModify']);  //自定义事件

//接收数据
const props = defineProps({
  relatedNodesWithGlobal: Object,
});
//选中节点信息
const nodeId = ref('')
const nodeName = ref('')
const nodeFiled = ref('')
const nodeCategory = ref('')
const nodeNetwork = ref([])
//表格信息
const relatedNodes = ref<Node[]>([]) //用于展示的关联节点（包括分页和搜索之后的展示）
const allRelatedNodes = ref<Node[]>([])//Step2中最新最全的节点（新增、修改、删除等操作之后的所有关联信息）
const initialRelatedNodes = ref<Node[]>([]) //初始节点(json文件中保存的企业关联关系)
const allNodes = ref<Node[]>([])   //json文件中所有节点
const unrelatedNodes = ref<Node[]>([])  //无关联节点（新增关联企业时用）
const initialUnrelatedNodes = ref<Node[]>([])  //无关联节点
interface Node {
  id: string,
  name: string,
  index: number,
  filed: string,
  category: string,
  network: string[],
  relation: string[],
  x: number,
  y: number,
  deleted: boolean
}
//初始化全局Node节点
let nodeGlobal = ref<Node>({
  id: '',
  name: '',
  index: -1,
  filed: '',
  category: '',
  network: [] as string[],
  relation: [] as string[],
  x: -1,
  y: -1,
  deleted: false
});

//监听数据
watch(
  () => props.relatedNodesWithGlobal,
  (newVal) => {
    nextTick(() => {
      if (newVal && newVal.nodes) {
        nodeId.value = newVal.nodes[0].id;
        nodeName.value = newVal.nodes[0].name;
        nodeFiled.value = newVal.nodes[0].filed;
        nodeCategory.value = newVal.nodes[0].category;
        nodeNetwork.value = newVal.nodes[0].network;
        //获取关联企业（将数组中的relation属性转换为字符串数组）
        relatedNodes.value = newVal.nodes.slice(1).map(node => {
          return {
            ...node,
            deleted: false,
            relation: [node.relation]
          }
        })
        allRelatedNodes.value = newVal.nodes.slice(1).map(node => {
          return {
            ...node,
            deleted: false,
            relation: [node.relation]
          }
        })
        initialRelatedNodes.value = newVal.nodes.slice(1).map(node => {
          return {
            ...node,
            deleted: false,
            relation: [node.relation]
          }
        })

        //获取未关联的节点
        allNodes.value = jsonData.nodes.map(node => {
          return {
            ...node,
            index: -1,
            relation: [] as string[],
            deleted: false
          } as Node;
        });
        unrelatedNodes.value = allNodes.value.filter(node => {
          return !newVal.nodes.some(node2 => node2.id === node.id);
        });
        initialUnrelatedNodes.value = allNodes.value.filter(node => {
          return !newVal.nodes.some(node2 => node2.id === node.id);
        });

      }

    });
  },
  { deep: true, immediate: true, flush: 'sync' }
);

//连接关系标签颜色
const getRelationTagType = (rel: string): string => {
  switch (rel) {
    case '供应关系':
      return 'warning'
    case '合作关系':
      return 'success'
    case '竞争关系':
      return 'info'
    default:
      return ''
  }
}
//数据分页和连接关系筛选
const currentPage = ref(1)         //当前页
const pageSize = ref(8)            //每页显示的数据条数
function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
}
function handleCurrentChange(newPage) {
  currentPage.value = newPage;
}
// 过滤已删除的节点
const filteredNodes = computed(() => {
  return relatedNodes.value.filter(node => node.deleted === false)
})
//分页后的数据
const pagedRelatedNodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  if (!Array.isArray(filteredNodes.value) || filteredNodes.value.length === 0) { return []; }
  return filteredNodes.value.slice(start, end);
});
//分页之后的序号
const indexMethod = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};


//1.“搜索”功能
const searchParam = ref<string>('')
const handleSearch = () => {
  if (searchParam.value === '') {
    ElMessage({
      type: 'warning',
      message: '请输入搜索内容',
    })
    return
  }
  const searchResult = allRelatedNodes.value.filter(node => {
    return node.name.includes(searchParam.value as string) || (Array.isArray(node.relation) && node.relation.some(relation => relation.includes(searchParam.value)))
  })
  if (searchResult.length === 0) {
    ElMessage({
      type: 'warning',
      message: '未找到相关企业',
    })
    return
  }
  relatedNodes.value = searchResult
  currentPage.value = 1
}
//清空搜索
function clearSearch() {
  searchParam.value = ''
  relatedNodes.value = allRelatedNodes.value
  currentPage.value = 1
}

//2.“修改关联关系”功能
const editDialogVisible = ref(false)
const formLabelWidth = '140px'
const editNode = (row: Node) => {
  editDialogVisible.value = true
  const nodeTemp: Node = {
    id: '',
    name: '',
    index: -1,
    filed: '',
    category: '',
    network: [] as string[],
    relation: [] as string[],
    x: -1,
    y: -1,
    deleted: false
  }
  nodeTemp.id = row.id
  nodeTemp.name = row.name
  if (Array.isArray(row.relation)) {
    nodeTemp.relation = row.relation;
  } else {
    nodeTemp.relation = [row.relation];
  }
  nodeGlobal.value = { ...nodeTemp } //赋值给全局变量node
}
//保存修改
function saveEdit() {
  if (nodeGlobal.value.relation.length === 0) {
    ElMessage({
      type: 'error',
      message: ' 请至少选择一个关联关系',
    })
  } else {
    //更新节点信息
    allRelatedNodes.value = allRelatedNodes.value.map(node => {
      if (node.id === nodeGlobal.value.id) {
        return {
          ...node,
          relation: nodeGlobal.value.relation
        }
      } else {
        return node
      }
    })
    //更新搜索结果列表
    relatedNodes.value = allRelatedNodes.value.filter(node => {
      return node.name.includes(searchParam.value)
    })
    //清空全局变量nodeGlobal
    Object.assign(nodeGlobal.value, {
      id: '',
      name: '',
      index: -1,
      filed: '',
      category: '',
      network: [] as string[],
      relation: [] as string[],
      x: -1,
      y: -1,
      deleted: false
    })
    editDialogVisible.value = false //关闭弹窗
  }
  emits('onRelationModify', allRelatedNodes);
}

//3.“删除关联企业”功能
const deleteNode = (row) => {
  ElMessageBox.confirm(
    '是否要删除该关联企业及所有关联关系?',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '关联企业已删除',
      })
      //删除该节点(逻辑删除)
      allRelatedNodes.value = allRelatedNodes.value.map(node => {
        if (node.id === row.id) {
          return {
            ...node,
            deleted: true
          }
        } else {
          return node
        }
      })
      //更新搜索结果列表
      relatedNodes.value = allRelatedNodes.value.filter(node => {
        return node.name.includes(searchParam.value)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
  emits('onRelationModify', allRelatedNodes);
}

//4.“新增节点”功能
const addDialogVisible = ref(false)
// 在选择新节点时，更新nodeGlobal变量的值
const getSelectedId = () => {
  const selectedNode = unrelatedNodes.value.find(node => node.id === nodeGlobal.value.name);
  if (selectedNode) {
    nodeGlobal.value.id = selectedNode.id;
  }
};
// 新增节点
const addNode = () => {
  if (!nodeGlobal.value.id) {
    ElMessage({
      type: 'error',
      message: '请选择一个关联企业',
    })
    return
  }
  if (nodeGlobal.value.relation.length === 0) {
    ElMessage({
      type: 'error',
      message: '请至少选择一个关联关系',
    })
    return
  }
  // 更新nodeGlobal的值
  const foundNode = unrelatedNodes.value.find(node => node.id === nodeGlobal.value.id)
  if (foundNode) {
    Object.assign(nodeGlobal.value, {
      name: foundNode.name,
      filed: foundNode.filed,
      category: foundNode.category,
      network: foundNode.network,
      x: foundNode.x,
      y: foundNode.y,
    })
  }
  const index = allRelatedNodes.value.length + 1
  nodeGlobal.value.index = index
  //将新增节点添加到关联企业列表中，并按照 id 的顺序排序
  allRelatedNodes.value.push({ ...nodeGlobal.value })
  allRelatedNodes.value.sort((a, b) => {
    return parseInt(a.id) - parseInt(b.id);
  });
  //更新未关联企业列表（深拷贝），并按照 id 的顺序排序
  Object.assign(unrelatedNodes.value, unrelatedNodes.value.filter(node => {
    return node.id !== nodeGlobal.value.id
  }))
  //更新搜索结果列表
  relatedNodes.value = allRelatedNodes.value.filter(node => {
    return node.name.includes(searchParam.value)
  })
  //清空全局变量nodeGlobal（清空对话框属性）
  Object.assign(nodeGlobal.value, {
    id: '',
    name: '',
    index: -1,
    filed: '',
    category: '',
    network: [] as string[],
    relation: [] as string[],
    x: -1,
    y: -1,
    deleted: false
  })
  //关闭弹窗
  ElMessage({
    type: 'success',
    message: '关联企业新增成功',
  })
  addDialogVisible.value = false
  emits('onRelationModify', allRelatedNodes);
}

// 5.初始化（重置）企业关联列表
const recoverallRelatedNodes = () => {
  //比较初始和企业关联列表的值 
  if (JSON.stringify(allRelatedNodes.value) === JSON.stringify(initialRelatedNodes.value)) {
    ElMessage({
      type: 'warning',
      message: '关联企业关系未更改，无需重置',
      duration: 1500
    })
  } else {
    allRelatedNodes.value = [...initialRelatedNodes.value];
    unrelatedNodes.value = [...initialUnrelatedNodes.value];
    //更新搜索结果列表
    relatedNodes.value = allRelatedNodes.value.filter(node => {
      return node.name.includes(searchParam.value)
    })
    ElMessage({
      type: 'success',
      message: '关联企业关系已重置',
      duration: 1500
    })
    emits('onRelationModify', allRelatedNodes);
  }

}

//6.提交关联关系
let previousSubmission = ref();
const submitModify = () => {
  if (previousSubmission && JSON.stringify(previousSubmission) === JSON.stringify(allRelatedNodes)) {
    ElMessage({
      type: 'warning',
      message: '关联关系未更改，请勿重复提交',
      duration: 1500
    })
  } else {
    previousSubmission = JSON.parse(JSON.stringify(allRelatedNodes));
    emits('onRelationSubmit', allRelatedNodes);
    ElMessage({
      type: 'success',
      message: '关联关系提交成功',
      duration: 1500
    })
  }
}


</script>
<style>
.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 500px; */
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  padding: 0 15px;
  background-color: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-label {
  margin-right: 10px;
  font-weight: bold;
}

.search-box .el-input {
  border-radius: 20px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  flex: 1;
}

.add-container {
  margin-left: 500px;
}
</style>