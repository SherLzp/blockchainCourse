众筹详情页

<template>
  <div class="page">
    <div class="gridCommon bigFont">{{project.title}}</div>
      <el-row class="gridCommon normalFont marginCommon" style="padding: 20px">
        众筹项目信息
        <div class="marginCommon smallFont gridCommon">
          <el-row style="padding: 10px">
            <el-col :span="10">项目名称：{{project.title}}</el-col>
            <el-col :span="4">目标金额：{{project.target}}(ETH)</el-col>
            <el-col :span="4">当前金额：{{project.raised}}(ETH)</el-col>
            <el-col :span="4" v-if="project.isSuccess == true">状态：<a style="color:green">筹款成功</a></el-col>
            <el-col :span="4" v-else-if="project.endTime <= Date.now() / 1000">状态：<a style="color:red">已截止</a></el-col>
            <el-col :span="4" v-else>状态：进行中</el-col>
          </el-row>
          <el-row style="padding: 10px">
            <el-col :span="10">项目发起人：{{project.initiator}}</el-col>
            <el-col :span="4">投资人数：{{project.fundersAmount}}</el-col>
            <el-col :span="4">资金使用数目：{{project.withdrawalsAmount}}</el-col>
            <el-col :span="6">截止时间：{{project.endTimeStr}}</el-col>
          </el-row>
        </div> 
      </el-row>
      <el-row class="gridCommon normalFont marginCommon" style="padding: 20px">
        众筹项目简介
        <div class="marginCommon smallFont gridCommon">
          <el-row>
            <el-col :span="24">{{project.introduction}}</el-col>
          </el-row>
        </div> 
      </el-row>
      <el-row v-if="account!=project.initiator" class="gridCommon normalFont marginCommon" style="padding: 20px">
            我的投资
            <div class="marginCommon smallFont gridCommon">
              <el-row>
                <el-col :span="22">我投资了：{{myAmount}}(ETH)</el-col>
                <el-col :span="2" v-if="(project.isSuccess == false && project.endTime <= Date.now() / 1000) && myAmount > 0">
                  <div>
                    <div class="marginCommon myButton" style="float:right;" v-on:click="onRefund">赎回</div>
                  </div>
                </el-col>
              </el-row>
              <el-row v-if="project.isSuccess == false && project.endTime > Date.now() / 1000">
                <el-col :span="22">
                  <input class="marginCommon myScoreTextBox" type = "number" :min = "minAmount" :max = "maxAmount" placeholder = "投资金额(ETH)" v-model="fundAmount"/>
                </el-col>
                <el-col :span="2">
                  <div style="height: 24px; position: relative;">
                    <div class="marginCommon myButton" style="float:right;" v-on:click="onFund">投资</div>
                  </div>
                </el-col>
              </el-row>
            </div> 
      </el-row>
      <el-row v-if="project.isSuccess == true && (myAmount > 0 || account == project.initiator)" class="gridCommon normalFont marginCommon" style="padding: 20px">
        资金使用情况  
        <router-link v-if="account == project.initiator" :to="'/RequestWithdrawal' + '?id=' + project.index">    
          <a class="stressFontColor" style="text-decoration: none; float:right;">请求使用</a>
        </router-link>
          <div v-for="i in withdraws" :key="i.id" class="marginCommon smallFont gridCommon">
            <el-row class="marginCommon">
              <el-col :span="24">使用目的：{{i.purpose}}</el-col>
            </el-row>
            <el-row class="marginCommon">
              <el-col :span="4">使用金额：{{i.amount}}</el-col>
              <el-col :span="4">同意：{{i.agree / project.target * 100}}%</el-col>
              <el-col :span="4">不同意：{{i.disagree / project.target * 100}}%</el-col>
              <el-col :span="4" v-if="i.isEnd == true && i.agree >= project.target / 2">状态：<a style="color:green">已批准</a></el-col>
              <el-col :span="4" v-else-if="i.isEnd == true && i.disagree >= project.target / 2">状态：<a style="color:red">已否决</a></el-col>
              <el-col :span="4" v-else>状态：投票中</el-col>
              <el-col :span="4" v-if="account!=project.initiator">
                我的投票：
                <a v-if="i.votes == 0">未投票</a>
                <a v-else-if="i.votes == 1">同意</a>
                <a v-else>不同意</a>
              </el-col>
              <el-col :span="2" v-if="(i.votes == 0 || i.votes == 2) && i.isEnd == false && account!=project.initiator && myAmount > 0">
                <div class="myButton" style="float:right;" v-on:click="onVote(true, i.index)">同意</div>
              </el-col>
              <el-col :span="2" v-if="(i.votes == 0 || i.votes == 1) && i.isEnd == false && account!=project.initiator && myAmount > 0">
                <div class="myButton" style="float:right;" v-on:click="onVote(false, i.index)">不同意</div>
              </el-col>
            </el-row>
          </div>
      </el-row>
  </div>
