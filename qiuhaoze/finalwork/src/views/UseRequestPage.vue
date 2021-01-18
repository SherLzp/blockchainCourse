<template>
  <div>
    <a-table
      :loading="state.loading"
      :data-source="state.data"
      :columns="columns"
      style="margin-bottom: 2%"
    >
      <template #over="{ text, record }">
        <a-label v-if="record.over === false"> 正在表决 </a-label>
        <a-label v-else-if="record.agreeAmount >= record.goal / 2">
          同意使用
        </a-label>
        <a-label color="error" v-else> 不同意使用 </a-label>
      </template>

      <template #action="{ text, record }" v-if="amount != 0">
        <a-button
          v-if="
            (record.agree == 0 || record.agree == 2) && record.over === false
          "
          @click="clickAgreeUse(true, record.index)"
        >
          同意
        </a-button>
        <a-divider type="vertical"></a-divider>
        <a-button
          v-if="
            (record.agree == 0 || record.agree == 1) && record.over === false
          "
          @click="clickAgreeUse(false, record.index)"
        >
          不同意
        </a-button>
      </template>
    </a-table>

    <div align="center">
      <a-button
        @click="openModal"
        v-if="account === data.initiator && data.success"
        >发起使用请求</a-button
      >
    </div>

    <Modal v-model:visible="isOpen">
      <a-card
        style="width: 600px; margin: 0 2em"
        :body-style="{ overflowY: 'auto', maxHeight: '600px' }"
      >
        <template #title
          ><h3 style="text-align: center">发起使用请求</h3></template
        >
        <create-form :model="model" :form="form" :fields="fields" />
      </a-card>
    </Modal>
  </div>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { defineComponent, ref, reactive, PropType, watch } from "vue";
import {
  getAccount,
  getAllUse,
  Funding,
  agreeUse,
  newUse,
  Use,
  addListener,
} from "../contract";
import Modal from "../components/PopUp.vue";
import CreateForm from "../components/MyForm.vue";
import { Model, Fields, Form } from "../components/form";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
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

const columns = [
  {
    dataIndex: "info",
    key: "info",
    title: "使用目的",
  },
  {
    dataIndex: "goal",
    key: "goal",
    title: "使用金额(单位：以太币)",
  },
  {
    dataIndex: "agreeAmount",
    key: "agreeAmount",
    title: "同意金额(单位：以太币)",
  },
  {
    dataIndex: "disagree",
    key: "disagree",
    title: "不同意金额(单位：以太币)",
  },
  {
    dataIndex: "over",
    key: "over",
    title: "使用请求状态",
    slots: { customRender: "over" },
  },
  {
    dataIndex: "action",
    key: "action",
    title: "",
    slots: { customRender: "action" },
  },
];

export default defineComponent({
  name: "Use",
  props: {
    id: Number,
    data: Object as PropType<Funding>,
    amount: Number,
  },
  components: {
    Modal,
    CreateForm,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
  },
  setup(props) {
    const state = reactive<{ loading: boolean; data: Use[] }>({
      loading: true,
      data: [],
    });
    const account = ref("");

    const isOpen = ref(false);
    function openModal() {
      isOpen.value = true;
    }
    function closeModal() {
      isOpen.value = false;
    }

    const model = reactive<Model>({
      info: "",
      goal: 0,
    });
    const fields = reactive<Fields>({
      info: {
        type: "textarea",
        label: "使用目的",
      },
      goal: {
        type: "number",
        min: 0,
        label: "使用金额",
      },
    });
    const form = reactive<Form>({
      submitHint: "发起请求",
      cancelHint: "取消",
      cancel: () => {
        closeModal();
      },
      finish: async () => {
        try {
          await newUse(props.id as number, model.goal, model.info);
          message.success("发起请求成功");
          fetchData();
          closeModal();
        } catch (e) {
          message.error("发起请求失败");
        }
      },
    });

    watch(
      () => props.data,
      () => {
        if (props.data) {
          fields.goal.max = props.data.amount;
        }
      }
    );

    async function fetchData() {
      state.loading = true;
      try {
        state.data = await getAllUse(props.id as number);
        account.value = await getAccount();
        state.loading = false;
      } catch (e) {
        console.log(e);
        message.error("获取使用请求失败");
      }
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
    async function clickAgreeUse(agree: boolean, useID: number) {
      try {
        await agreeUse(props.id as number, useID, agree);
        message.success("操作成功");
        fetchData();
      } catch (e) {
        console.log(e);
        message.error("操作失败");
      }
    }
    addListener(fetchData);
    fetchData();

    return {
      state,
      columns,
      account,
      isOpen,
      model,
      fields,
      form,
      openModal,
      clickAgreeUse,
    };
  },
});
</script>