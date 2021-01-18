<template>
  <div>
    <div style="overflow: hidden">
      <div style="float: left; padding-left: 10px">
        <el-button type="primary" @click="createDialogVisible = true">发起众筹</el-button>
      </div>
      <el-pagination
          background small style="float: right;"
          layout="prev, slot, next, jumper" :page-count="totalPage"
          :current-page.sync="currentPage">
        <span class="page-span">{{ currentPage }}/{{ totalPage }}</span>
      </el-pagination>
    </div>

    <el-row>
      <el-col :span="span" v-for="(funding, i) in fundingList" style="padding: 10px" :key="i">
        <FundingCard :funding="funding"></FundingCard>
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
              { required: true, message: '请输入项目简介'},
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
          <span style="margin-left: 20px; font-size: 15px; color: #999;">默认为当天0点</span>
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
import {createFunding} from "@/eth/interface";

export default {
  name: "FundingList",
  components: {FundingCard},
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
      pageSize: 6,
      span: 6,
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.fundingList.length / this.pageSize)
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
    }
  }
}
</script>

<style scoped>
.page-span {
  min-width: 0px !important;
}
</style>