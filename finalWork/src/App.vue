<template>
  <div id="app">
    <el-container>
      <el-header >
        <NavBar></NavBar>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        <div style="text-decoration: gray;text-align: center">
          <el-menu>Proudly Presented by LZY</el-menu>
        </div>
      </el-footer>
    </el-container>

  </div>
</template>

<script>
import fundingLib from "./uitls/fundingLib";
import NavBar from "./components/NavBar";
export default {
  name: 'App',
  components: {NavBar},
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
