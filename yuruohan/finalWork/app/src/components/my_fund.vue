<template>
  <el-table :data="myFund" style="width: 100%" >

    <el-table-column label="NO." prop="proID" width="50"> </el-table-column>
    <el-table-column label="发起人" prop="initiator"> </el-table-column>
    <el-table-column label="项目名称" prop="title"> </el-table-column>
    <el-table-column label="结束时间" prop="endTime" width="200"> </el-table-column>
    <el-table-column label="目标金额" prop="goal"> </el-table-column>
    <el-table-column label="当前金额" prop="totalAmount"> </el-table-column>
    <el-table-column label="投资人数" prop="invCount"> </el-table-column>
    <el-table-column label="请求数" prop="reqCount"> </el-table-column>
    <el-table-column label="请求是否成功" prop="supportRate"> </el-table-column>

    <el-table-column align="right">
      <template slot-scope="scope">
        <el-button @click="handleRequest(scope.$index, scope.row)">请求全部金额</el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  import { getMyProject, IDtoList, newRequest } from "../contractAPI.js";

  export default {
    data() {
      return {
        myFund: [],
      };
    },
    methods: {
      handleRequest(index, row) {
        if(row.status=="success")
        {
          if(row.reqCount==0)
          {
            newRequest(row.proID, "", row.goal)
            .then((res) => {
              this.$message({
                message: "提交请求成功",
                type: "success",
              });
              this.$router.go(0);
            })
            .catch((e) => {
              this.$message.error("提交请求失败");
              console.log(e);
            });
          }
          else
          {
            this.$message.error("已有请求存在");
          }
        }
        else
        {
          this.$message.error("请求提交失败！众筹尚未成功");
        }
      }
    },

    async mounted() {
      try {
        var res = await getMyProject();
        this.myFund = await IDtoList(res.arr1);
      } catch (error) {}
    },
  };
</script>
