学生班级列表页
展示加入的所有班级，班级后面显示课程名，展示未完成作业数和小测数

<template>
  <div>
    <el-row class="gridCommon marginCommon bigFont" style="padding: 20px">
      <el-col span="24">
        <el-row>
          <el-col span="12" class="bigFont marginCommon">众筹项目</el-col>
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
  </div>
</template>

<script>
//import func from '../../vue-temp/vue-editor-bridge';
//import axios from 'axios';
//import cookies from 'js-cookie'
import {getAllProjects, addListener} from "../server/serve";

export default {
  name: 'ProjectList',
  data() {
    return {
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
  /*  this.projects = [
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
     this.classesOfCourse = [
       [
         { id: 0, name: "周一678", time: "2020-2021秋冬", stuNum: 42 },
       ],
       [
         { id: 0, name: "周一12", time: "2020-2021秋冬", stuNum: 42 },
       ],
     ];
     this.teachersOfClassOfCourse = [
       [
         [
           { id: 0, name: "许可越" },
           { id: 1, name: "马梓睿" },
         ],
       ],
       [
         [
           { id: 0, name: "许可越2" },
           { id: 1, name: "马梓睿2" },
         ],
       ],
     ];
     this.assitantsOfClassOfCourse = [
       [
         [
           { id: 0, name: "a" },
           { id: 1, name: "b" },
         ],
       ],
       [
         [
           { id: 0, name: "a2" },
           { id: 1, name: "b2" },
         ],
       ],
     ];*/
     this.conditions = [
        { value: "全部", label: "全部" },
        { value: "进行中", label: "进行中" },
        { value: "已截止", label: "已截止" },
     ];

  /*  axios.post('/api', 'method=get&key=course').then(coursesData => {
      let coursesClosure = coursesData.data;
      axios.post('/api', 'method=get&key=class').then(classData => {
        let courses = coursesClosure;
        let classes = classData.data;
        let participatedCourses = {}
        let user = cookies.get('user');
        // console.log(classes)
        for (let i in classes) {
          if (typeof(classes[i].student[user]) !== 'undefined') {
            participatedCourses[courses[classes[i].course].id] = courses[classes[i].course]
          }
        }

        this.courses = []
        for (let i in participatedCourses) {
          let r = {
            id: participatedCourses[i].id,
            name: participatedCourses[i].name,
            info: participatedCourses[i].description,
            img: typeof(participatedCourses[i].img) !== 'undefined' ? participatedCourses[i].img : "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
            classes: []
          }
          for (let j in classes) {
            if (classes[j].course === r.id) {
              if (typeof(classes[j].student[user]) === 'undefined') continue;
              let arr = []
              for (let k in classes[j].teacher) {
                arr.push({id: k, name: classes[j].teacher[k]})
              }
              classes[j].teacher = arr;
              let arr2 = []
              for (let k in classes[j].ta) {
                arr2.push({id: k, name: classes[j].ta[k]})
              }
              classes[j].ta = arr2;
              let num = 0;
              // eslint-disable-next-line no-unused-vars
              for (let k in classes[j].student) {
                num++;
              }
              classes[j].stuNum = num;
              r.classes.push(classes[j]);
            }
          }
          this.courses.push(r)
        }
        // console.log(JSON.stringify(this.courses))
      })
    })*/
  },

  methods: {
    
    /*getQueryVariable(variable) {
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

    goClassDetail(courseID, classID) {
      console.log(courseID, classID)
      this.$router.push('/StudentCourseDetail?id=' + courseID + '&class=' + classID)
    },

    onPostButtonClick() {
      axios({
        method: "get",
        url: "/api?method=add",
      });
    },*/
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