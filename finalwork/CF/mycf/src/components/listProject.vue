<template>
  <a-table :columns="columns" :data-source="listOfProject">
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
              <detail-project :projectObject="{'projectName':listOfProject[0].project_name,'intendedAmount':listOfProject[0].intendedAmount,'raised':listOfProject[0].raised,'start':listOfProject[0].startFrom,'end':listOfProject[0].endAt,'initiator':listOfProject[0].initiator,'description':listOfProject[0].projectDescription}"></detail-project>
      <a-divider ></a-divider>
      <a-col :span="10">
      <a-input size="small" placeholder="Amount" id="sponsorAmount"/>
      <a-button type="dashed" >Sponsor</a-button>
        </a-col>
        </span>

  </a-table>
</template>


<script lang="ts">
import detailProject from "./detailProject";

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
  name: "listProject",
  components: {detailProject},
  data() {
    return {
      columns,
    };
  },
  props: {
    'listOfProject': Array
  },
  methods: {}
};

</script>

