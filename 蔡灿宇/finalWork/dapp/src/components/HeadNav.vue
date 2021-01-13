<template>
  <el-menu
    :default-active="this.$route.path"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-container style="float: left">
      <el-menu-item class="el-icon-loading" index="0" @click="goTo('/')"
        >DAPP</el-menu-item>
    </el-container>
    <el-container style="float: right">
      <el-menu-item index="1" @click="goTo('/')">首页</el-menu-item>
      <el-menu-item index="2" @click="goTo('/item')">众筹项目</el-menu-item>
      <el-menu-item index="3" @click="goTo('/create')">发起众筹</el-menu-item>
      <el-submenu index="4">
        <template slot="title">我的众筹</template>
        <el-menu-item index="4-1" @click="goTo('/mine_invest')">我参与的众筹</el-menu-item>
        <el-menu-item index="4-2" @click="goTo('/mine_create')">我发起的众筹</el-menu-item>
      </el-submenu>
    </el-container>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    goTo(path) {
      this.$router.replace(path);
    },
  },
};
</script>