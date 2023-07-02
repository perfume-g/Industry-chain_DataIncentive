<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="操作员姓名" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入操作员姓名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前任务编号" prop="tid">
        <el-input
            v-model="queryParams.tid"
            placeholder="请输入当前任务编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['operator:manage:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['operator:manage:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['operator:manage:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['operator:manage:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="操作员编号" align="center" prop="id" />
      <el-table-column label="操作员姓名" align="center" prop="name" />
      <el-table-column label="当前任务编号" align="center" prop="tid" />
      <el-table-column label="当前任务名称" align="center" prop="tname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['operator:manage:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['operator:manage:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改操作员表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="manageRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="操作员姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入操作员姓名" />
        </el-form-item>
        <el-form-item label="当前任务编号" prop="tid">
          <el-input v-model="form.tid" placeholder="请输入当前任务编号" />
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

<script setup name="Manage">
import { listManage, getManage, delManage, addManage, updateManage } from "@/api/operator/manage";
import { reactive} from "vue";

const { proxy } = getCurrentInstance();

const manageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    tid: null
  },
  rules: {
    name: [
      { required: true, message: "操作员姓名不能为空", trigger: "blur" }
    ],
    tid: [
      { required: true, message: "当前任务编号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);
const tasklist = reactive([
  {
    'name': '任务1',
    'amount': 100,
    'type': '生产任务',
    'priority': '高',
    'deadline': '2021-07-01',
    'duration': 10,
    'state': '已分配',
    'number': 1
  },
  {
    'name': '汽车座椅生产',
    'amount': 200,
    'type': '生产任务',
    'priority': '中',
    'deadline': '2021-07-02',
    'duration': 20,
    'state': '已分配',
    'number': 2
  },
  {
    'name': '任务1',
    'amount': 300,
    'type': '销售任务',
    'priority': '低',
    'deadline': '2021-07-03',
    'duration': 30,
    'state': '未分配',
    'number': 3
  },
  {
    'name': '汽车玻璃生产',
    'amount': 400,
    'type': '生产任务',
    'priority': '高',
    'deadline': '2021-07-04',
    'duration': 40,
    'state': '未分配',
    'number': 4
  },
  {
    'name': '购买汽车轮胎',
    'amount': 500,
    'type': '采购任务',
    'priority': '中',
    'deadline': '2021-07-05',
    'duration': 50,
    'state': '已分配',
    'number': 5
  },
  {
    'name': '购买汽车玻璃',
    'amount': 600,
    'type': '采购任务',
    'priority': '低',
    'deadline': '2021-07-06',
    'duration': 60,
    'state': '未分配',
    'number': 6
  },
  {
    'name': '生产汽车玻璃',
    'amount': 700,
    'type': '生产任务',
    'priority': '高',
    'deadline': '2021-07-07',
    'duration': 70,
    'state': '未分配',
    'number': 7
  },
  {
    'name': '生产汽车轮胎',
    'amount': 800,
    'type': '生产任务',
    'priority': '中',
    'deadline': '2021-07-08',
    'duration': 80,
    'state': '未分配',
    'number': 8
  },
  {
    'name': '销售汽车玻璃',
    'amount': 900,
    'type': '销售任务',
    'priority': '低',
    'deadline': '2021-07-09',
    'duration': 90,
    'state': '未分配',
    'number': 9
  },
  {
    'name': '生产汽车车身',
    'amount': 1000,
    'type': '生产任务',
    'priority': '高',
    'deadline': '2021-07-10',
    'duration': 100,
    'state': '未分配',
    'number': 10
  },
]);
/** 查询操作员表列表 */
function getList() {
  loading.value = true;
  listManage(queryParams.value).then(response => {
    manageList.value = response.rows;
    manageList.value.forEach(item=>{
      item.tname=tasklist.find(task=>task.number==item.tid).name
    })
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    tid: null
  };
  proxy.resetForm("manageRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加操作员表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getManage(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改操作员表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["manageRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateManage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addManage(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除操作员表编号为"' + _ids + '"的数据项？').then(function() {
    return delManage(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('operator/manage/export', {
    ...queryParams.value
  }, `manage_${new Date().getTime()}.xlsx`)
}
getList();
</script>
