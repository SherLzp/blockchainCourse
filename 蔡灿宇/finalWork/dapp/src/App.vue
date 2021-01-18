<template>
  <div id="app">
    <el-container direction="vertical">
      <el-header>
        <nheader></nheader>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <nfooter></nfooter>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import HeadNav from './components/HeadNav'
import Footer from './components/Footer'

export default {
  name: 'app',
  components: {
    'nheader':HeadNav,
    'nfooter':Footer
  }
}
</script>

<style>
#app {
  width:80%;
  height:100%;
  margin:0 auto;
}
.el-main{
  min-height: calc(100vh - 140px)
}
  

</style>
