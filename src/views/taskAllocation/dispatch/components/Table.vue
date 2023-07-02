<template>
  <el-card shadow="hover">
    <template #header>
      <h1 class="title">正在执行的任务</h1>
    </template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="128px">
        <el-form-item label="任务编号" prop="id">
          <el-input
              v-model="queryParams.id"
              placeholder="请输入任务编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
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
<!--        <el-form-item label="任务截止日期" prop="ddl">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="queryParams.ddl"-->
<!--                          type="date"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                          placeholder="请选择任务截止日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="任务持续时长" prop="duration">-->
<!--          <el-input-->
<!--              v-model="queryParams.duration"-->
<!--              placeholder="请输入任务持续时长"-->
<!--              clearable-->
<!--              @keyup.enter="handleQuery"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="任务价值" prop="value">-->
<!--          <el-input-->
<!--              v-model="queryParams.value"-->
<!--              placeholder="请输入任务价值"-->
<!--              clearable-->
<!--              @keyup.enter="handleQuery"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="任务优先级 " prop="priority">-->
<!--          <el-select v-model="queryParams.priority" placeholder="请选择任务优先级 " clearable>-->
<!--            <el-option-->
<!--                v-for="dict in task_priority"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="任务剩余时长" prop="remaining">
          <el-input
              v-model="queryParams.remaining"
              placeholder="请输入任务剩余时长"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务所属联盟编号" prop="cid">
          <el-input
              v-model="queryParams.cid"
              placeholder="请输入任务所属联盟编号"
              clearable
              @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

<!--      <el-row :gutter="10" class="mb8">-->
<!--        <el-col :span="1.5">-->
<!--          <el-button-->
<!--              type="primary"-->
<!--              plain-->
<!--              icon="Plus"-->
<!--              @click="handleAdd"-->
<!--              v-hasPermi="['ctask:manage:add']"-->
<!--          >新增</el-button>-->
<!--        </el-col>-->
<!--        <el-col :span="1.5">-->
<!--          <el-button-->
<!--              type="success"-->
<!--              plain-->
<!--              icon="Edit"-->
<!--              :disabled="single"-->
<!--              @click="handleUpdate"-->
<!--              v-hasPermi="['ctask:manage:edit']"-->
<!--          >修改</el-button>-->
<!--        </el-col>-->
<!--        <el-col :span="1.5">-->
<!--          <el-button-->
<!--              type="danger"-->
<!--              plain-->
<!--              icon="Delete"-->
<!--              :disabled="multiple"-->
<!--              @click="handleDelete"-->
<!--              v-hasPermi="['ctask:manage:remove']"-->
<!--          >删除</el-button>-->
<!--        </el-col>-->
<!--        <el-col :span="1.5">-->
<!--          <el-button-->
<!--              type="warning"-->
<!--              plain-->
<!--              icon="Download"-->
<!--              @click="handleExport"-->
<!--              v-hasPermi="['ctask:manage:export']"-->
<!--          >导出</el-button>-->
<!--        </el-col>-->
<!--        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
<!--      </el-row>-->

      <el-table v-loading="loading" :data="manageList" @selection-change="handleSelectionChange">
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
        <el-table-column label="任务价值" align="center" prop="value" />
        <el-table-column label="任务优先级 " align="center" prop="priority">
          <template #default="scope">
            <dict-tag :options="task_priority" :value="scope.row.priority"/>
          </template>
        </el-table-column>
        <el-table-column label="任务剩余时长" align="center" prop="remaining" />
        <el-table-column label="任务所属联盟编号" align="center" prop="cid" />
<!--        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--          <template #default="scope">-->
<!--            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['ctask:manage:edit']">修改</el-button>-->
<!--            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['ctask:manage:remove']">删除</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />

      <!-- 添加或修改正在执行的任务表 对话框 -->
