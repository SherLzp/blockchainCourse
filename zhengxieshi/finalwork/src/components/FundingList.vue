<template>
  <div>
    <div style="overflow: hidden">
      <div style="float: right; padding-left: 10px">
        <el-button type="warning" @click="createDialogVisible = true">发起众筹</el-button>
      </div>
      <el-pagination
          background small style="float: right;"
          layout="prev, slot, next" :page-count="totalPage"
          :current-page.sync="currentPage">
        <span class="page-span">{{ currentPage }}/{{ totalPage }}</span>
      </el-pagination>
    </div>

    <el-row>
      <el-col :span="span" v-for="(funding, i) in fundingListInPage" style="padding: 10px" :key="i">
        <DetailCard :funding="funding"/>
      </el-col>
    </el-row>

    <el-dialog title="发起众筹" :visible.sync="createDialogVisible" :close-on-click-modal="false" :show-close="false">
      <el-form :model="createForm" label-width="80px" style="width: 500px" ref="createForm">
        <el-form-item label="项目名称" prop="projectName" :rules="[
              { required: true, message: '请输入项目名称'},
              ]">
          <el-input v-model="createForm.projectName"></el-input>
        </el-form-item>

        <el-form-item label="项目简介" prop="projectDetail" :rules="[
              { required: false},
              ]">
          <el-input type="textarea" v-model="createForm.projectDetail"></el-input>
        </el-form-item>

        <el-form-item label="众筹目标" required>
          <el-col :span="14">
            <el-form-item prop="targetBalance" :rules="[
              { required: true, message: '金额不能为空'},
              { type: 'number', message: '金额必须为数字值'}
              ]">
              <el-input v-model.number="createForm.targetBalance"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <span>wei</span>
          </el-col>
        </el-form-item>

        <el-form-item label="截止时间" prop="date" :rules="[
              { required: true, message: '请选择日期与时间'},
              ]">
          <el-date-picker
              v-model.number="createForm.date"
              type="date"
              placeholder="选择截止日期"
              value-format="timestamp">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('createForm')">发起众筹</el-button>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="closeDialog('createForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FundingCard from "@/components/FundingCard";
import {createFunding, drawback_web3} from "@/eth/interface";
import DetailCard from "@/components/DetailCard";

export default {
  name: "FundingList",
  components: {DetailCard, FundingCard},
  props: {
    fundingList: Array,
  },
  data() {
    return {
      createDialogVisible: false,
      unitOptions: ['wei', 'ether'],
      createForm: {
        projectName: '',
        projectDetail: '',
        targetBalance: 0,
        unit: '',
        date: (new Date()).valueOf(),
      },
      submitting: false,
      currentPage: 1,
      pageSize: 10,
      span: 24,
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.fundingList.length / this.pageSize)
    },
    fundingListInPage() {
      if (this.currentPage * this.pageSize <= this.fundingList.length) {
        return this.fundingList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      }
      else {
        return this.fundingList.slice((this.currentPage - 1) * this.pageSize, this.fundingList.length)
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createFunding(this.createForm.projectName, this.createForm.projectDetail, this.createForm.targetBalance,
              (new Date()).valueOf(),this.createForm.date)
          .then(res => {
            this.$message({
              showClose: true,
              message: '发起众筹成功',
              type: 'success',
            })
            this.$refs[formName].resetFields();
            this.$store.dispatch('updateFundingList')
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: '发起众筹失败',
              type: 'warning',
            })
          })

        } else {
          return false;
        }
      });
    },
    closeDialog(formName) {
      this.createDialogVisible = false
      this.$refs[formName].resetFields();
    },
    drawback() {
      this.$confirm('此操作将退回众筹金额并删除此众筹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        drawback_web3(this.funding.fundingAddress)
            .then(res => {
              this.$message({
                showClose: true,
                message: '众筹撤销成功',
                type: 'success',
              })
              this.$store.dispatch('updateFundingList')
            })
            .catch(err => err)
      }).catch(() => {
      });

    }
  }
}
</script>

<style scoped>
.page-span {
  min-width: 0 !important;
}
</style>