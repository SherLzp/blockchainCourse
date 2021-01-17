<template>
  <a-popover title="Detailed Information">
    <template slot="content">
      <a-descriptions bordered>
        <a-descriptions-item label="Project Name">
          {{ projectObject.projectName }}
        </a-descriptions-item>
        <a-descriptions-item label="Intended Amount">
          {{ projectObject.intendedAmount }} Eth
        </a-descriptions-item>
        <a-descriptions-item label="Raised">
          {{ projectObject.raised }} ETH
        </a-descriptions-item>
        <a-descriptions-item label="Start From">
          {{ projectObject.start }}
        </a-descriptions-item>
        <a-descriptions-item label="End At">
          {{ projectObject.end }}
        </a-descriptions-item>
        <a-descriptions-item label="Project State">
          <a-badge status="success" text="Success" v-if="projectObject.state==='success'"/>
          <a-badge status="processing" text="Going" v-else-if="projectObject.start ==='going'"/>
          <a-badge status="Error" text="Terminated" v-else/>
        </a-descriptions-item>
        <a-descriptions-item label="Initiator" :span="3">
          {{ projectObject.initiator }}
        </a-descriptions-item>
        <a-descriptions-item label="Project Description">
          {{ projectObject.description }}
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <a-button type="dashed">
      Detail
    </a-button>
  </a-popover>
</template>

<script>
export default {
  name: 'detailedProject',
  data() {
    return {
      size: 'default',
    };
  },
  props: {
    'projectObject': Object
  },
  methods: {}

};
</script>

<style scoped>

</style>