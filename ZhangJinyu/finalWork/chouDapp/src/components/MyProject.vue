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
  },

  methods: {
  }
}
</script>

<style scoped>
.myButton {
  padding: 5px 10px;
  border: 1px solid;
  border-radius: 3px;
  background-color: #fff;
  color: #008039;
  border-color: #008039;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}
.myPostContentTextBox {
  width: calc(100% - 21px);
  height: 100px;
  border: 1px solid;
  border-radius: 3px;
  border-color: #008039;
  padding: 10px;
  font-size: 13px;
  resize: vertical;
}
</style>