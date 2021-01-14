<template>
  <div>
    <Header />
    <main>
      <fade>
        <router-view></router-view>
      </fade>
    </main>

  </div>
</template>

<script lang="ts">
import Header from "./components/header.vue";
import fade from "./components/base/fade.vue"
import mFooter from "./components/footer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 
    Header, 
    fade, 

  }
});
</script>

<style scoped>
main {
  padding: 2em;
  min-height: 1000px;
  background: #F6F6F6;
}
</style>

