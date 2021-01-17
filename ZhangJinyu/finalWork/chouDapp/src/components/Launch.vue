<template>
  <div class="page">
    <div class="head"></div>
    <div class="gridCommon">
        <el-form ref="form" :model="form" label-width="100px">
        <el-form-item required="true" label="项目名称">
            <el-input v-model="form.title" maxlength="20" placeholder="不超过20字"></el-input>
        </el-form-item>
        <el-form-item required="true" label="目标金额">
            <el-input type="number" min="0" placeholder="输入目标金额(ETH)" v-model="form.target"></el-input>
        </el-form-item>
        <el-form-item required="true" label="截止时间">
            <el-date-picker type="datetime" value-format="timestamp" :picker-options="pickerOptions" @change="limitTime" placeholder="选择截止时间" v-model="form.endTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目简介">
            <el-input type="textarea" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">开始众筹</el-button>
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
import { launch, getAccount } from '../server/serve'
  export default {
  name: 'Launch',
    data() {
      return {
        form: {
          title: '',
          initiator:'',
          target: 0,
          endTime: 0,
          introduction: ''
        },

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now()-1 * 24 * 3600 * 1000
          },
        },
      }
    },

    async created () {
     // var that = this
      
    },

    methods: {
      onCancel(){
          this.$router.go(-1)
      },

      limitTime() {
        var startAt = new Date(this.form.endTime) * 1000 /1000;
          if(startAt < Date.now()) {
            this.form.endTime = new Date();
          }
      },

      async onSubmit() {
        if(this.form.title.split(" ").join("").length == 0) {
          alert("项目名称不能为空")
          return
        }
        if(this.form.target == null) {
          alert("目标金额不能为空")
          return
        }
        if(this.form.target <= 0) {
          alert("目标金额须大于0")
          return
        }
        if(this.form.endTime == 0 || this.form.endTime == null) {
          alert("截止时间不能为空")
          return
        }
        this.form.initiator = await getAccount();
        const seconds = Math.ceil(new Date(this.form.endTime).getTime() / 1000);
        try {
          const res = await launch(this.form.initiator, this.form.title, this.form.introduction, this.form.target, seconds);
          console.log(res)
          alert("发起众筹成功")
          this.$router.go(-1);
        } catch(e) {
          console.log(e);
          alert("发起众筹失败")
        }
        /*let out = {
          title: this.form.title,
          initiator: this.$uuid.v4(),
          isMajor: this.form.category,
          startDate: this.form.date1,
          endDate: this.form.date2,
          thisMajor: this.form.only,
          description: this.form.desc,
          teacher: this.form.teacher
        }
        axios.post('/api', 'method=setj&key=course.' + out.id + "&val=" + encodeURIComponent(JSON.stringify(out)))
          .then(() => {
            alert("发起众筹成功，众筹项目ID为" + out.id);
          })*/
      },
    }
  }
</script>

<style scoped>

</style>