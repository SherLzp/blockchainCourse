<template>
  <a-popover title="Project Detail">
    <template slot="content">
      <a-descriptions  bordered >
        <a-descriptions-item label="Project Name">
          快点打钱
        </a-descriptions-item>
        <a-descriptions-item label="Intended Amount">
          {{  }} Eth
        </a-descriptions-item>
        <a-descriptions-item label="Raised">
          {{  }} ETH
        </a-descriptions-item>
        <a-descriptions-item label="Start From">
          {{  }} 父元素prop传入
        </a-descriptions-item>
        <a-descriptions-item label="End At" >
          2019-04-24 18:00:00
        </a-descriptions-item>
        <a-descriptions-item label="Project State" >
          <a-badge status="success" text="Success"/>
        </a-descriptions-item>
        <a-descriptions-item label="Initiator" :span="3">
          0x123123123
        </a-descriptions-item>
        <a-descriptions-item label="Project Description">
          {{}}父元素props传入
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <a-button type="primary">
      Detail
    </a-button>
  </a-popover>
</template>

<script>
export default {
  name: "ProjectDetailCard"
}
</script>

<style scoped>

</style>