<template>
  <div>
    <el-row class="gridCommon marginCommon bigFont" style="padding: 20px">
      <el-col span="24">
        <el-row>
          <el-col span="12" class="bigFont marginCommon">全部众筹</el-col>
          <el-col span="12">
            <el-select
              v-model="condition"
              :placeholder="conditions[0].label"
              style="float: right"
            >
              <el-option
                v-for="item in conditions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <div v-if="condition == conditions[0].value">
          <div v-for="i in projects" :key="i.id" class="gridCommon normalFont marginCommon">
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
        </div>
        <div v-else-if="condition == conditions[1].value">
          <div v-for="i in activeProjects" :key="i.id" class="gridCommon normalFont marginCommon">
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
        </div>
        <div v-else-if="condition == conditions[2].value">
          <div v-for="i in deadProjects" :key="i.id" class="gridCommon normalFont marginCommon">
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
        </div>
      </el-col>
    </el-row>
    <!--<img :src="img1">-->
     <div class="flag"></div>
        <div class="content">
            <img :src="img2">
        </div>
    
  </div>
</template>

<script>

import {getAllProjects, addListener} from "../server/serve";

//import pic1 from "../assets/test2.jpg";
import pic2 from "../assets/test.jpg";

export default {
  name: 'ProjectList',
  data() {
    return {
      //img1: pic1,
      img2: pic2,
      projects: [], // 众筹项目清单
      conditions: [
        { value: "全部", label: "全部" },
        { value: "进行中", label: "进行中" },
        { value: "已截止", label: "已截止" },
      ], // 筛选条件
      condition: "",
    };
  },

  computed: {
    activeProjects: function() {
      return this.projects.filter(
        function(project) {
          return (project.isSuccess == false && project.endTime > Date.now() / 1000)
        }
      )
    },

    deadProjects: function() {
      return this.projects.filter(
        function(project) {
          return (project.isSuccess == true || project.endTime <= Date.now() / 1000)
        }
      )
    }
  },

  async created () {
    var that = this
    that.condition = that.conditions[0].value
    async function fetchData() {
      try {
        that.projects = await getAllProjects();
      } catch (e) {
        console.log(e);
        alert("获取众筹信息失败")
      }
    }
    addListener(fetchData)
    fetchData()
  },

  mounted() {
  
     this.conditions = [
        { value: "全部", label: "全部" },
        { value: "进行中", label: "进行中" },
        { value: "已截止", label: "已截止" },
     ];
  },

  methods: {
    
  },
};
</script>

<style scoped>
.page {
  position: relative;
  width: 80%;
  left: 10%;
  background-color: white;
}

.cardWrap {
  margin: 2px;
  padding: 10px;
  background-color: white;
  font-size: 14px;
}
</style>