<script setup>
import {computed, reactive, ref} from "vue";

const tasklist = reactive([
    {
        'name': '比亚迪汽车',
        'amount': 100,
        'type': '生产任务',
        'priority': '高',
        'deadline': '2021-07-01',
        'duration': 10,
        'state': '已分配',
        'number': 1
    },
    {
        'name': '宁德时代',
        'amount': 200,
        'type': '生产任务',
        'priority': '中',
        'deadline': '2021-07-02',
        'duration': 20,
        'state': '已分配',
        'number': 2
    },
    {
        'name': '小鸭家电',
        'amount': 300,
        'type': '销售任务',
        'priority': '低',
        'deadline': '2021-07-03',
        'duration': 30,
        'state': '未分配',
        'number': 3
    },
    {
        'name': '固特异轮胎',
        'amount': 400,
        'type': '生产任务',
        'priority': '高',
        'deadline': '2021-07-04',
        'duration': 40,
        'state': '未分配',
        'number': 4
    },
    {
        'name': '三花配件',
        'amount': 500,
        'type': '采购任务',
        'priority': '中',
        'deadline': '2021-07-05',
        'duration': 50,
        'state': '已分配',
        'number': 5
    },
    {
        'name': '大王玻璃',
        'amount': 600,
        'type': '采购任务',
        'priority': '低',
        'deadline': '2021-07-06',
        'duration': 60,
        'state': '未分配',
        'number': 6
    },
    {
        'name': '永恒电机  ',
        'amount': 700,
        'type': '生产任务',
        'priority': '高',
        'deadline': '2021-07-07',
        'duration': 70,
        'state': '未分配',
        'number': 7
    },
    {
        'name': '鸿蒙车机',
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
//分页展示，每页展示8个任务
const pageSize = 8
//当前页
let currentPage = ref(1);
//当前页的任务列表
let currentTaskList = computed(()=>{
    return tasklist.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
})
const handleCurrentChange=(val)=> {
    currentPage.value = val
}
</script>

<template>
    <el-table :data="currentTaskList" style="width: 2000%">
        
        <el-table-column prop="number" label="企业编号"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="amount" label="推荐时间粒度"></el-table-column>
        
        <el-table-column  label="操作">
            <el-button class="btn1" type="primary"  style="margin-left:10px;margin-right:10px">查看详情</el-button>
        </el-table-column>
    </el-table>
    <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="tasklist.length"
            @current-change="handleCurrentChange"
            class="mt-4"
    />
</template>

<style scoped lang="less">

</style>