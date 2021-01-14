<template>
  <div>
    <Header />
    <main>

        <router-view></router-view>
 
    </main>
  </div>
</template>

<script lang="ts">
import Header from "./components/header.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 
    Header, 
 
  }
});
</script>

<style scoped>
main {
  padding: 2em;
  min-height: 600px;
  background: #F6F6F6;
}
</style>

