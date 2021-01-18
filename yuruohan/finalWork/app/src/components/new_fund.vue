<template>
  <el-form
    :model="formModel"
    :rules="formRule"
    ref="formModel"
    label-width="100px"
    class="demo-formModel"
    align="left"
  >
    <el-form-item label="众筹名称" prop="title">
      <el-input v-model="formModel.title"></el-input>
    </el-form-item>

    <el-form-item label="众筹描述" prop="description">
      <el-input type="textarea" v-model="formModel.description"></el-input>
    </el-form-item>

    <el-form-item label="目标金额" prop="target">
      <el-input-number v-model="formModel.target" :min="1"></el-input-number>
      (ether)
    </el-form-item>

    <el-form-item label="截止日期" prop="duration">
      <el-input-number v-model="formModel.duration" :min="1"></el-input-number>
      (天)之后
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
        @click="submitForm('formModel')"
        >创建众筹项目</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
  import { getUserAddress, newFund } from "../contractAPI.js";

  export default {
    data() {
      return {
        account: "",
        formModel: {
          title: "",
          description: "",
          target: 3,
          duration: 3,
        },
        formRule: {
          title: [
            {
              required: true,
              min: 1,
              max: 3000,
            }
          ],
          description: [
            {
              required: true,
              min: 1,
              max: 3000,
            }
          ],
          target: [
            {
              required: true,
              type: "number"
            }
          ],
          duration: [
            {
              required: true,
              type: "number"
            }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        const _this = this;
        
        this.$refs[formName].validate((valid) => {
          if (valid)
          {
            console.log("valid form");
            newFund(_this.formModel)
              .then((res) => {
                _this.$message({
                  message: "创建成功",
                  type: "success",
                });
              })
              .catch((e) => {
                this.$message.error("创建失败");
                console.log(e);
              }
            );
          }
          else
          {
            console.log("invalid form");
            return false;
          }
        });
      },
    },

    async mounted() {
      try {
        this.account = await getUserAddress();
      } catch (error) {}
    },
  };
</script>
