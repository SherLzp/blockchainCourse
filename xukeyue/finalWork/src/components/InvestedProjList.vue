<template>
  <div>
    <el-row :gutter="10" class="gridCommon">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="bigFont" style="margin: 10px"
            >您投资的项目</el-col
          >
        </el-row>
        <el-row>
          <el-table :data="investedProjs" border style="width: 100%">
            <el-table-column fixed prop="name" label="项目名称" width="200">
            </el-table-column>
            <el-table-column prop="deadLine" label="截止日期" width="200">
            </el-table-column>
            <el-table-column prop="id" label="项目号" width="150">
            </el-table-column>
            <el-table-column prop="need" label="目标金额(ETH)" width="120">
            </el-table-column>
            <el-table-column prop="myFunding" label="您的份额" width="120">
            </el-table-column>
            <el-table-column prop="status" label="项目状态" width="120">
            </el-table-column>
            <el-table-column prop="curFund" label="已筹到" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  @click="withdraw(scope.row)"
                  type="danger"
                  size="small"
                  >赎回</el-button
                >
                <el-button
                  @click="curProj = investedProjs[scope.row]"
                  type="primary"
                  size="small"
                  >参与表决</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-col :span="24" class="bigFont" style="margin: 10px"
            >可投资的项目</el-col
          >
        </el-row>
        <el-row>
          <el-table :data="investibleProjs" border style="width: 100%">
            <el-table-column fixed prop="name" label="项目名称" width="200">
            </el-table-column>
            <el-table-column prop="deadLine" label="截止日期" width="200">
            </el-table-column>
            <el-table-column prop="id" label="项目号" width="150">
            </el-table-column>
            <el-table-column prop="need" label="目标金额(ETH)" width="120">
            </el-table-column>
            <el-table-column prop="status" label="项目状态" width="120">
            </el-table-column>
            <el-table-column prop="curFund" label="已筹到" width="120">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="onInvestBtnClick(scope.row)"
                  type="danger"
                  size="small"
                  >投资</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="资助项目" :visible.sync="investDialogVisible">
      <!-- <el-row class="gridCommon">
        <span>{{ findProjOf(curProj).info }}</span>
      </el-row> -->
      <el-row>
        <el-form
          ref="investForm"
          :model="investForm"
          label-width="80px"
          class="gridCommon"
        >
          <el-form-item
            prop="money"
            label="投资金额"
            :rules="[
              { required: true, message: '价格不能为空' },
              { type: 'number', message: '价格必须为数字值' },
            ]"
          >
            <el-input v-model.number="investForm.money"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('investForm')"
              >投资</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  name: "InvestedProjList",

  data() {
    return {
      investedProjs: [],
      investibleProjs: [],
      allProjs: [],
      investForm: {
        money: 0,
      },
      curProj: {},
      investDialogVisible: false,
    };
  },

  beforeCreate() {
    this.GLOBAL.methods.addAccountChangeListener(async () => {
      console.log("update");
      this.update();
    });
  },

  created() {
    console.log("created");
    this.update();
  },

  mounted() {},

  methods: {
    async update() {
      if (this.GLOBAL.inCallback == false) {
        this.GLOBAL.inCallback = true;
        await this.getAllProjs();
        await this.findProjsOfCurAccount();
        this.GLOBAL.inCallback = false;
      }
    },

    async getAllProjs() {
      let globalProjListLen = await this.GLOBAL.contract.methods
        .globalProjListLen()
        .call();

      this.allProjs = [];
      this.investibleProjs = [];
      for (let i = 1; i <= globalProjListLen; i++) {
        let proj = await this.GLOBAL.contract.methods.globalProjList(i).call();

        let ddl = new Date(proj.deadLine * 1000);
        let curTime = new Date();
        let status = "完成";
        if (proj.isFinished == false) {
          if (ddl > curTime) status = "未完成";
          else status = "已过期";
        }
        let line = {
          id: i,
          name: proj.name,
          need: Web3.utils.fromWei(proj.need),
          curFund: Web3.utils.fromWei(proj.curFund),
          deadLine: ddl.toString(),
          status: status,
        };
        this.allProjs.push(line);
        if (line.status == "未完成") this.investibleProjs.push(line);
      }
    },

    async findProjsOfCurAccount() {
      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      let account = accounts[0];

      this.investedProjs = [];
      for (let i = 0; i < this.allProjs.length; i++) {
        let myFunding = await this.GLOBAL.contract.methods
          .getTotFundingOf(account, parseInt(this.allProjs[i].id))
          .call();
        this.allProjs[i].myFunding = Web3.utils.fromWei(myFunding, "ether");
        if (myFunding > 0) this.investedProjs.push(this.allProjs[i]);
      }
    },

    async withdraw(row) {
      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      let account = accounts[0];

      try {
        await this.GLOBAL.contract.methods.withdraw(row.id).send({
          from: account,
          gas: 1000000,
        });
        alert("赎回成功");
        this.update();
      } catch (e) {
        alert("赎回失败");
      }
    },

    onInvestBtnClick(row) {
      this.curProj = row;
      this.investDialogVisible = true;
    },

    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          alert("submit: " + formName);
          if (formName == "investForm") {
            let accounts = await this.GLOBAL.web3.eth.getAccounts();
            let account = accounts[0];

            try {
              await this.GLOBAL.contract.methods.fund(this.curProj.id).send({
                from: account,
                value: Web3.utils.toWei(
                  this.investForm.money.toString(10),
                  "ether"
                ),
              });
              alert("投资成功");
              this.update();
            } catch (e) {
              alert("投资失败");
            }
            this.investDialogVisible = false;
          }
        }
      });
    },
  },
};
</script>