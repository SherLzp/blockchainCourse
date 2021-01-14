<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
      <a-menu-item ><router-link to="/">Dapp众筹平台</router-link> </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: ['mail'],
    };
  },
};
</script>
