<template>
  <div id="app">
    <el-header>
      <b> Welcome to the CrowdFunding Platfom! </b>
      <p> User: {{this.user}}  </p>
    </el-header><br>
    <el-row class="tac" :gutter="20">
      <el-col :span="3">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          @select="handleSelect">
          <el-menu-item index="0">主页</el-menu-item>
          <el-menu-item index="1">新建</el-menu-item>
          <el-menu-item index="2">所有众筹</el-menu-item>
          <el-menu-item index="3">我发起的众筹</el-menu-item>
          <el-menu-item index="4">我投资的众筹</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import { getUserAddress } from "./contractAPI.js";

  export default {
    data() {
      return {
        user: "",
        activeIndex: "0",
      };
    },
    methods: {
      // 点选tab后跳转到相应界面
      handleSelect(key, keyPath) {
        if(key == 0)
        {
          this.$router.push('/home')
        }
        else if(key == 1)
        {
          this.$router.push('/new_fund')
        }
        else if(key == 2){
          this.$router.push('/all_fund')
        }
        else if(key == 3){
          this.$router.push('/my_fund')
        }
        else if(key == 4){
          this.$router.push('/my_invest')
        }
      },
    },
    async mounted() {
      try {
        this.user = await getUserAddress();
        // console.log("this user is:");
        // console.log(this.user);
      } catch (error) {}
    },
  };
</script>
