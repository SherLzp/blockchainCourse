游客主页，显示登录页面

<template>
  <div>
    hello, crowdfunding
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      
    }
  },

  mounted() {
    this.$router.push('/ProjectList');
  },

  methods: {

  }
}
</script>

<style scoped>

</style>