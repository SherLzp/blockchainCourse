<template>
  <div class="page">
    <div class="head"></div>
    <div class="gridCommon">
        <el-form ref="form" :model="form" label-width="100px">
        <el-form-item required="true" label="使用金额">
            <el-input type="number" :min="0.01" :max="project.raised" placeholder="输入使用金额(ETH)" v-model="form.target"></el-input>
        </el-form-item>
        <el-form-item label="使用目的">
            <el-input required="true" type="textarea" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">请求使用</el-button>
            <el-button @click="onCancel">取消</el-button>
        </el-form-item>
        </el-form>   
    </div>
    <div class="tail">
    </div>
  </div>
</template>

<script>
//import axios from 'axios'
import { requestWithdrawal, getAccount, addListener, getProject } from '../server/serve'
  export default {
  name: 'RequestWithdrawal',
    data() {
      return {
        form: {
          target: 0,
          introduction: ''
        },
        account: 0,
        project: {},

      }
    },

    async created () {
      var that = this
      addListener(that.fetchData)
      that.fetchData()  
    },

    methods: {
      getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          if (pair[0] == variable) {
            return pair[1];
          }
        }
        return false;
      },

      async fetchData() {
        try {
          this.account = await getAccount()
        } catch (e) {
          console.log(e);
          alert("获取账户信息失败")
          this.$router.push("/")
          return
        }
        try {
          let index = this.getQueryVariable("id")
          this.project = await getProject(index)
        } catch (e) {
          console.log(e);
          alert("获取项目信息失败")
          this.$router.push("/")
          return
        }
      },

      onCancel(){
          this.$router.go(-1)
      },

      async onSubmit() {
        if(this.form.introduction.split(" ").join("").length == 0) {
          alert("使用目的不能为空")
          return
        }
        if(this.form.target == null) {
          alert("使用金额不能为空")
          return
        }
        if(this.form.target <= 0) {
          alert("使用金额须大于0")
          return
        }
        if(this.form.target > this.project.raised) {
          alert("使用金额超出筹集金额")
          return
        }
        if(this.account != this.project.initiator) {
          alert("只有发起人能请求使用资金")
          return
        }
        try {
          await requestWithdrawal(this.project.index, this.form.target, this.form.introduction);
          alert('发起请求成功')
          this.$router.go(-1);
        } catch (e) {
          console.log(e)
          alert('发起请求失败')
        }
      },
    }
  }
</script>
<style scoped>
</style>