<template>
  <el-card :body-style="'padding: 0px; height: 400px'"style="background-color: #545c64">
    <div class="part-wrapper">
      <div class="title-wrapper"style="color:#ffffff">项目名称:{{funding.projectName}}</div>
      <div style="font-size: 15px; color: #999;">{{remainTime}}</div>
    </div>
    <div class="part-wrapper">
      <div class="title-wrapper"style="color:#ffffff">项目简介:{{funding.projectDetail}}
<!--        <el-button type="primary" size="mini" @click="detailDialogVisible = true">查看简介</el-button>-->
      </div>
    </div>
    <div class="part-wrapper">
      <div class="title-wrapper"style="color:#ffffff">众筹详情:{{isAchieved ? '已完成' : '未完成'}}</div>
      <div style="color:#ffffff">已投金额:{{investment}} wei</div>
      <div v-if="!isAchieved"style="color:#ffffff">已筹:{{funding.balance}} wei</div>
      <div v-else style="color:#ffffff">账户剩余:{{funding.balance}} wei</div>
      <div style="color:#ffffff">目标:{{funding.targetBalance}} wei</div>
    </div>
    <div class="part-wrapper">
      <div class="title-wrapper"style="color:#ffffff">众筹创始人:{{funding.manager}}</div>
    </div>
    <div class="bottom-wrapper">
      <el-row :gutter="20">
        <el-col :span="6" style="margin-bottom: 10px">
          <el-button style="width: 100%" type="info"
                     @click="showInvestDialog"
                     v-if="!investDisabled">参与众筹</el-button>
        </el-col>
        <el-col :span="6">
          <el-button style="width: 100%" type="info"
                     @click="showVoteDialog"
                     :disabled="voteDisabled">投票</el-button>
        </el-col>
        <el-col :span="6">
          <el-button style="width: 100%" type="info"
                     @click="showRequestDialog"
                     :disabled="requestDisabled">资金请求</el-button>
        </el-col>
        <el-col :span="6">
          <el-button style="width: 100%" type="info"
                     @click="drawback"
                     :disabled="drawbackDisabled">众筹撤销</el-button>
        </el-col>
      </el-row>

    </div>



    <el-dialog title="项目简介" :visible.sync="detailDialogVisible" :close-on-click-modal="false">
      <div>{{funding.projectDetail}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="参与众筹" :visible.sync="investDialogVisible" :close-on-click-modal="false">
      <el-form :model="investForm" label-width="100px" style="width: 500px" ref="investForm"
               :rules="investFormRules" @submit.native.prevent>

        <el-form-item label="投资金额" prop="investBalance" v-if="!investDisabled">
          <el-input v-model.number="investForm.investBalance"></el-input>
        </el-form-item>
        <el-form-item v-if="!investDisabled">
          <el-button type="primary" @click="submitInvestForm('investForm')">支付</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="investDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="资金请求" :visible.sync="requestDialogVisible" :close-on-click-modal="false"
               width="70%">
      <el-table :data="requestTableData" stripe style="width: 100%">
        <el-table-column prop="0" label="使用目的">
        </el-table-column>

        <el-table-column prop="1" label="请求金额">
        </el-table-column>


        <el-table-column label="允许率">
          <template slot-scope="scope">
            {{approveRate(scope.$index)}}%
          </template>
        </el-table-column>


        <el-table-column label="投票率">
          <template slot-scope="scope">
            {{voteRate(scope.$index)}}%
          </template>
        </el-table-column>

        <el-table-column prop="6" label="状态">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" :disabled="requestTableData[scope.$index]['6'] !== '请求已通过'"
                       @click="executeRequest(scope.$index)">执行</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="font-weight: bold; margin-top: 20px; margin-bottom: 20px">资金使用申请</div>
      <el-form :model="requestForm" label-width="100px" style="width: 500px" ref="requestForm"
               :rules="requestFormRules">
        <el-form-item label="使用目的" prop="purpose">
          <el-input v-model="requestForm.purpose"></el-input>
        </el-form-item>

        <el-form-item label="请求金额" prop="cost">
          <el-input v-model.number="requestForm.cost"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRequestForm('requestForm')">发起请求</el-button>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="requestDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="投票" :visible.sync="voteDialogVisible" :close-on-click-modal="false"
               width="70%">
      <div style="font-weight: bold; margin-bottom: 15px">已有资金请求列表</div>
      <el-table :data="requestTableData" stripe style="width: 100%">
        <el-table-column prop="0" label="使用目的">
        </el-table-column>

        <el-table-column prop="1" label="请求金额">
        </el-table-column>

        <el-table-column prop="3" label="已投票数">
        </el-table-column>

        <el-table-column label="总票数">
          <template slot-scope="scope">
            {{funding.investorsCount}}
          </template>
        </el-table-column>

        <el-table-column label="允许率">
          <template slot-scope="scope">
            {{approveRate(scope.$index)}}%
          </template>
        </el-table-column>

        <el-table-column label="投票率">
          <template slot-scope="scope">
            {{voteRate(scope.$index)}}%
          </template>
        </el-table-column>

        <el-table-column prop="6" label="状态">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="!requestTableData[scope.$index]['2']"
                       type="text" @click="voteRequest(scope.$index, true)">赞同</el-button>
            <el-button v-if="!requestTableData[scope.$index]['2']"
                       type="text" @click="voteRequest(scope.$index, false)">反对</el-button>
            <el-button v-else type="text" :disabled="true">已投票</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="voteDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
import {
  createRequest,
  drawback_web3, executeRequest_web3,
  getInvestment_web3,
  getRequests,
  investFunding,
  isInvestor,
  isManager, voteRequest_web3
} from '@/eth/interface'

export default {
  name: "DetailCard",
  props: {
    funding: {
      type: Object,
    }
  },
  data() {
    const validateInvest = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('众筹金额不能为 0'));
      }
      else if (value > this.funding.targetBalance -
          this.funding.balance) {
        callback(new Error('众筹金额超过众筹上限'));
      }
      else {
        callback();
      }
    };

    const validateRequest = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('请求金额不能为 0'));
      }
      else if (value > this.funding.balance -
          this.funding.requestBalance) {
        callback(new Error('请求金额超过账户剩余金额'));
      }
      else {
        callback();
      }
    };

    return {
      detailDialogVisible: false,
      isFundingManager: false,
      isFundingInvestor: false,

      //invest part
      investDialogVisible: false,
      investment: 0,
      investForm: {
        investBalance: 0,
      },
      investFormRules: {
        investBalance: [
          { type: 'number', message: '金额必须为数字值'},
          { validator: validateInvest, trigger: 'blur' }
        ]
      },

      //request part
      requestDialogVisible: false,
      requestTableData: [

      ],
      requestForm: {
        purpose: '',
        cost: 0,
      },
      requestFormRules: {
        purpose: [
          {required: true,  message: '请填入使用目的'},
        ],
        cost: [
          {type: 'number', message: '金额必须为数字值'},
          { validator: validateRequest, trigger: 'blur' }
        ],
      },
      requestStatus: ['投票中', '请求已通过', '请求未通过', '请求已完成'],

      //vote part
      voteDialogVisible: false,
    }
  },
  computed: {
    remainTime() {
      if (this.funding.endTime < (new Date).valueOf()) {
        return '已结束'
      }
      return (this.funding.endTime - (new Date).valueOf()) / (1000*3600*24) + ' 天'
    },
    timePercent() {
      if (this.funding.endTime > (new Date).valueOf())
        return Math.ceil(( 1 - (this.funding.endTime - (new Date).valueOf())
          / (this.funding.endTime - this.funding.startTime)) * 100)
      else
        return 100
    },
    isAchieved() {
      return  this.funding.isAchieved
    },
    investDisabled() {
      return this.funding.endTime < (new Date).valueOf()
          || this.isAchieved
    },
    requestDisabled() {
      return !this.isFundingManager || !this.isAchieved
    },
    voteDisabled() {
      return !this.isAchieved || !this.isFundingInvestor
    },
    drawbackDisabled() {
      return this.isAchieved || !this.isFundingManager
    },
  },
  created() {
    isManager(this.funding.fundingAddress)
    .then(res => {
      this.isFundingManager = res
    })
    isInvestor(this.funding.fundingAddress)
    .then(res => {
      this.isFundingInvestor = res
    })
  },
  methods: {
    getInvestment() {
      getInvestment_web3(this.funding.fundingAddress)
      .then(res => {
        this.investment = res
      })
    },
    showInvestDialog() {
      this.getInvestment()
      this.investDialogVisible = true
    },
    submitInvestForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          investFunding(this.funding.fundingAddress, this.investForm.investBalance)
          .then(res => {
            this.$message({
              showClose: true,
              message: '支付成功',
              type: 'success',
            })
            this.$refs[formName].resetFields();
            this.getInvestment()
            this.$store.dispatch('updateFundingList')
          })
        }
      })
    },


    getRequestData() {
      getRequests(this.funding.fundingAddress)
      .then(res => {
        this.requestTableData = res
        this.requestTableData.map(value => {
          value['6'] = this.requestStatus[value['6']]
          return value
        })
      })
    },
    approveRate(index) {
      return Math.ceil(
          this.requestTableData[index]['4'] / this.funding.targetBalance * 100
      )
    },
    voteRate(index) {
      return Math.ceil(
          (this.requestTableData[index]['4'] / this.funding.targetBalance
          + this.requestTableData[index]['5'] / this.funding.targetBalance)
          * 100
      )
    },

    showRequestDialog() {
      this.getRequestData()
      this.requestDialogVisible = true
    },
    submitRequestForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createRequest(this.funding.fundingAddress, this.requestForm.purpose, this.requestForm.cost)
          .then(res => {
            this.$message({
              showClose: true,
              message: '请求发起成功',
              type: 'success',
            })
            this.$refs[formName].resetFields();
            this.getRequestData()
          })
        }
      })
    },

    showVoteDialog() {
      this.getRequestData()
      this.voteDialogVisible = true
    },
    voteRequest(index, isApproved) {
      voteRequest_web3(this.funding.fundingAddress, index, isApproved)
      .then(res => {
        this.$message({
          showClose: true,
          message: '投票成功',
          type: 'success',
        })
        this.getRequestData()
      })
    },

    executeRequest(index) {
      executeRequest_web3(this.funding.fundingAddress, index)
      .then(res => {
        this.$message({
          showClose: true,
          message: '请求执行成功',
          type: 'success',
        })
        this.getRequestData()
      })
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

    },
  }
}
</script>

<style scoped>
.funding-cover {
  height: 300px;
  width: 100%;
}
.title-wrapper {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.part-wrapper {
  padding: 10px;
  border-bottom: 1px solid #ddd
}

.bottom-wrapper {
  padding: 10px;
}


</style>