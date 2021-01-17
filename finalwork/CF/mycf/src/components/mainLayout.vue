<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['1']"
          :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1" @click="showState='1'">
          所有项目
        </a-menu-item>
        <a-menu-item key="2" @click="showState='2'">
          我的发起
        </a-menu-item>
        <a-menu-item key="3" @click="showState='3'">
          我的投资
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        我当前的账户是0x919D014a9ED0c2D041d1bC6529070607CF6121C0
        <div v-if="showState==='1'">
          <listProject :listOfProject="listOfProject"></listProject>
        </div>
        <div v-if="showState==='2'">
          <listMyProject :listOfMyProject="listOfMyProject"></listMyProject>
        </div>
        <div v-if="showState==='3'">
          <listMyInvest :list-of-my-invest="listOfMyInvest"></listMyInvest>
        </div>

      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Powered By:<br>
      Vue<br>
      Ant Design
    </a-layout-footer>
  </a-layout>
</template>


<script lang="ts">
// import listProject from "@/components/listProject";
import listProject from "./listProject.vue";
import listMyProject from "./listMyProject.vue";
import listMyInvest from "./listMyInvest.vue";
// import {authenticate,getAccount} from '../API/contracts'
const showState = '1';
const listOfProject = [
  {
    key: 1,
    project_name: 'BGBGBG',
    intendedAmount: 32,
    initiator: '0x3f372dac07fbf457fb93c97b865c5c7438412faef43e2ec4714183abff4fad85',
    state: 'going',
    startFrom:'2020.12.12',
    endAt:'2022.12.12',
    projectDescription:'projectDescription',
    raised:'12'
  },
  {
    key: 2,
    project_name: 'Jim Green',
    intendedAmount: 42,
    initiator: '0x2764fc4547d13328413e29f4b369357f95c50f2f9b117c6174be1c5124daeb5c',
    state: 'success',
    startFrom:'2020.12.12',
    endAt:'2022.12.12',
    projectDescription:'projectDescription',
    raised:'42'
  },
  {
    key: 3,
    project_name: 'Joe Black',
    intendedAmount: 32,
    initiator: '0x22462d2aed47914fe041b07070720ab3a2993c81e7cd08925f4e762571458be6',
    state: 'going',
    startFrom:'2020.12.12',
    endAt:'2022.12.12',
    projectDescription:'projectDescription',
    raised:'20'
  },
];
const listOfMyProject=[listOfProject[0],listOfProject[1]];
const listOfMyInvest=[
  {
    key: 1,
    project_name: 'test name',
    initiator: '0x919D014a9ED0c2D041d1bC6529070607CF6121C0',
    requestAmount:12,
    amountApproved:2,
    amountRejected:2
  },
  {
    key: 2,
    project_name: 'Joe Black',
    initiator: '0x22462d2aed47914fe041b07070720ab3a2993c81e7cd08925f4e762571458be6',
    requestAmount:22,
    amountApproved:9,
    amountRejected:6
  },
]

// import {ref} from 'vue'
// const {ref} = 'vue'
export default {
  name: 'mainLayout',
  components: {listProject,listMyProject,listMyInvest},
  data() {
    return {
      showState, listOfProject,listOfMyInvest,listOfMyProject
    }
  },
  // setup(){
  //   const account = ref('认证');
  //   async function handleClick() {
  //     await authenticate();
  //     account.value = await getAccount();
  //   }
  //   handleClick();
  //   return{ account ,handleClick}
  // }
};


</script>

<style scoped>
#components-layout-demo-top .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
</style>



