<template>
  <el-table :data="myInvest" style="width: 100%" >

    <el-table-column label="NO." prop="proID" width="50"> </el-table-column>
    <el-table-column label="发起人" prop="initiator"> </el-table-column>
    <el-table-column label="项目名称" prop="title"> </el-table-column>
    <el-table-column label="结束时间" prop="endTime" width="200"> </el-table-column>
    <el-table-column label="目标金额" prop="goal"> </el-table-column>
    <el-table-column label="当前金额" prop="totalAmount"> </el-table-column>
    <el-table-column label="投资人数" prop="invCount"> </el-table-column>
    <el-table-column label="请求数" prop="reqCount"> </el-table-column>
    
    <el-table-column align="right">
      <template slot-scope="scope">
        <el-button @click="handleSupport(scope.$index, scope.row)">同意全部金额请求</el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  import { newRequest, getMyProject, IDtoList, supportRequest } from "../contractAPI.js";

  export default {
    data() {
      return {
        myInvest: [],
      };
    },
    methods: {
      handleSupport(index, row) {
        var fund = row;
        if(fund.reqCount==1)
        {
          supportRequest(row.proID, 1)
          .then((res) => {
            this.$message({
              message: "已同意",
              type: "success",
            });
            this.$router.go(0);
          })
          .catch((e) => {
            this.$message.error("同意请求失败");
            console.log(e);
          });
        }
        else if (fund.reqCount==0)
        {
          this.$message.error("当前无请求");
        }
        else
        {
          this.$message.error("unexpected error");
        }
      }
    },
    async mounted() {
      try {
        var res = await getMyProject();
        console.log(res);
        this.myInvest = await IDtoList(res.arr2);
      } catch (error) {}
    },
  };
</script>
