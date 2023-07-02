<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="150px">
      <el-form-item label="企业名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入企业名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业所在地" prop="city">
        <el-input
            v-model="queryParams.city"
            placeholder="请输入企业所在地"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属产业链" prop="chain">
        <el-input
            v-model="queryParams.chain"
            placeholder="请输入所属产业链"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务资源满足度" prop="satisfy">
        <el-input
            v-model="queryParams.satisfy"
            placeholder="请输入任务资源满足度"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加入联盟个数" prop="cnum">
        <el-input
            v-model="queryParams.cnum"
            placeholder="请输入加入联盟个数"
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
            v-hasPermi="['coalition:enterprise:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['coalition:enterprise:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['coalition:enterprise:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['coalition:enterprise:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="enterpriseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业编号" align="center" prop="id" />
      <el-table-column label="企业名称" align="center" prop="name" />
      <el-table-column label="企业所在地" align="center" prop="city" />
      <el-table-column label="所属产业链" align="center" prop="chain" />
      <el-table-column label="任务资源满足度" align="center" prop="satisfy" />
      <el-table-column label="加入联盟个数" align="center" prop="cnum" />
      <el-table-column label="执行中的任务" align="center">
        {{coalitionStore.detail.tname}}
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['coalition:enterprise:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['coalition:enterprise:remove']">删除</el-button>
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

    <!-- 添加或修改企业表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="enterpriseRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="企业所在地" prop="city">
          <el-input v-model="form.city" placeholder="请输入企业所在地" />
        </el-form-item>
        <el-form-item label="所属产业链" prop="chain">
          <el-input v-model="form.chain" placeholder="请输入所属产业链" />
        </el-form-item>
        <el-form-item label="任务资源满足度" prop="satisfy">
          <el-input v-model="form.satisfy" placeholder="请输入任务资源满足度" />
        </el-form-item>
        <el-form-item label="加入联盟个数" prop="cnum">
          <el-input v-model="form.cnum" placeholder="请输入加入联盟个数" />
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

<script setup name="Enterprise">
import { listEnterprise, getEnterprise, delEnterprise, addEnterprise, updateEnterprise } from "@/api/coalition/enterprise";
import {useCoalitionStore} from "@/store/modules/coalition";
import {getCurrentInstance, reactive, ref} from "vue";

let coalitionStore = useCoalitionStore();

const { proxy } = getCurrentInstance();

const enterpriseList = ref([]);
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
    city: null,
    chain: null,
    satisfy: null,
    cnum: null
  },
  rules: {
    name: [
      { required: true, message: "企业名称不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "企业所在地不能为空", trigger: "blur" }
    ],
    chain: [
      { required: true, message: "所属产业链不能为空", trigger: "blur" }
    ],
    satisfy: [
      { required: true, message: "任务资源满足度不能为空", trigger: "blur" }
    ],
    cnum: [
      { required: true, message: "加入联盟个数不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询企业表列表 */
function getList() {
  loading.value = true;
  listEnterprise(queryParams.value).then(response => {
    enterpriseList.value = response.rows;
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
    city: null,
    chain: null,
    satisfy: null,
    cnum: null
  };
  proxy.resetForm("enterpriseRef");
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
  title.value = "添加企业表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEnterprise(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改企业表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["enterpriseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEnterprise(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEnterprise(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除企业表编号为"' + _ids + '"的数据项？').then(function() {
    return delEnterprise(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('coalition/enterprise/export', {
    ...queryParams.value
  }, `enterprise_${new Date().getTime()}.xlsx`)
}

getList();
</script>
