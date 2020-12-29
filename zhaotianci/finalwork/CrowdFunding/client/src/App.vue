<template>
  <div id="app">
    <el-container style="height: 80%; border: 1px solid #eee">
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1" class="el-icon-platform-eleme"></el-menu-item>
          <el-menu-item index="2">首页</el-menu-item>
          <el-menu-item index="3">众筹列表</el-menu-item>
          <el-menu-item index="4">我的众筹</el-menu-item>
        </el-menu>
      </el-header>

      <el-main>
        <router-view />
      </el-main>

      <el-footer> </el-footer>
    </el-container>
  </div>
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
      if(key == 1){
        this.$router.push('/about')
      }
      else if(key == 2){
        this.$router.push('/')
      }
      else if(key == 3){
        this.$router.push('/fundlist')
      }
      else if(key == 4){
        this.$router.push('/myfunds')
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
</style>