<!--      <el-dialog :title="title" v-model="open" width="500px" append-to-body>-->
<!--        <el-form ref="manageRef" :model="form" :rules="rules" label-width="80px">-->
<!--          <el-form-item label="任务名称" prop="name">-->
<!--            <el-input v-model="form.name" placeholder="请输入任务名称" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务类型 " prop="type">-->
<!--            <el-select v-model="form.type" placeholder="请选择任务类型 ">-->
<!--              <el-option-->
<!--                  v-for="dict in task_type"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.label"-->
<!--                  :value="parseInt(dict.value)"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务截止日期" prop="ddl">-->
<!--            <el-date-picker clearable-->
<!--                            v-model="form.ddl"-->
<!--                            type="date"-->
<!--                            value-format="YYYY-MM-DD"-->
<!--                            placeholder="请选择任务截止日期">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务持续时长" prop="duration">-->
<!--            <el-input v-model="form.duration" placeholder="请输入任务持续时长" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务价值" prop="value">-->
<!--            <el-input v-model="form.value" placeholder="请输入任务价值" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务优先级 " prop="priority">-->
<!--            <el-select v-model="form.priority" placeholder="请选择任务优先级 ">-->
<!--              <el-option-->
<!--                  v-for="dict in task_priority"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.label"-->
<!--                  :value="parseInt(dict.value)"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务剩余时长" prop="remaining">-->
<!--            <el-input v-model="form.remaining" placeholder="请输入任务剩余时长" />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务所属联盟编号" prop="cid">-->
<!--            <el-input v-model="form.cid" placeholder="请输入任务所属联盟编号" />-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <template #footer>-->
<!--          <div class="dialog-footer">-->
<!--            <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--            <el-button @click="cancel">取 消</el-button>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-dialog>-->
    </div>
  </el-card>
  <el-card style="margin-top:10px" shadow="hover">
    <template #header>
      <h1 class="title">等待队列中的任务</h1>
    </template>
    <div class="app-container">
      <el-form :model="queryParams2" ref="queryRef2" :inline="true" v-show="showSearch2" label-width="128px">
        <el-form-item label="任务编号" prop="id">
          <el-input
              v-model="queryParams2.id"
              placeholder="请输入任务编号"
              clearable
              @keyup.enter="handleQuery2"
          />
        </el-form-item>
        <el-form-item label="任务名称" prop="name">
          <el-input
              v-model="queryParams2.name"
              placeholder="请输入任务名称"
              clearable
              @keyup.enter="handleQuery2"
          />
        </el-form-item>
        <el-form-item label="任务类型 " prop="type">
          <el-select v-model="queryParams2.type" placeholder="请选择任务类型 " clearable>
            <el-option
                v-for="dict in task_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="任务截止日期" prop="ddl">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="queryParams2.ddl"-->
<!--                          type="date"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                          placeholder="请选择任务截止日期">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="任务到达时间" prop="arrival">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="queryParams2.arrival"-->
<!--                          type="date"-->
<!--                          value-format="YYYY-MM-DD"-->
<!--                          placeholder="请选择任务到达时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item label="任务持续时长" prop="duration">
          <el-input
              v-model="queryParams2.duration"
              placeholder="请输入任务持续时长"
              clearable
              @keyup.enter="handleQuery2"
          />
        </el-form-item>
        <el-form-item label="任务价值" prop="value">
          <el-input
              v-model="queryParams2.value"
              placeholder="请输入任务价值"
              clearable
              @keyup.enter="handleQuery2"
          />
        </el-form-item>
