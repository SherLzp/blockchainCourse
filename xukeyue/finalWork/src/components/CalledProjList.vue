<template>
  <div>
    <el-row class="gridCommon">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="bigFont" style="margin: 10px"
            >发起新项目</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form
              ref="newProjForm"
              :model="newProjForm"
              label-width="80px"
              class="gridCommon"
            >
              <el-form-item
                prop="name"
                label="项目名称"
                :rules="[
                  {
                    required: true,
                    message: '项目名称不能为空',
                  },
                ]"
              >
                <el-input v-model="newProjForm.name"></el-input>
              </el-form-item>
              <el-form-item
                prop="deadLine"
                label="截止日期"
                :rules="[
                  {
                    required: true,
                    message: '截止日期不能为空',
                  },
                ]"
              >
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="newProjForm.deadLine"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="目标金额(ETH)"
                :rules="[
                  { required: true, message: '价格不能为空' },
                  { type: 'number', message: '价格必须为数字值' },
                ]"
              >
                <el-input v-model.number="newProjForm.need"></el-input>
              </el-form-item>
              <el-form-item prop="info" label="项目介绍">
                <el-input
                  type="textarea"
                  :rows="5"
                  v-model="newProjForm.info"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('newProjForm')"
                  >创建</el-button
                >
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="gridCommon">
      <el-col :span="24">
        <el-row>
          <el-col :span="24" class="bigFont" style="margin: 10px"
            >您发起的项目</el-col
          >
        </el-row>
        <el-row>
          <el-table :data="calledProjs" border style="width: 100%">
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
                  type="primary"
                  size="small"
                  @click="
                    getMoneyDialogVisible = true;
                    curProj = scope.row;
                  "
                  >提取资金</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="提取资金申请" :visible.sync="getMoneyDialogVisible">
      <el-form
        ref="getMoneyForm"
        :model="getMoneyForm"
        label-width="80px"
        class="gridCommon"
      >
        <el-form-item
          prop="reason"
          label="申请提款理由"
          :rules="[{ required: true, message: '理由不能为空' }]"
        >
          <el-input
            type="textarea"
            :rows="5"
            v-model="getMoneyForm.reason"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="money"
          label="提款量"
          :rules="[
            { required: true, message: '价格不能为空' },
            { type: 'number', message: '价格必须为数字值' },
          ]"
        >
          <el-input v-model.number="getMoneyForm.money"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('getMoneyForm')"
            >申请</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Web3 from 'web3';
//import Crowdfunding from '../Crowdfunding.json'

export default {
  name: "CalledProjList",

  data() {
    return {
      currentAddress: "",

      calledProjs: [],

      newProjForm: {
        name: "",
        deadLine: "",
        need: 0,
        info: "",
      },
      getMoneyForm: {
        reason: "",
        money: 0,
      },

      curProj: 0,
      getMoneyDialogVisible: false,
    };
  },

  mounted() {
    // this.calledProjs = [
    //   { name: "ddddd", deadLine: "2018" },
    //   { name: "ccccc", deadLine: "2018" },
    // ];
  },

  beforeCreate() {
    this.GLOBAL.methods.addAccountChangeListener(async () => {
      //console.log("update");
      this.update();
    });
  },

  created() {
    this.update();
  },

  methods: {
    async update() {
      if (this.GLOBAL.inCallback == false) {
        this.GLOBAL.inCallback = true;
        await this.getCalledProjs();
        this.GLOBAL.inCallback = false;
      }
    },

    async getCalledProjs() {
      let globalProjListLen = await this.GLOBAL.contract.methods
        .globalProjListLen()
        .call();
      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      let account = accounts[0];

      this.calledProjs = [];
      for (let i = 1; i <= globalProjListLen; i++) {
        let proj = await this.GLOBAL.contract.methods.globalProjList(i).call();

        if (account != proj.caller) continue;
        
        console.log(new Date(proj.deadLine * 1000));
        let ddl = new Date(proj.deadLine * 1000);
        let curTime = new Date();
        let status = "完成";
        if (proj.isFinished == false) {
          if (ddl > curTime) status = "未完成";
          else status = "已过期";
        }
        this.calledProjs.push({
          id: i,
          name: proj.name,
          need: Web3.utils.fromWei(proj.need),
          curFund: Web3.utils.fromWei(proj.curFund),
          deadLine: ddl.toString(),
          status: status,
        });
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          alert("submit: " + formName);
          if (formName == "newProjForm") {
            let h = new Date(this.newProjForm.deadLine).getTime() / 1000;
            let accounts = await this.GLOBAL.web3.eth.getAccounts();
            let account = accounts[0];
            try {
              // console.log(this.newProjForm.deadLine);
              // console.log(h);
              // console.log(accounts);
              // console.log(account);
              await this.GLOBAL.contract.methods
                .createProject(
                  account,
                  this.newProjForm.name,
                  this.newProjForm.info,
                  Web3.utils.toWei(this.newProjForm.need.toString(10),'ether'),
                  h
                )
                .send({
                  from: account,
                  gas: 1000000,
                });
              alert("发起众筹成功");
              this.update();
            } catch (e) {
              alert("发起众筹失败");
            }
          } else if (formName == "getMoneyForm") {
            alert("啊");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>