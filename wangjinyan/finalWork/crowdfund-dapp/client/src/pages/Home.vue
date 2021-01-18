<template>
  <div>
    <a-tabs>

    <a-tab-pane key="1" tab="所有众筹">
      <a-table :columns="fund_col" :loading="allFunding.loading" :data-source="allFunding.data">
        <template #time="{text, record}">
          {{new Date(text * 1000).toLocaleString()}}
        </template>
        <template #tag="{text, record}">
          <h>
             <a-progress :percent="record.amount * 100 / record.goal" />
          </h>
        </template>
        <template #action="{text, record}">
          <a @click="clickFunding(record.index)">{{record.title}}</a>
        </template>
      </a-table>
      <a-button position="right" @click="openModal" type="primary">发起众筹</a-button>
      </a-tab-pane>

      <a-tab-pane key="2" tab="我发起的">
      <a-table :columns="columns" :loading="state.loading" :data-source="state.init">
        <template #time="{text, record}">
          {{new Date(text * 1000).toLocaleString()}}
        </template>
        <template #tag="{text, record}">
          <h v-if="record.success === true">
            众筹成功
          </h>
          <h v-else-if="new Date(record.endTime * 1000) > new Date()" >
            正在众筹
          </h>
          <h  v-else>
            众筹失败
          </h>
        </template>
        <template #action="{text, record}">
          <a @click="clickFunding(record.index)">{{record.title}}</a>
        </template>
      </a-table>
      </a-tab-pane>

      <a-tab-pane key="3" tab="我投资的">
      <a-table :columns="columns" :loading="state.loading" :data-source="state.contr">
        <template #time="{text, record}">
          {{new Date(text * 1000).toLocaleString()}}
        </template>
        <template #tag="{text, record}">
          <h v-if="record.success === true">
            众筹成功
          </h>
          <h v-else-if="new Date(record.endTime * 1000) > new Date()" >
            正在众筹
          </h>
          <h  v-else>
            众筹失败
          </h>
        </template>
        <template #action="{text, record}">
          <a @click="clickFunding(record.index)">{{record.title}}</a>
        </template>
      </a-table>
    </a-tab-pane>

    <a-tab-pane key="4" tab="账户信息">
      账号地址：{{state.account}}
    </a-tab-pane>
    
    </a-tabs>
    <Modal v-model:visible="isOpen">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">发起众筹</h3></template>
        <create-form :model="model" :form="form" :fields="fields" />
      </a-card>
    </Modal>
  </div>
</template>





<script lang="ts">


import { defineComponent, ref, reactive } from 'vue';
import Modal from '../components/container.vue'
import CreateForm from '../components/form.vue'
import { Model, Fields, Form } from '../type/form'
import { 
    Funding,
    Use,
    getAccount,
    authenticate,
    contract,
    getAllFundings,
    getOneFunding,
    getMyFundingAmount,
    contribute,
    newFunding,
    getAllUse,
    agreeUse,
    newUse,
    getMyFundings,
    returnMoney,
    addListener } from '../api'
import { message } from 'ant-design-vue'
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'


const fund_col = [
  {
    title: 'title',
    dataIndex: 'action',
    key: 'action',
    slots: { customRender: 'action' }
  },
  {
    title: 'Goal eth',
    dataIndex: 'goal',
    key: 'goal'
  },
  {
    title: 'Current eth',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    slots: { customRender: 'time' }
  },
  {
    title: 'Deadline',
    dataIndex: 'endTime',
    key: 'endTime',
    slots: { customRender: 'time' }
  },
  {
    title: 'Current State',
    dataIndex: 'success',
    key: 'success',
    slots: { customRender: 'tag' }
  },
]

const columns = [
  {
    dataIndex: 'action',
    key: 'action',
    title: 'title',
    slots: { customRender: 'action' }
  },
  {
    title: 'Goal eth',
    dataIndex: 'goal',
    key: 'goal'
  },
  {
    title: 'Current eth',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'My Amount',
    dataIndex: 'myAmount',
    key: 'amount'
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    key: 'startTime',
    slots: { customRender: 'time' }
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    key: 'endTime',
    slots: { customRender: 'time' }
  },
  {
    title: 'Current State',
    dataIndex: 'success',
    key: 'success',
    slots: { customRender: 'tag' }
  },
]

export default defineComponent({
  name: 'Home',
  components: { Modal, CreateForm, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined },
  setup() {
    const isOpen = ref<boolean>(false);
    const allFunding = reactive<{loading: boolean, data: Funding[]}>({
      loading: true,
      data: []
    })
    async function get_fund_data() {
      allFunding.loading = true;
      try {
        allFunding.data = await getAllFundings();
        allFunding.loading = false;
      } catch (e) {
        console.log(e);
        message.error('获取众筹失败!');
      }
    }

    const state = reactive<{loading: boolean, init: Funding[], contr: Funding[], account: string}>({
      loading: true,
      init: [],
      contr: [],
      account: ''
    })

    async function fetchData() {
      state.loading = true;
      await authenticate();
      try {
        const res = await getMyFundings();
        console.log(res)
        state.init = res.init
        state.contr = res.contr
        state.loading = false;
        state.account = await getAccount();
      } catch (e) {
        console.log(e);
        message.error('获取众筹失败!');
      }
    }


    async function openModal() { 
      model.account = await getAccount();
      isOpen.value = true;
    }
    function closeModal() { isOpen.value = false; }

    const model = reactive<Model>({
      title: '',
      info: '',
      amount: 0,
      startdate: null,
      enddate: null
    })

    const fields = reactive<Fields>({
      title: {
        type: 'input',
        label: '标题',
        rule: {
          required: true,
          trigger: 'blur'
        }
      },
      info: {
        type: 'textarea',
        label: '简介',
        rule: {
          required: true,
          trigger: 'blur'
        }
      },
      amount: {
        type: 'number',
        label: '金额',
        min: 0
      },
      startdate: {
        type: 'time',
        label: '开始日期',
      },
      enddate: {
        type: 'time',
        label: '截止日期',
      }
    })

    

    const form = reactive<Form>({
      submitHint: '发起众筹',
      cancelHint: '取消',
      cancel: () => {
        closeModal();
      },
      finish: async () => {
        const seconds1 = Math.ceil(new Date(model.startdate).getTime() / 1000);
        const seconds2 = Math.ceil(new Date(model.enddate).getTime() / 1000);
        try {
          const res = await newFunding(model.account, model.title, model.info, model.amount, seconds1, seconds2);
          console.log(res);
          message.success('发起众筹成功')
          closeModal();
          get_fund_data();
        } catch(e) {
          console.log(e);
          message.error('发起众筹失败')
        }
      }
    })

    const router = useRouter();
    const clickFunding = (index : number) => {
      router.push(`/detail/${index}`)
    }
    addListener(get_fund_data)
    addListener(fetchData)
    get_fund_data();
    fetchData();

    return { openModal, isOpen, model, fields, form, allFunding, fund_col, clickFunding,fetchData,state,columns }
  }
});
</script>
