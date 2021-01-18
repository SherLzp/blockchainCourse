我的众筹页面

<template>
  <div>
    <el-row class="gridCommon marginCommon bigFont" style="padding: 20px">
      <el-col span="24" class="paddingCommon">
        <el-tabs>
          <el-tab-pane label="我参与的">
            <div v-for="i in projectsAttend" :key="i.id" class="marginCommon normalFont gridCommon">
                <el-row>
                  <el-col :span="7">项目名称：{{i.title}}</el-col>
                  <el-col :span="4">目标金额：{{i.target}}(ETH)</el-col>
                  <el-col :span="4">当前金额：{{i.raised}}(ETH)</el-col>
                  <el-col :span="5">截止时间：{{i.endTimeStr}}</el-col>
                  <el-col :span="3" v-if="i.isSuccess == true">状态：<a style="color:green">筹款成功</a></el-col>
                  <el-col :span="3" v-else-if="i.endTime <= Date.now() / 1000">状态：<a style="color:red">已截止</a></el-col>
                  <el-col :span="3" v-else>状态：进行中</el-col>
                  <el-col :span="1">
                    <router-link :to="'/ProjectDetail' + '?id=' + i.index">
                      <a class="stressFontColor" style="text-decoration: none; float:right">详情</a>
                    </router-link>
                  </el-col>
                </el-row>
              </div>
          </el-tab-pane>
          <el-tab-pane label="我发起的">
              <div v-for="i in projectsCreate" :key="i.id" class="marginCommon normalFont gridCommon">
                <el-row>
                  <el-col :span="7">项目名称：{{i.title}}</el-col>
                  <el-col :span="4">目标金额：{{i.target}}(ETH)</el-col>
                  <el-col :span="4">当前金额：{{i.raised}}(ETH)</el-col>
                  <el-col :span="5">截止时间：{{i.endTimeStr}}</el-col>
                  <el-col :span="3" v-if="i.isSuccess == true">状态：<a style="color:green">筹款成功</a></el-col>
                  <el-col :span="3" v-else-if="i.endTime <= Date.now() / 1000">状态：<a style="color:red">已截止</a></el-col>
                  <el-col :span="3" v-else>状态：进行中</el-col>
                  <el-col :span="1">
                    <router-link :to="'/ProjectDetail' + '?id=' + i.index">
                      <a class="stressFontColor" style="text-decoration: none; float:right">详情</a>
                    </router-link>
                  </el-col>
                </el-row>
              </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/*import axios from 'axios';
import cookies from 'js-cookie';*/
import {getMyProjects, addListener} from "../server/serve"
import {useRouter} from 'vue-router'


export default {
  name: 'MyProject',
  data() {
    return {
      projectsAttend: [], // 参与众筹项目清单
      projectsCreate: [], // 发起众筹项目清单
    }
  },

  async created () {
    var that = this
    async function fetchData() {
      try {
        const res = await getMyProjects();
        console.log(res)
        that.projectsCreate = res.init
        that.projectsAttend = res.contr
      } catch (e) {
        console.log(e);
        alert("获取众筹信息失败")
      }
    }
    addListener(fetchData)
    fetchData()
  },

  mounted() {
    /*this.projects = [
      {
        id: 0,
        title: "体育",   // 项目概述
        introduction: "体育课众筹",   // 项目简介
        initiator: "0xasd",  // 众筹发起人
        fundersAmount: 12, // 投资人数
        endTime: 16928158,   // 众筹截止时间
        target: 120,    // 众筹目标金额
        raised: 100,    // 当前金额
        isSuccess: false, // 是否成功标记
        withdrawalsAmount: 0, // 资金使用数
        detailLink: '/StudentCourseDetail'
       },
     ];

    let classID = this.getQueryVariable('class')
    let homeworkID = this.getQueryVariable('homework')
    axios.post('/api', 'method=get&key=class.' + classID).then(res => {
      let classData = res.data;
      let homework = classData.homework[homeworkID]
      this.homeworkName = homework.name;
      this.title = homework.name
      this.homeworkEndTime = new Date(homework.deadline).toLocaleString()
      this.homeworkForm = homework.isGroup ? "分组作业" : "个人作业"
      this.homeworkContenta = homework.description
      this.homeworkData = homework.file[0]
      this.myHomework = []
      for (let i in homework.submits) {
        let o = homework.submits[i]
        this.myHomework.push({
          id: o.id,
          submitTime: new Date(o.time).toLocaleString(),
          score: o.score === null ? "未评分" : o.score,
          detail: o.content,
          file: o.file
        })
      }
    })*/
  },

  methods: {
    /*getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
              var pair = vars[i].split("=");
              if(pair[0] == variable){return pair[1];}
      }
      return false;
    },

    onPostButtonClick() {
      axios({
        method: 'get',
        url: '/api?method=add'
      });
    },

    dataUploadSuccess(res) {
      this.file = res
    },

    onDownloadHomeworkButtonAClick() {
      window.open('/data/' + this.homeworkData);
    },

    onDownloadButtonClick(node) {
      window.open('/data/' + node.file);
    },

    onUploadButtonClick() {

    },

    onSubmitButtonClick() {
      let toUpload = {
        id: this.$uuid.v4(),
        user: cookies.get('user'),
        file: this.file,
        content: this.homeworkDescription,
        time: new Date().toJSON(),
        score: null
      }
      axios.post('/api', 'method=setj&key=class.' + this.getQueryVariable('class') + '.homework.' + this.getQueryVariable('homework') + '.submits.' + toUpload.id + '&val=' + 
        encodeURIComponent(JSON.stringify(toUpload))).then(() => {
          this.$message.success("上传成功");
          // setTimeout(() => {this.$router.go(-1)}, 500)
        })
    },*/

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
.myPostContentTextBox {
  width: calc(100% - 21px);
  height: 100px;
  border: 1px solid;
  border-radius: 3px;
  border-color: #006b6d;
  padding: 10px;
  font-size: 13px;
  resize: vertical;
}
</style>