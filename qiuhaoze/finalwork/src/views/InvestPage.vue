<template>
  <div>
    <a-card
      :loading="state.loading"
      :tab-list="tabList"
      :active-tab-key="key"
      @tabChange="onTabChange"
    >
      <a-descriptions bordered v-if="key === 'info'">
        <a-descriptions-item label="众筹状态" span="0">
          <label v-if="state.data.success === true">众筹成功</label>
          <label v-else-if="new Date(state.data.endTime * 1000) > new Date()"
            >正在众筹</label
          >
          <label v-else>众筹失败</label>
        </a-descriptions-item>
        <a-descriptions-item label="众筹金额（单位：以太币）" span="0">
          <label> {{ state.data.goal }} </label>
        </a-descriptions-item>
        <a-descriptions-item label="已筹集到的金额（单位：以太币）" span="0">
          <label> {{ state.data.amount }} </label>
        </a-descriptions-item>
        <a-descriptions-item label="当前账号投资金额（单位：以太币）" span="0">
          <label> {{ state.myAmount }} </label>
        </a-descriptions-item>
      </a-descriptions>

      <div bordered v-if="key === 'info'" align="center" style="margin-top: 2%">
        <a-button
          v-if="
            new Date(state.data.endTime * 1000) > new Date() &&
            state.data.success == false
          "
          @click="openModal"
          >我要投资
        </a-button>
      </div>

      <Use
        v-if="key === 'use'"
        :id="id"
        :data="state.data"
        :amount="state.myAmount"
      ></Use>
    </a-card>

    <Modal v-model:visible="isOpen">
      <a-card
        style="width: 500px; margin: 0 1em"
        :body-style="{ overflowY: 'auto', maxHeight: '600px' }"
      >
        <create-form :model="model" :form="form" :fields="fields" />
      </a-card>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";
import {
  getOneFunding,
  Funding,
  getAccount,
  getMyFundingAmount,
  contribute,
  returnMoney,
  addListener,
} from "../contract";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import Modal from "../components/PopUp.vue";
import CreateForm from "../components/MyForm.vue";
import Use from "./UseRequestPage.vue";
import { Model, Fields, Form } from "../components/form";
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { StarOutlined, StarFilled, StarTwoTone } from "@ant-design/icons-vue";
import { MessageOutlined } from "@ant-design/icons-vue";
import { getTwoToneColor, setTwoToneColor } from "@ant-design/icons-vue";
import { createFromIconfontCN } from "@ant-design/icons-vue";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import DoneIcon from "@material-ui/icons/Done";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const column1 = [
  {
    dataIndex: "title",
    key: "title",
    title: "众筹项目概述",
  },
  {
    dataIndex: "info",
    key: "info",
    title: "众筹项目介绍",
  },
  {
    title: "众筹总金额(单位：以太币)",
    dataIndex: "goal",
    key: "goal",
  },
  {
    title: "已筹集到的金额(单位：以太币)",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "截止时间",
    dataIndex: "endTime",
    key: "endTime",
    slots: { customRender: "time" },
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    slots: { customRender: "action" },
  },
];
const column = [
  {
    dataIndex: "",
  },
];

const tabList = [
  {
    key: "info",
    tab: "众筹进度",
  },
  {
    key: "use",
    tab: "使用请求",
  },
];

export default defineComponent({
  name: "investpage",
  components: {
    Modal,
    CreateForm,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    Use,
  },
  setup() {
    const route = useRoute();
    const id = parseInt(route.params.id as string);
    const account = ref("");
    const state = reactive<{
      data: Funding | {};
      loading: boolean;
      myAmount: number;
    }>({
      data: {},
      loading: true,
      myAmount: 0,
    });

    const isOpen = ref(false);
    function openModal() {
      isOpen.value = true;
    }
    function closeModal() {
      isOpen.value = false;
    }
    const suc = 0;
    const fail = 1;
    function TestCode() {
      if (fail < 0) {
        const handle = 1;
        const Click = 1;
        const get = 1;
        const Account = 1;
        const Listener = 1;
        const funding = 1;
        const investment = 1;
        const pages = 1;
        const project = 1;
        const projectspages = 1;
        const contract = 1;
        const getshims = 1;
        const AccountPages = 1;
        const Navigation = 1;
        const Popupgame = 1;
        const Forms = 1;
        const Views = 1;
        const UseRequest = 1;
        console.log(handle);
        console.log(Click);
        console.log(get);
        console.log(Account);
        console.log(Listener);
        console.log(funding);
        console.log(investment);
        console.log(pages);
        console.log(project);
        console.log(projectspages);
        console.log(contract);
        console.log(getshims);
        console.log(AccountPages);
        console.log(Navigation);
        console.log(Popupgame);
        console.log(Forms);
        console.log(Views);
        console.log(UseRequest);
      }
    }
    const model = reactive<Model>({
      value: 1,
    });
    const fields = reactive<Fields>({
      value: {
        type: "number",
        min: 1,
        label: "投资金额",
      },
    });
    const form = reactive<Form>({
      submitHint: "投资",
      cancelHint: "取消",
      cancel: () => {
        closeModal();
      },
      finish: async () => {
        try {
          await contribute(id, model.value);
          message.success("投资成功");
          fetchData();
          closeModal();
        } catch (e) {
          message.error("投资失败");
        }
      },
    });

    const key = ref("info");
    const onTabChange = (k: "use" | "info") => {
      key.value = k;
    };
    const succ = 0;
    const faill = 1;
    function TestCode2() {
      if (fail < 0) {
        const handle = 1;
        const Click = 1;
        const get = 1;
        const Account = 1;
        const Listener = 1;
        const funding = 1;
        const investment = 1;
        const pages = 1;
        const project = 1;
        const projectspages = 1;
        const contract = 1;
        const getshims = 1;
        const AccountPages = 1;
        const Navigation = 1;
        const Popupgame = 1;
        const Forms = 1;
        const Views = 1;
        const UseRequest = 1;
        console.log(handle);
        console.log(Click);
        console.log(get);
        console.log(Account);
        console.log(Listener);
        console.log(funding);
        console.log(investment);
        console.log(pages);
        console.log(project);
        console.log(projectspages);
        console.log(contract);
        console.log(getshims);
        console.log(AccountPages);
        console.log(Navigation);
        console.log(Popupgame);
        console.log(Forms);
        console.log(Views);
        console.log(UseRequest);
      }
    }
    async function fetchData() {
      state.loading = true;
      try {
        [state.data, state.myAmount] = await Promise.all([
          getOneFunding(id),
          getMyFundingAmount(id),
        ]);
        state.loading = false;
        //@ts-ignore
        fields.value.max = state.data.goal - state.data.amount;
      } catch (e) {
        console.log(e);
        message.error("获取详情失败");
      }
    }

    addListener(fetchData);

    getAccount().then((res) => (account.value = res));
    fetchData();

    return {
      state,
      account,
      isOpen,
      openModal,
      form,
      model,
      fields,
      tabList,
      key,
      onTabChange,
      id,
    };
  },
});
</script>