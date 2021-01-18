<template>
  <a-table :columns="columns" :data-source="listOfMyProject">
      <span slot="state" slot-scope="state">
        <div v-if="state==='success'">
        <a-icon type="check-circle" />众筹完成
        </div>
        <div v-else-if="state==='going'">
        <a-icon type="clock-circle" />
        正在众筹
        </div>
        <div v-else>
        <a-icon type="close-circle" />
        众筹失败
        </div>
      </span>

    <span slot="more" >
      <a-button type="dashed" >发起资金使用请求</a-button>
        </span>

  </a-table>
</template>


<script lang="ts">
// import detailProject from "./detailProject";

const columns = [
  {
    dataIndex: 'key',
    key: 'key',
    title: 'Index',
    ellipsis: true
  },
  {
    dataIndex: 'project_name',
    key: 'project_name',
    title: 'Project Name',
    ellipsis: true,
  },
  {
    title: 'IntendedAmount',
    dataIndex: 'intendedAmount',
    key: 'intendedAmount', ellipsis: true,
  },
  {
    title: 'Initiator',
    dataIndex: 'initiator',
    key: 'initiator', ellipsis: true,
  },
  {
    title: 'State',
    key: 'state',
    dataIndex: 'state',
    scopedSlots: {customRender: 'state'},
    ellipsis: true,
  },
  {
    title: 'More',
    key: 'more',
    dataIndex: 'more',
    scopedSlots: {customRender: 'more'}, ellipsis: true,
  },
];

export default {
  name: "listMyProject",
  // components: {detailProject},
  data() {
    return {
      columns,
    };
  },
  props: {
    'listOfMyProject': Array
  },
  methods: {}
};

</script>

