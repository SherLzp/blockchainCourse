<template>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="项目名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="众筹金额">
      <el-input v-model="form.sum"></el-input>
    </el-form-item>
    <el-form-item label="项目介绍">
      <el-input v-model="form.introduction"></el-input>
    </el-form-item>
    <el-form-item label="截止时间">
      <el-col :span="11">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="form.date"
          value-format="timestamp"
          style="width: 100%"
        ></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
//import Web3 from 'web3';
export default {
  data() {
    return {
      form: {
        name: "",
        sum: 0,
        introduction: "",
        date: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      console.log("submit!");
      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      let account = accounts[0];
      try {
              console.log(this.form.name);
              console.log(this.form.sum);
              console.log(this.form.introduction);
              console.log(this.form.date);
              console.log(account);
              await this.GLOBAL.contract.methods
                .newFunding(
                  this.form.name,
                  this.form.introduction,
                  account,
                  this.form.sum,
                  this.form.date
                )
                .send({
                  from: account,
                  gas: 1000000,
                });
              alert("发起众筹成功");
          }catch (e) {
            console.log(e)
            alert("发起众筹失败");
          }
    },
  },
};
</script>