<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="我发起的" name="init">
      <el-table
        v-loading="loading"
        :data="
          tableData.filter(
            (data) => !search || data.title.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column label="项目编号" prop="proID" width="100"> </el-table-column>
        <el-table-column label="项目名称" prop="title"> </el-table-column>
        <el-table-column label="众筹目标(Finney)" prop="goal"> </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="200"> </el-table-column>
        <el-table-column label="结束时间" prop="endTime" width="200"> </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getType(scope.row.status)" disable-transitions>{{
              scope.row.status == ""
                ? "进行中"
                : scope.row.status == "success"
                ? "成功"
                : "失败"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入以搜索" />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >详细信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="我投资的" name="part"
      ><el-table
        v-loading="loading"
        :data="
          tableData2.filter(
            (data) => !search || data.title.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <el-table-column label="项目编号" prop="proID" width="100"> </el-table-column>
        <el-table-column label="项目名称" prop="title"> </el-table-column>
        <el-table-column label="众筹目标(Finney)" prop="goal"> </el-table-column>
        <el-table-column label="开始时间" prop="startTime" width="200"> </el-table-column>
        <el-table-column label="结束时间" prop="endTime" width="200"> </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getType(scope.row.status)" disable-transitions>{{
              scope.row.status == ""
                ? "进行中"
                : scope.row.status == "success"
                ? "成功"
                : "失败"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="输入以搜索" />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >详细信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="发起众筹" name="create">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        align="left"
      >
        <el-form-item label="发起人">
          {{ account }}
        </el-form-item>
        <el-form-item label="众筹名称" prop="title" style="width: 50%">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="众筹描述" prop="description" style="width: 50%">
          <el-input type="textarea" :rows="5" v-model="ruleForm.description"></el-input>
        </el-form-item>
        <el-form-item label="目标金额" prop="goal">
          <el-input-number v-model="ruleForm.goal" :min="1"></el-input-number> (单位：
          Finney)
        </el-form-item>
        <el-form-item label="众筹时长" prop="duration">
          <el-input-number
            v-model="ruleForm.duration"
            :min="1"
            :max="30"
          ></el-input-number>
          (单位： 天)
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getCurrentAddress } from "../contract.js";
import {
  login,
  createProject,
  getFundList,
  getStatus,
  getRelated,
  getProList,
} from "../contractService.js";

export default {
  data() {
    return {
      tableData: [],
      tableData2: [],
      search: "",
      loading: true,
      activeName: "init",
      ruleForm: {
        title: "",
        description: "",
        goal: 1,
        duration: 1,
      },
      rules: {
        title: [
          { required: true, message: "请输入众筹名称", trigger: "blur" },
          { min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入众筹项目描述", trigger: "blur" },
          { min: 3, max: 500, message: "长度在 3 到 500 个字符", trigger: "blur" },
        ],
        goal: [
          { required: true, message: "众筹目标不能为空", trigger: "blur" },
          { type: "number", message: "众筹目标必须为数字值", trigger: "blur" },
        ],
        duration: [
          { required: true, message: "众筹时间不能为空", trigger: "blur" },
          { type: "number", message: "众筹时间必须为数字值", trigger: "blur" },
        ],
      },
      account: "",
      fullscreenLoading: false,
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push({ name: "FundDetail", params: { id: row.proID } });
    },
    submitForm(formName) {
      const _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(_this.ruleForm);
          _this.fullscreenLoading = true;

          createProject(_this.ruleForm)
            .then((res) => {
              _this.fullscreenLoading = false;
              _this.$message({
                message: "创建成功",
                type: "success",
              });
              _this.$router.go(0);
              _this.activeName = "init";
            })
            .catch((e) => {
              _this.fullscreenLoading = false;
              this.$message.error("创建失败");
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getType(status) {
      if (status == "") {
        return "primary";
      }
      if (status == "success") {
        return "success";
      }
      return "danger";
    },
  },
  async mounted() {
    try {
      this.account = await getCurrentAddress();
      var res = await getRelated();
      console.log(res);
      this.tableData = await getProList(res.arr1);
      this.tableData2 = await getProList(res.arr2);
      this.loading = false;
    } catch (error) {}
  },
};
</script>
