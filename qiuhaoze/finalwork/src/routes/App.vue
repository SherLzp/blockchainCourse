<template>
  <div>
    <div style="float: left">
      <Header />
    </div>
    <main style="float: left">

        <router-view></router-view>

    </main>
    
  </div>
</template>

<script lang="ts">
import {
  HomeOutlined,
  SettingFilled,
  SmileOutlined,
  LoadingOutlined,
} from "@ant-design/icons-vue";
import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons-vue';
import { MessageOutlined } from '@ant-design/icons-vue';
import { getTwoToneColor, setTwoToneColor } from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Header from "./components/Navigation.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Header
  },
});
</script>

<style scoped>
Header {
  background: #d8d8d8;
}
main {
  padding: 3em;
  min-height: 800px;
  background: #ffffff;
}
</style>