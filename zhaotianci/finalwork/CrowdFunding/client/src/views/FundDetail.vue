<template>
  <div>
    <el-page-header @back="goBack" content="众筹详情"></el-page-header>
    <el-divider></el-divider>
    <el-card class="box-card" align="left">
      <div slot="header" class="clearfix">
        <span
          ><b>{{ this.fund.title }}</b></span
        >
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="3"><b>众筹编号：</b></el-col>
          <el-col :span="6">{{ this.proID }}</el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="3"><b>发起人：</b></el-col>
          <el-col :span="6">{{ this.fund.initiator }}</el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="3"><b>众筹描述：</b></el-col>
          <el-col :span="16">{{ this.fund.description }}</el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="3"><b>开始时间：</b></el-col>
          <el-col :span="6">{{ this.fund.startTime }}</el-col>
          <el-col :span="3"><b>结束时间：</b></el-col>
          <el-col :span="6">{{ this.fund.endTime }}</el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="3.5"><b>众筹目标(Finney)：</b></el-col>
          <el-col :span="3">{{ this.fund.goal }}</el-col>
          <el-col :span="3.5"><b>募集金额(Finney)：</b></el-col>
          <el-col :span="3">{{ this.fund.totalAmount }}</el-col>
          <el-col :span="3.5"><b>剩余金额(Finney)：</b></el-col>
          <el-col :span="3">{{ this.fund.currentAmount }}</el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="3"><b>众筹进度：</b></el-col>
          <el-col :span="16">
            <el-progress
              :stroke-width="24"
              :percentage="this.fund.percentage"
              :status="this.fund.status"
            ></el-progress>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-divider></el-divider>
    <div v-if="isInitator && fund.status == 'success' && fund.currentAmount != 0">
      <el-form
        :model="ruleForm2"
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm2"
        align="left"
      >
        <el-form-item label="请求描述" prop="description" :disabled="this.disabled2" style="width: 50%">
          <el-input type="textarea" :rows="5" v-model="ruleForm2.description"></el-input>
        </el-form-item>
        <el-form-item label="请求金额" prop="amount">
          <el-input-number
            v-model="ruleForm2.amount"
            :disabled="this.disabled2"
            :min="1"
          ></el-input-number>
          (单位： Finney)
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="this.disabled2"
            v-loading.fullscreen.lock="fullscreenLoading"
            @click="submitForm('ruleForm2')"
            >发起请求</el-button
          >
          <el-button :disabled="this.disabled2" @click="resetForm('ruleForm2')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div v-if="!isInitator && !disabled">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        align="left"
      >
        <el-form-item label="当前账户">
          {{ account }}
        </el-form-item>
        <el-form-item label="投资金额" prop="amount">
          <el-input-number
            v-model="ruleForm.amount"
            :disabled="this.disabled"
            :min="1"
          ></el-input-number>
          (单位： Finney)
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="this.disabled"
            v-loading.fullscreen.lock="fullscreenLoading"
            @click="submitForm('ruleForm')"
            >立即投资</el-button
          >
          <el-button :disabled="this.disabled" @click="resetForm('ruleForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-collapse v-model="activeNames" style="width: 80%">
      <el-collapse-item title="投资列表" name="1" v-loading="t1loading">
        <el-table :data="tableData1" style="width: 100%">
          <el-table-column prop="invID" label="序号" width="100"> </el-table-column>
          <el-table-column prop="investor" label="投资人" width="400"> </el-table-column>
          <el-table-column prop="amount" label="金额(Finney)" width="150">
          </el-table-column>
          <el-table-column prop="time" label="时间"> </el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="handleWithdraw(scope.row.invID)"
                v-if="
                  scope.row.investor.toLowerCase() == account.toLowerCase() &&
                  disabled &&
                  disabled2 &&
                  scope.row.amount != 0
                "
                >取回资金</el-button
              >
              <el-button
                type="danger"
                size="mini"
                :disabled="true"
                v-if="
                  scope.row.investor.toLowerCase() == account.toLowerCase() &&
                  disabled &&
                  disabled2 &&
                  scope.row.amount == 0
                "
                >已取回</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="请求列表" name="2" v-loading="t2loading">
        <el-table :data="tableData2" style="width: 100%">
          <el-table-column prop="reqID" label="序号" width="100"> </el-table-column>
          <el-table-column prop="amount" label="金额(Finney)" width="150">
          </el-table-column>
          <el-table-column prop="description" label="描述"> </el-table-column>
          <el-table-column prop="status" label="状态" align="right"
            ><template slot-scope="scope">
              <el-tag :type="scope.row.status" disable-transitions>{{
                scope.row.status == "success" ? "通过" : "未通过"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleSupport(scope.row.reqID)"
                v-if="isInvestor && supportFlags[scope.row.reqID]"
                >支持请求</el-button
              >
              <el-button
                type="primary"
                size="mini"
                disabled="true"
                v-if="isInvestor && !supportFlags[scope.row.reqID]"
                >已支持</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleCollect(scope.row.reqID)"
                v-if="
                  isInitator && scope.row.status == 'success' && scope.row.amount != 0
                "
                >取得资金</el-button
              >
              <el-button
                type="primary"
                size="mini"
                disabled="true"
                v-if="
                  isInitator && scope.row.status == 'success' && scope.row.amount == 0
                "
                >已取得</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// @ is an alias to /src
import { getCurrentAddress } from "../contract.js";
import {
  getStatus,
  getFundDetail,
  invest,
  getInvList,
  createRequest,
  getReqList,
  withdraw,
  support,
  collect,
} from "../contractService.js";

export default {
  data() {
    return {
      proID: this.$route.params.id,
      fund: null,
      tableData1: [],
      tableData2: [],
      disabled: false,
      disabled2: true,
      fullscreenLoading: false,
      ruleForm: {
        amount: 10,
      },
      rules: {
        amount: [
          { required: true, message: "投资金额不能为空", trigger: "blur" },
          { type: "number", message: "投资金额必须为数字值", trigger: "blur" },
        ],
      },
      ruleForm2: {
        description: "",
        amount: 10,
      },
      rules2: {
        description: [
          { required: true, message: "请输入请求描述", trigger: "blur" },
          { min: 3, max: 500, message: "长度在 3 到 500 个字符", trigger: "blur" },
        ],
        amount: [
          { required: true, message: "请求金额不能为空", trigger: "blur" },
          { type: "number", message: "请求金额必须为数字值", trigger: "blur" },
        ],
      },
      account: "",
      t1loading: true,
      t2loading: true,
      isInitator: false,
      isInvestor: false,
      investorID: -1,
      supportFlags: [],
      activeNames: ["1", "2"],
    };
  },
  async mounted() {
    try {
      this.fund = await getFundDetail(this.proID);
      if (this.fund.status != "") {
        this.disabled = true;
        if (this.fund.status == "success") {
          this.disabled2 = false;
        }
      }
      this.account = await getCurrentAddress();
      this.isInitator = this.account.toLowerCase() == this.fund.initiator.toLowerCase();
      this.tableData1 = await getInvList(this.proID, this.fund.invCount);
      for (var i = 0; i < this.fund.invCount; i++) {
        if (this.tableData1[i].investor.toLowerCase() == this.account.toLowerCase()) {
          this.isInvestor = true;
          this.investorID = i;
          break;
        }
      }
      this.t1loading = false;
      this.tableData2 = await getReqList(this.proID, this.fund.reqCount);
      for (var req of this.tableData2) {
        var flag = req.supporters.indexOf(this.investorID) == -1;
        this.supportFlags.push(flag);
      }
      this.t2loading = false;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);;
    },
    onInvestClick() {
      const _this = this;
      _this.fullscreenLoading = true;
      invest(_this.proID)
        .then((res) => {
          _this.$message({
            message: "投资成功",
            type: "success",
          });
          _this.fullscreenLoading = false;
          _this.$router.go(0);
        })
        .catch((e) => {
          _this.fullscreenLoading = false;
          this.$message.error("投资失败");
          console.log(e);
        });
    },
    submitForm(formName) {
      const _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName == "ruleForm") {
            //console.log(_this.ruleForm);
            var confirmText = [
              "请确认以下信息：",
              "项目：" + this.proID + "-" + this.fund.title,
              "当前账户：" + this.account,
              "投资金额：" + this.ruleForm.amount,
            ];
            const newDatas = [];
            const h = this.$createElement;
            for (const i in confirmText) {
              newDatas.push(h("p", null, confirmText[i]));
            }
            const _this = this;
            this.$confirm("提示", {
              title: "提示",
              message: h("div", null, newDatas),
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                _this.fullscreenLoading = true;
                invest(_this.proID, _this.ruleForm.amount)
                  .then((res) => {
                    _this.fullscreenLoading = false;
                    _this.$message({
                      message: "投资成功",
                      type: "success",
                    });
                    _this.$router.go(0);
                  })
                  .catch((e) => {
                    _this.fullscreenLoading = false;
                    this.$message.error("投资失败");
                    console.log(e);
                  });
              })
              .catch(() => {});
          } else {
            const _this = this;
            this.$confirm("确认提交请求?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                _this.fullscreenLoading = true;
                createRequest(
                  _this.proID,
                  _this.ruleForm2.description,
                  _this.ruleForm2.amount
                )
                  .then((res) => {
                    _this.fullscreenLoading = false;
                    _this.$message({
                      message: "提交请求成功",
                      type: "success",
                    });
                    _this.$router.go(0);
                  })
                  .catch((e) => {
                    _this.fullscreenLoading = false;
                    this.$message.error("提交请求失败");
                    console.log(e);
                  });
              })
              .catch(() => {});
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleWithdraw(invID) {
      const _this = this;
      _this.fullscreenLoading = true;
      withdraw(this.proID)
        .then(() => {
          _this.fullscreenLoading = false;
          _this.$message({
            message: "取回资金成功",
            type: "success",
          });
          _this.$router.go(0);
        })
        .catch((e) => {
          _this.fullscreenLoading = false;
          this.$message.error("取回资金失败");
          console.log(e);
        });
    },
    handleSupport(reqID) {
      if (this.tableData2[reqID].supporters.indexOf(this.investorID) == -1) {
        const _this = this;
        _this.fullscreenLoading = true;
        support(this.proID, reqID)
          .then(() => {
            _this.fullscreenLoading = false;
            _this.$message({
              message: "支持请求成功",
              type: "success",
            });
            _this.$router.go(0);
          })
          .catch((e) => {
            _this.fullscreenLoading = false;
            this.$message.error("支持请求失败");
            console.log(e);
          });
      } else {
        this.$alert("您已支持此请求", "提示", {
          confirmButtonText: "确定",
        });
      }
    },
    handleCollect(reqID) {
      const _this = this;
      _this.fullscreenLoading = true;
      collect(this.proID, reqID)
        .then(() => {
          _this.fullscreenLoading = false;
          _this.$message({
            message: "取得资金成功",
            type: "success",
          });
          _this.$router.go(0);
        })
        .catch((e) => {
          _this.fullscreenLoading = false;
          this.$message.error("取得资金失败");
          console.log(e);
        });
    },
  },
};
</script>

<style>
.el-row {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 5;
  }
}
.el-col {
  border-radius: 5px;
  display: inline-block;
  text-align: justify;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 0px 0;
  background-color: #f9fafc;
  text-align: left;
}
.text {
  font-size: 14px;
  font-family: "微软雅黑";
}

.item {
  margin-bottom: 24px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 60%;
}
</style>
