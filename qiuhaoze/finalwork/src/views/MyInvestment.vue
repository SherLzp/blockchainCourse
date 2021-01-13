<template>
  <div>
    <a-card style="margin-top: 1em">
      <template #title>
        <h3>我投资的项目</h3>
      </template>
      <a-table
        :columns="columns"
        :loading="state.loading"
        :data-source="state.contr"
      >
        <template #time="{ text, record }">
          {{ new Date(text * 1000).toLocaleString() }}
        </template>
        <template #action="{ text, record }">
          <a @click="clickFunding(record.index)">我要投资</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import Modal from "../components/PopUp.vue";
import CreateForm from "../components/MyForm.vue";
import { Model, Fields, Form } from "../components/form";
import {
  contract,
  getAccount,
  getAllFundings,
  Funding,
  newFunding,
  getMyFundings,
  addListener,
} from "../contract";
import { message } from "ant-design-vue";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
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
    title: "众筹金额(单位：以太币)",
    dataIndex: "goal",
    key: "goal",
  },
  {
    title: "已筹集到的金额(单位：以太币)",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "我投资的金额(单位：以太币)",
    dataIndex: "myAmount",
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

export default defineComponent({
  name: "Myself",
  components: {
    Modal,
    CreateForm,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
  },
  setup() {
    const isOpen = ref<boolean>(false);
    const state = reactive<{
      loading: boolean;
      init: Funding[];
      contr: Funding[];
    }>({
      loading: true,
      init: [],
      contr: [],
    });
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
    async function fetchData() {
      state.loading = true;
      try {
        const res = await getMyFundings();
        console.log(res);
        state.init = res.init;
        state.contr = res.contr;
        state.loading = false;
      } catch (e) {
        console.log(e);
        message.error("获取众筹失败!");
      }
    }

    const router = useRouter();
    const clickFunding = (index: number) => {
      router.push(`/funding/${index}`);
    };
    addListener(fetchData);
    fetchData();

    return { state, columns, clickFunding };
  },
});
</script>
