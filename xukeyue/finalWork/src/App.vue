<template>
  <div id="app">
      <navigation />
      <el-container>
        <el-main id="MainContent">
            <router-view></router-view>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import navigation from './components/navigation'
import './assets/common.css'

export default {
  name: 'App',
  components: {
    navigation
  },
  
  methods: {
    
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}

#MainContent {
  position: relative;
  margin: 0 150px;
  padding: 10px;
  /* background-color: white; */
}

body {
  margin: 0;
  /* background-image: url("assets/background.png"); */
  /* background-size: 100%; */
  background-color: #F4F4F4;
}
</style>