<!--        <el-form-item label="任务优先级 " prop="priority">-->
<!--          <el-select v-model="queryParams2.priority" placeholder="请选择任务优先级 " clearable>-->
<!--            <el-option-->
<!--                v-for="dict in task_priority"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="任务等待时长" prop="waiting">
          <el-input
              v-model="queryParams2.waiting"
              placeholder="请输入任务等待时长"
              clearable
              @keyup.enter="handleQuery2"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery2">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>

      <!--    <el-row :gutter="10" class="mb8">-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="primary"-->
      <!--          plain-->
      <!--          icon="Plus"-->
      <!--          @click="handleAdd"-->
      <!--          v-hasPermi="['wtask:show:add']"-->
      <!--        >新增</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="Edit"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['wtask:show:edit']"-->
      <!--        >修改</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="Delete"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['wtask:show:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          plain-->
      <!--          icon="Download"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['wtask:show:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
      <!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
      <!--    </el-row>-->

      <el-table v-loading="loading2" :data="showList" @selection-change="handleSelectionChange2">
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
        <el-table-column label="任务到达时间" align="center" prop="arrival" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.arrival, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务持续时长" align="center" prop="duration" />
        <el-table-column label="任务价值" align="center" prop="value" />
        <el-table-column label="任务优先级 " align="center" prop="priority">
          <template #default="scope">
            <dict-tag :options="task_priority" :value="scope.row.priority"/>
          </template>
        </el-table-column>
        <el-table-column label="任务等待时长" align="center" prop="waiting" />
        <!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
        <!--        <template #default="scope">-->
        <!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wtask:show:edit']">修改</el-button>-->
        <!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wtask:show:remove']">删除</el-button>-->
        <!--        </template>-->
        <!--      </el-table-column>-->
      </el-table>

      <pagination
          v-show="total2>0"
          :total="total2"
          v-model:page="queryParams2.pageNum"
          v-model:limit="queryParams2.pageSize"
          @pagination="getList2"
      />

      <!-- 添加或修改等待中的任务表 对话框 -->
      <el-dialog :title="title2" v-model="open2" width="500px" append-to-body>
        <el-form ref="showRef" :model="form2" :rules="rules2" label-width="80px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="form2.name" placeholder="请输入任务名称" />
          </el-form-item>
          <el-form-item label="任务类型 " prop="type">
            <el-select v-model="form2.type" placeholder="请选择任务类型 ">
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
                            v-model="form2.ddl"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择任务截止日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务到达时间" prop="arrival">
            <el-date-picker clearable
                            v-model="form2.arrival"
                            type="date"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择任务到达时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务持续时长" prop="duration">
            <el-input v-model="form2.duration" placeholder="请输入任务持续时长" />
          </el-form-item>
          <el-form-item label="任务价值" prop="value">
            <el-input v-model="form2.value" placeholder="请输入任务价值" />
          </el-form-item>
          <el-form-item label="任务优先级 " prop="priority">
            <el-select v-model="form2.priority" placeholder="请选择任务优先级 ">
              <el-option
                  v-for="dict in task_priority"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务等待时长" prop="waiting">
            <el-input v-model="form2.waiting" placeholder="请输入任务等待时长" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm2">确 定</el-button>
            <el-button @click="cancel2">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup name="Manage">
import { listManage, getManage, delManage, addManage, updateManage } from "@/api/ctask/manage";

const { proxy } = getCurrentInstance();
const { task_type, task_priority } = proxy.useDict('task_type', 'task_priority');

const manageList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const router = useRouter();
onMounted(() => {
  console.log("onMounted Table");
  console.log(router.currentRoute.value);
});
onUnmounted(()=>{
  console.log("onUnmounted Table");
})
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: null,
    name: null,
    type: null,
    ddl: null,
    duration: null,
    value: null,
    priority: null,
    remaining: null,
    cid: null
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
    ],
    remaining: [
      { required: true, message: "任务剩余时长不能为空", trigger: "blur" }
    ],
    cid: [
      { required: true, message: "任务所属联盟编号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询正在执行的任务表 列表 */
function getList() {
  loading.value = true;
  listManage(queryParams.value).then(response => {
    manageList.value = response.rows;
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
    type: null,
    ddl: null,
    duration: null,
    value: null,
    priority: null,
    remaining: null,
    cid: null
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
  title.value = "添加正在执行的任务表 ";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getManage(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改正在执行的任务表 ";
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
  proxy.$modal.confirm('是否确认删除正在执行的任务表 编号为"' + _ids + '"的数据项？').then(function() {
    return delManage(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('ctask/manage/export', {
    ...queryParams.value
  }, `manage_${new Date().getTime()}.xlsx`)
}

getList();

import { listShow, getShow, delShow, addShow, updateShow } from "@/api/wtask/show";
import {onMounted, onUnmounted} from "vue";
import {onBeforeRouteUpdate} from "vue-router";


const showList = ref([]);
const open2 = ref(false);
const loading2 = ref(true);
const showSearch2 = ref(true);
const ids2 = ref([]);
const single2 = ref(true);
const multiple2 = ref(true);
const total2 = ref(0);
const title2 = ref("");

const data2 = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: null,
    name: null,
    type: null,
    ddl: null,
    arrival: null,
    duration: null,
    value: null,
    priority: null,
    waiting: null
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
    arrival: [
      { required: true, message: "任务到达时间不能为空", trigger: "blur" }
    ],
    duration: [
      { required: true, message: "任务持续时长不能为空", trigger: "blur" }
    ],
    value: [
      { required: true, message: "任务价值不能为空", trigger: "blur" }
    ],
    priority: [
      { required: true, message: "任务优先级 不能为空", trigger: "change" }
    ],
    waiting: [
      { required: true, message: "任务等待时长不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams: queryParams2, form: form2, rules: rules2 } = toRefs(data2);

/** 查询等待中的任务表 列表 */
function getList2() {
  loading2.value = true;
  listShow(queryParams2.value).then(response => {
    showList.value = response.rows;
    total2.value = response.total;
    loading2.value = false;
  });
}

// 取消按钮
function cancel2() {
  open2.value = false;
  reset();
}

// 表单重置
function reset2() {
  form2.value = {
    id: null,
    name: null,
    type: null,
    ddl: null,
    arrival: null,
    duration: null,
    value: null,
    priority: null,
    waiting: null
  };
  proxy.resetForm("showRef");
}

/** 搜索按钮操作 */
function handleQuery2() {
  queryParams2.value.pageNum = 1;
  getList2();
}

/** 重置按钮操作 */
function resetQuery2() {
  proxy.resetForm("queryRef2");
  handleQuery2();
}

// 多选框选中数据
function handleSelectionChange2(selection) {
  ids2.value = selection.map(item => item.id);
  single2.value = selection.length != 1;
  multiple2.value = !selection.length;
}

/** 新增按钮操作 */
// function handleAdd2() {
//   reset2();
//   open2.value = true;
//   title2.value = "添加等待中的任务表 ";
// }
//
// /** 修改按钮操作 */
// function handleUpdate2(row) {
//   reset2();
//   const _id = row.id || ids2.value
//   getShow(_id).then(response => {
//     form2.value = response.data;
//     open2.value = true;
//     title2.value = "修改等待中的任务表 ";
//   });
// }

/** 提交按钮 */
function submitForm2() {
  proxy.$refs["showRef"].validate(valid => {
    if (valid) {
      if (form2.value.id != null) {
        updateShow(form2.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open2.value = false;
          getList2();
        });
      } else {
        addShow(form2.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open2.value = false;
          getList2();
        });
      }
    }
  });
}

/** 删除按钮操作 */
// function handleDelete2(row) {
//   const _ids = row.id || ids2.value;
//   proxy.$modal.confirm('是否确认删除等待中的任务表 编号为"' + _ids + '"的数据项？').then(function() {
//     return delShow(_ids);
//   }).then(() => {
//     getList2();
//     proxy.$modal.msgSuccess("删除成功");
//   }).catch(() => {});
// }
//
// /** 导出按钮操作 */
// function handleExport2() {
//   proxy.download('wtask/show/export', {
//     ...queryParams2.value
//   }, `show_${new Date().getTime()}.xlsx`)
// }

getList2();
</script>

<style lang="scss">
.title{
margin-left: 10px;
}
</style>