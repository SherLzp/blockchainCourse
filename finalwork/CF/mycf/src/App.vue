<template>
  <div id="app">
    <mainLayout >
<!--      <div id="center">-->
<!--      <list-project></list-project>-->
<!--      </div>-->
    </mainLayout>
  </div>
</template>

<script>
import mainLayout from './components/mainLayout'

// import sponsorEachCard from './components/sponsorEachCard'
// import listProject from "@/components/listProject";
// import DetailProject from "@/components/DetailProject";
export default {
  name: 'App',
  components: {
    // sponsorEachCard,

    mainLayout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
