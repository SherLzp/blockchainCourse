<template>
  <el-row type="flex" justify="center">
    <el-col :xs="xs" :sm="sm" :md="md" :lg="lg" :xl="xl">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    xs: {
      type: Number,
      default: 24
    },
    sm: {
      type: Number,
      default: 22
    },
    md: {
      type: Number,
      default: 20
    },
    lg: {
      type: Number,
      default: 24
    },
    xl: {
      type: Number,
      default: 24
    }
  }
};
</script>


<style scoped>
</style>
