<template>
  <el-table :data= "allFund">

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
        <el-button @click="handleInvest(scope.$index, scope.row, scope.row.status)">投资 1ETH</el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  import { newInvest, getUserAddress, getAllFund } from "../contractAPI.js";

  export default {
    data() {
      return {
        allFund: [],
        user: "",
      };
    },

    methods: {
      handleInvest(index, row, state) {
        if(state=="")
        {
          console.log("invest");
          newInvest(row.proID, 1)
          .then((res) => {
            this.$message({
              message: "投资成功",
              type: "success",
            });
            this.$router.go(0);
          })
          .catch((e) => {
            this.$message.error("投资失败");
            console.log(e);
          });
        }
        else
        {
          this.$message.error("该项目不可投资！");
        }
      }
    },

    async mounted() {
      try {
        this.user = await getUserAddress();
        this.allFund = await getAllFund();
        console.log("look at the allFund!");
        console.log(this.allFund);
      } catch (error) {}
    },
  };

</script>

