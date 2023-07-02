<template>
  <!-- <div id="viewDiv"></div> -->
  <body>
    <div>当前积分：30分
     </div> 
    <div>
    <el-main>
        <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
        <el-table-column prop="itemName" label="项目名称" width="280">
        </el-table-column>
        <el-table-column prop="cost" label="积分消耗(分)" width="220">
        </el-table-column>
        <el-table-column prop="numberleft" label="剩余份数" width="220">
        </el-table-column>
        <el-table-column prop="detail" label="详情" width="220">
        </el-table-column>
        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
            <template #default="scope">
                <el-tooltip content="购买" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="不再推荐" placement="top" v-if="scope.row.userId !== 1">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
        <!-- <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button class="ml-5" type="success" @click="handleEdit(scope.row)">选择 <i class="el-icon-edit"></i> </el-button>
            <el-popconfirm
                class="ml-5"
                title="确定不再提示吗？"
                confirm-button-text='确定'
                cancel-button-text='我再想想'
                icon="el-icon-info"
                icon-color="red"
                @confirm="del(scope.row.stationNumber)"
            >
              <el-button type="danger" slot="reference">不再提示<i class="el-icon-remove-outline"></i> </el-button>
            </el-popconfirm>
          </template>
        </el-table-column> -->
      </el-table>
    </el-main>
  </div>
  </body>
</template>


<script>
import * as echarts from 'echarts/core';
// import Map from "@arcgis/core/Map";
// import View from "@arcgis/core/views/MapView"
// import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
// import Geoprocessor from "@arcgis/core/rest/geoprocessor";
export default {
  data() {
    return {
      zFieldName: "elevation", // 设置默认的属性字段名称
    }
  },
  beforeMount() {

  },
  created() {
    
    this.load()

  },
  mounted() {
  },
  methods: {

    load(){
      const dataInit=[
          { 
            itemName:'五月普通广告一天',
            cost:5,
            numberleft:10,
            detail:10
            },
          { 
            itemName:'五月头条广告一天',
            cost:20,
            numberleft:10,
            detail:10
            },
          { 
            itemName:'任务置顶卡一天',
            cost:6,
            numberleft:10,
            detail:10
            },
          { 
            itemName:'任务置顶卡七天',
            cost:40,
            numberleft:10,
            detail:10
            }
            ]
        this.tableData=dataInit
    }
  }
}
</script>

<style>
html,body,#viewDiv{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>