</template>

<script>
//import axios from 'axios';
import {getMyFundAmount, getProject, getAccount, addListener, fund, refund, getAllWithdrawalVote, vote} from '../server/serve'

export default {
  name: 'ProjectDetail',
  data() {
    return {
      account: 0,
      project: {},
      withdraws: [],
      myAmount: 0,
      fundAmount: 0,
      minAmount: 0,
      maxAmount: 0,
    }
  },

  async created () {
    var that = this
    addListener(that.fetchData)
    that.fetchData()
  },

  mounted() {
    /*this.title = "体育",   // 项目概述
         this.introduction= "体育课众筹",   // 项目简介
         this.initiator= "0xasd",  // 众筹发起人
         this.fundersAmount= 12, // 投资人数
         this.endTime= 16928158,   // 众筹截止时间
         this.target= 120,    // 众筹目标金额
         this.raised= 100,    // 已筹集金额
         this.isSuccess= false, // 是否成功标记
         this.withdrawalsAmount= 0, // 资金使用数
         this.detailLink= '/StudentCourseDetail'
    // this.courseId = "21194584";
    // this.courseName = "软件需求工程";
    // this.title = this.courseName;
    // this.courseDepartment = "软件学院";
    // this.courseSession = "2020-2021 秋冬";
    // this.courseDate = "2020-09-01";
    // this.courseTeacher = [
    //   {id: 1, user: "邢卫", userLink: "/"},
    //   {id: 2, user: "刘玉生", userLink: "/"},
    // ];
    // this.courseBrief = "软件需求工程是最好的一门课！";
    this.courseMaterials = [
      {id: 1, name: "UML课件"},
      {id: 2, name: "需求课件"},
    ];
    this.videos= [
      {id: 1, name: "UML课件"},
      {id: 2, name: "需求课件"},
    ];
    // this.courseHomework = [
    //   {id: 1, name: "作业一", form: "个人作业", state: "未交", startTime:"2020-12-20 11:30", endTime: "2020-12-25 11:30", score : "0", detailLink : "/StudentHomework"},
    //   {id: 2, name: "作业二", form: "个人作业", state: "已交", startTime:"2020-12-20 11:30", endTime: "2020-12-25 11:30", score : "100", detailLink : "/StudentHomework"},
    // ];
    // this.courseQuiz = [
    //   {id: 1, name: "测试一", questionNumber: "5", state: "未交", startTime:"2020-12-20 11:30", endTime: "2020-12-25 11:30", score : "0", detailLink : "/StudentTestDetail"},
    //   {id: 2, name: "测试二", questionNumber: "10", state: "已交", startTime:"2020-12-20 11:30", endTime: "2020-12-25 11:30", score : "100", detailLink : "/StudentTestDetail"},
    // ];

    let courseID = this.getQueryVariable('id');
    let classID = this.getQueryVariable('class')

    axios.post('/api', 'method=get&key=course.' + courseID).then(res => {
      axios.post('/api', 'method=get&key=class.' + classID).then(rec => {
        let courseData = res.data;
        let classData = rec.data;
        this.courseId = courseData.id;
        this.courseName = courseData.name;
        this.className = classData.name
        this.courseMajor = courseData.isMajor ? "专业课" : "通识课"
        this.courseSession = classData.time;
        this.courseDate = new Date(courseData.startDate).toLocaleDateString()
        this.courseTeacher = []
        for (let i in classData.teacher) {
          this.courseTeacher.push({
            id: i,
            user: classData.teacher[i],
            userLink: ''
          })
        }
        this.courseBrief = courseData.description;
        this.title = courseData.name + " " + classData.name
        for (let i in classData.homework) {
          let o = classData.homework[i]
          this.courseHomework.push({
            id: i,
            name: o.name,
            form: o.isGroup ? "分组作业" : "个人作业",
            state: "未交",
            endTime: new Date(o.deadline).toLocaleString(),
            score: '',
            detailLink: '/StudentHomework?class=' + classID + '&homework=' + i
          })
        }
        for (let i in classData.test) {
          let o = classData.test[i]
          this.courseQuiz.push({
            id: i,
            name: o.name,
            time: o.quizTime,
            state: "未交",
            startTime: new Date(o.startTime).toLocaleString(),
            score: '',
            detailLink: '/StudentTestDetail?class=' + classID + '&test=' + i
          })
        }
      })
    })*/
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
      let index = this.getQueryVariable("id")
      try {
        this.account = await getAccount()
        this.project = await getProject(index)
        this.myAmount = await getMyFundAmount(index)
        this.minAmount = 0.01 
        this.maxAmount = this.project.target - this.project.raised
      } catch (e) {
        console.log(e);
        alert("获取项目数据失败")
      }
      try {
        this.withdraws = await getAllWithdrawalVote(index);
      } catch (e) {
        console.log(e);
        alert("获取使用请求失败");
      }
    },

    async onFund() {
      if(this.fundAmount == null) {
        alert("请输入投资金额")
        return
      }
      if(this.fundAmount <= 0) {
        alert("投资金额须大于0")
        return
      }
      if(this.fundAmount > this.maxAmount) {
        alert("投资金额须小于项目当前所需最大金额")
        return
      }
      if(this.account == this.project.initiator) {
          alert("发起人不能参与众筹")
          return
        }
      try {
          await fund(this.project.index, this.fundAmount);
          alert('投资成功')
          this.fetchData()
        } catch (e) {
          console.log(e);
          alert('投资失败')
        }
    },

    async onRefund() {
      if(this.account == this.project.initiator) {
          alert("发起人不能参与众筹")
          return
        }
      try {
        await refund(this.project.index)
        alert('赎回成功')
        this.fetchData()
      } catch(e) {
        console.log(e)
        alert('赎回失败')
      }
    },

    async onVote(agree, index) {
      try {
        await vote(this.project.index, index, agree);
        alert('投票成功')
        this.fetchData();
      } catch (e) {
        console.log(e);
        alert('投票失败')
      }
    }
    /*onPostButtonClick() {
      axios({
        method: 'get',
        url: '/api?method=add'
      });
    },

    onDownloadButtonClick() {

    },

    onVideoButtonClick() {

    }*/
  }
}
</script>

<style scoped>
.myButton {
  padding: 5px 10px;
  border: 1px solid;
  border-radius: 3px;
  background-color: #fff;
  color: #00bbbd;
  border-color: #00bbbd;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}
.myScoreTextBox {
  width: calc(100%);
  height: 8px;
  border: 1px solid;
  border-radius: 3px;
  border-color: #006b6d;
  padding: 10px;
  font-size: 13px;
  resize: vertical;
}
</style>