<template>
  <div>
    <a-tabs>
    <a-tab-pane key="info" v-bind:tab="state.data.title" >
      <template #title>
        <h3>
          {{state.data.title}}
        </h3>
      </template>
      <a-descriptions bordered v-if="key==='info'">
        <a-descriptions-item label="title" :span="3">
          {{state.data.title}}
        </a-descriptions-item>
        <a-descriptions-item label="initiator" :span="3">
          {{state.data.initiator}}
        </a-descriptions-item>
        <a-descriptions-item label="Start Time" :span="3">
           {{new Date(state.data.startTime * 1000).toLocaleString()}}
        </a-descriptions-item>
        <a-descriptions-item label="Deadline" :span="3">
           {{new Date(state.data.endTime * 1000).toLocaleString()}}
        </a-descriptions-item>
        <a-descriptions-item label="Goal eth" :span="2">
        {{state.data.goal}} ETH
        </a-descriptions-item>
        <a-descriptions-item label="Current eth" :span="2">
          {{state.data.amount}} ETH
        </a-descriptions-item>
        <a-descriptions-item label="Crowdfunding progress" :span="3">
          <a-progress v-if="state.data.success == false" :percent="state.data.amount * 100 / state.data.goal" />
          <a-progress v-else :percent="100" />
        </a-descriptions-item>
        <a-descriptions-item label="Introduction" :span="3">
          {{state.data.info}}
        </a-descriptions-item>
        <a-descriptions-item  :span="2">
          <a-button type="primary" v-if="new Date(state.data.endTime * 1000) > new Date() && state.data.success == false" @click="openModal">我要投资</a-button>    
        </a-descriptions-item> 
        <a-descriptions-item  :span="2">
          <a-button type="danger" v-if="!state.data.success && state.myAmount != 0" @click="returnM">要求退款</a-button>
        </a-descriptions-item>
      </a-descriptions>
    </a-tab-pane>

    <a-tab-pane key="2" tab="资金使用申请">
      <Use :id="id" :data="state.data" :amount="state.myAmount"></Use>
    </a-tab-pane>

  </a-tabs>
    <Modal v-model:visible="isOpen">
      <a-card style="width: 600px; margin: 0 2em;" :body-style="{ overflowY: 'auto', maxHeight: '600px' }">
        <template #title><h3 style="text-align: center">投资</h3></template>
        <create-form :model="model" :form="form" :fields="fields" />
      </a-card>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { 
    Funding,
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
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue';
import { CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import Modal from '../components/container.vue'
import CreateForm from '../components/form.vue'
import Use from '../components/apply.vue'
import { Model, Fields, Form } from '../type/form'

const columns = [
  {
    dataIndex: 'info',
    key: 'info',
    title: '使用说明'
  },
  {
    dataIndex: 'goal',
    key: 'goal',
    title: '使用金额(eth)'
  },
  {
    dataIndex: 'agreeAmount',
    key: 'agreeAmount',
    title: '同意请求数额(eth)'
  },
  {
    dataIndex: 'disagree',
    key: 'disagree',
    title: '不同意请求数额(eth)'
  },
  {
    dataIndex: 'action',
    key: 'action',
    title: '操作',
    slots: { customRender: 'action' }
  }
]

export default defineComponent({
  name: 'Funding',
  components: { Modal, CreateForm, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, Use },
  setup() {
    // =========基本数据==========
    const route = useRoute();
    const id = parseInt(route.params.id as string);
    const account = ref('');
    const state = reactive<{data: Funding | {}, loading: boolean, myAmount: number}>({
      data: {},
      loading: true,
      myAmount: 0
    })

    // ===========发起投资表单============
    const isOpen = ref(false);
    function openModal() { isOpen.value = true }
    function closeModal() { isOpen.value = false }

    const model = reactive<Model>({
      value: 1
    })
    const fields = reactive<Fields>({
      value: {
        type: 'number',
        min: 1,
        label: '投资金额'
      }
    })
    const form = reactive<Form>({
      submitHint: '投资',
      cancelHint: '取消',
      cancel: () => {
        closeModal();
      },
      finish: async () => {
        try {
          await contribute(id, model.value);
          message.success('投资成功')
          get_fund_detail();
          closeModal();
        } catch (e) {
          message.error('投资失败')
        }
      }
    })

    async function returnM() {
      try {
        await returnMoney(id);
        message.success('退钱成功');
        get_fund_detail()
      } catch(e) {
        message.error('退钱失败')
      }
    }

    // =========切换标签页===========
    const key = ref('info');
    const onTabChange = (k : 'use' | 'info') => {
      key.value = k;
    }

    // =========加载数据===========
    async function get_fund_detail() {
      state.loading = true;
      try {
        [state.data, state.myAmount] = await Promise.all([getOneFunding(id), getMyFundingAmount(id)]);
        state.loading = false;
        //@ts-ignore
        fields.value.max = state.data.goal - state.data.amount;
      } catch (e) {
        console.log(e);
        message.error('获取详情失败');
      }
    }

    addListener(get_fund_detail)

    getAccount().then(res => account.value = res)
    get_fund_detail();

    return {state, account, isOpen, openModal, form, model, fields,key, onTabChange, id, returnM,columns}
  }
});
</script>
