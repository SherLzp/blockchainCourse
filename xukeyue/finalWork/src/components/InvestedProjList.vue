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
                  @click="onVoteBtnClick(scope.row)"
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
    <el-dialog title="表决资金申请" :visible.sync="voteDialogVisible">
      <el-row class="gridCommon">
        <el-row>
          <span>{{ curProj.name }} 项目中的资金申请</span>
        </el-row>
        <el-row>
          <el-table
            :data="appliedUses"
            border
            style="width: 100%"
            max-height="250"
          >
            <el-table-column fixed prop="reason" label="提取理由" width="300">
            </el-table-column>
            <el-table-column prop="money" label="提取金额(ETH)" width="50">
            </el-table-column>
            <el-table-column prop="agree" label="我的表决" width="100">
            </el-table-column>
            <el-table-column prop="status" label="申请状态" width="100">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="vote(scope.row, true)"
                  >批准</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="vote(scope.row, false)"
                  >否决</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
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
      investedProjs: [], // 已投资的众筹
      investibleProjs: [], // 可投资的众筹
      appliedUses: [],
      allProjs: [], // 所有众筹
      // 表单
      investForm: {
        money: 0,
      },
      curProj: {}, // 当前选中的众筹项目
      // 对话框可见性
      investDialogVisible: false,
      voteDialogVisible: false,
    };
  },

  beforeCreate() {
    this.GLOBAL.methods.addAccountChangeListener(async () => {
      //console.log("update");
      this.update();
    });
  },

  created() {
    //console.log("created");
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

    async onVoteBtnClick(row) {
      this.curProj = row;

      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      let account = accounts[0];

      let num = await this.GLOBAL.contract.methods
        .getUseLenOf(this.curProj.id)
        .call();

      this.appliedUses = [];
      for (let i = 1; i <= num; i++) {
        try {
          let line = await this.GLOBAL.contract.methods
            .getUseOf(account, this.curProj.id, i)
            .call();

          let status = "待定";
          if (line[2] == 1) status = "通过";
          else if (line[2] == 2) status = "否决";

          let agree = "待定";
          if (line[3] == 1) agree = "通过";
          else if (line[3] == 2) agree = "否决";

          this.appliedUses.push({
            reason: line[0],
            money: Web3.utils.fromWei(line[1], "ether"),
            status: status,
            agree: agree,
            id: i,
          });
        } catch (e) {
          console.log("error");
        }
      }
      this.voteDialogVisible = true;
    },

    async vote(row, agree) {
      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      let account = accounts[0];

      try{
        console.log(row.id);
        console.log(this.curProj.id);
        console.log(agree);
        await this.GLOBAL.contract.methods.agreeUse(this.curProj.id, row.id, agree).send({
          from: account,
          gas: 1000000,
        })
        if(agree == true)
          alert("同意申请，表决成功");
        else 
          alert("否决申请，表决成功");
      }catch(e){
        alert("表决失败");
      }
      this.voteDialogVisible = false;
    },

    onInvestBtnClick(row) {
      this.curProj = row;
      this.investDialogVisible = true;
    },

    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //alert("submit: " + formName);
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