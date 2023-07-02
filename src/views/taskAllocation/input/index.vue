<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="任务名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务类型 " prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择任务类型 " clearable>
          <el-option
            v-for="dict in task_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务截止日期" prop="ddl">
        <el-date-picker clearable
          v-model="queryParams.ddl"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择任务截止日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="任务持续时长" prop="duration">
        <el-input
          v-model="queryParams.duration"
          placeholder="请输入任务持续时长"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态 " prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择任务状态 " clearable>
          <el-option
            v-for="dict in task_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务价值" prop="value">
        <el-input
          v-model="queryParams.value"
          placeholder="请输入任务价值"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务优先级 " prop="priority">
        <el-select v-model="queryParams.priority" placeholder="请选择任务优先级 " clearable>
          <el-option
            v-for="dict in task_priority"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['task:taskAllocation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['task:taskAllocation:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['task:taskAllocation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['task:taskAllocation:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Star"
            @click="handleCoalition"
        >联盟形成</el-button>
      </el-col><el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Star"
            @click="$router.push('/allocation/detail')"
        >查看任务分配详情</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskAllocationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务编号" align="center" prop="id" />
      <el-table-column label="任务名称" align="center" prop="name" />
      <el-table-column label="任务类型 " align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="task_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="任务截止日期" align="center" prop="ddl" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.ddl, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务持续时长" align="center" prop="duration" />
      <el-table-column label="任务状态 " align="center" prop="state">
        <template #default="scope">
          <el-tag :type="scope.row.state==0?'danger':'success'">
          <dict-tag :options="task_state" :value="scope.row.state"/>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务价值" align="center" prop="value" />
      <el-table-column label="任务优先级 " align="center" prop="priority">
        <template #default="scope">
          <dict-tag :options="task_priority" :value="scope.row.priority"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['task:taskAllocation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['task:taskAllocation:remove']">删除</el-button>
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

    <!-- 添加或修改任务表 对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskAllocationRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务类型 " prop="type">
          <el-select v-model="form.type" placeholder="请选择任务类型 ">
            <el-option
              v-for="dict in task_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务截止日期" prop="ddl">
          <el-date-picker clearable
            v-model="form.ddl"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择任务截止日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务持续时长" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入任务持续时长" style="width: 80%;"/>
          <span>小时</span>
        </el-form-item>
        <el-form-item label="任务价值" prop="value">
          <el-input v-model="form.value" placeholder="请输入任务价值" style="width: 80%;"/>
          <span>万元</span>
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

<script setup name="TaskAllocation">
import { listTaskAllocation, getTaskAllocation, delTaskAllocation, addTaskAllocation, updateTaskAllocation } from "@/api/task/taskAllocation";

const { proxy } = getCurrentInstance();
const { task_state, task_type, task_priority } = proxy.useDict('task_state', 'task_type', 'task_priority');

const taskAllocationList = ref([]);
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
    type: null,
    ddl: null,
    duration: null,
    state: null,
    value: null,
    priority: null
  },
  rules: {
    name: [
      { required: true, message: "任务名称不能为空", trigger: "blur" }
    ],
    type: [
      { required: true, message: "任务类型 不能为空", trigger: "change" }
    ],
    ddl: [
      { required: true, message: "任务截止日期不能为空", trigger: "blur" }
    ],
    duration: [
      { required: true, message: "任务持续时长不能为空", trigger: "blur" }
    ],
    value: [
      { required: true, message: "任务价值不能为空", trigger: "blur" }
    ],
    priority: [
      { required: true, message: "任务优先级 不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询任务表 列表 */
function getList() {
  loading.value = true;
  listTaskAllocation(queryParams.value).then(response => {
    taskAllocationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

const handleCoalition = () => {
  taskAllocationList.value.forEach(item => {
    item.state=1;
  });
};
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
    type: null,
    ddl: null,
    duration: null,
    state: null,
    value: null,
    priority: null
  };
  proxy.resetForm("taskAllocationRef");
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
  title.value = "添加任务表 ";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getTaskAllocation(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改任务表 ";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskAllocationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTaskAllocation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTaskAllocation(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除任务表 编号为"' + _ids + '"的数据项？').then(function() {
    return delTaskAllocation(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('task/taskAllocation/export', {
    ...queryParams.value
  }, `taskAllocation_${new Date().getTime()}.xlsx`)
}

getList();
</script>
