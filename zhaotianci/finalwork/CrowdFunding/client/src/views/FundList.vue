<template>
  <el-table
    v-loading="loading"
    :data="
      tableData.filter(
        (data) => !search || data.title.toLowerCase().includes(search.toLowerCase())
      )
    "
    style="width: 100%"
  >
    <el-table-column label="项目编号" prop="proID" width="100"> </el-table-column>
    <el-table-column label="项目名称" prop="title"> </el-table-column>
    <el-table-column label="众筹目标(Finney)" prop="goal"> </el-table-column>
    <el-table-column label="开始时间" prop="startTime" width="200"> </el-table-column>
    <el-table-column label="结束时间" prop="endTime" width="200"> </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="100"
    >
      <template slot-scope="scope">
        <el-tag
          :type="getType(scope.row.status)"
          disable-transitions
          >{{ scope.row.status == "" ? "进行中" : (scope.row.status == "success" ? "成功" : "失败") }}</el-tag
        >
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template slot="header" slot-scope="scope">
        <el-input v-model="search" size="mini" placeholder="输入以搜索" />
      </template>
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
          >详细信息</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { login, createProject, getFundList, getStatus } from "../contractService.js";

export default {
  data() {
    return {
      tableData: [],
      search: "",
      loading: true,
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push({ name: "FundDetail", params: { id: row.proID } });
    },
    getType(status){
      if(status == ""){
        return 'primary';
      }
      if(status == "success"){
        return 'success';
      }
      return 'danger';
    }
  },
  async mounted() {
    try {
      this.tableData = await getFundList();
      this.loading = false;
    } catch (error) {}
  },
};
</script>

<style>
.el-table .warning-row {
  background: #f56c6c;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
