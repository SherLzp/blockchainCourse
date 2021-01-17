<template>
  <a-table :columns="columns" :data-source="listOfMyInvest">
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

    <span slot="more">
      <a-button type="dashed">同意请求</a-button>
      <a-divider></a-divider>
      <a-button type="danger">拒绝请求</a-button>
        </span>

  </a-table>
</template>


<script>

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
    title: 'Initiator',
    dataIndex: 'initiator',
    key: 'initiator', ellipsis: true,
  },
  {
    title: 'Request Amount',
    key: 'requestAmount',
    dataIndex: 'requestAmount',
    ellipsis: true,
  },
  {
    title: 'Amount Approved',
    key: 'amountApproved',
    dataIndex: 'amountApproved',
    ellipsis: true,
  },
  {
    title: 'Amount Rejected',
    key: 'amountRejected',
    dataIndex: 'amountRejected',
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
  name: "listMyInvest",
  data() {
    return {
      columns,
    };
  },
  props: {
    'listOfMyInvest': Array
  },
  methods: {}
}
</script>

<style scoped>

</style>