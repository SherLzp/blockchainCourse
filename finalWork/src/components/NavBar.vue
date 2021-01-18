<template>
  <div style="margin-top: 0!important;" >
    <el-menu
      mode="horizontal"
      active-text-color="green"
      background-color="#409EFF"
      text-color="#fff"
      router
      style="margin-top: 0!important;border-radius: 10px;"
    >
      <el-menu-item>
        <div class="el-icon-s-unfold" style="color: white"></div>
      </el-menu-item>
      <el-menu-item disabled index="icon"
                    style="color: white!important;cursor: pointer!important;opacity: 1!important;font-size: x-large">
        <span >
          LZY 以太坊众筹平台

        </span>
        <span style="margin-left: 55%;font-size: smaller">
          您的账户地址：{{account}}
        </span>

      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
import fundingLib from "../uitls/fundingLib";

export default {
  name: "NavBar",
  async mounted() {
    let rst = await fundingLib.web3.eth.getAccounts()
    this.account = rst[0]
  },
  computed: {

  },
  data() {
    return {
      account:'',
    }
  },
  methods: {},
}
</script>

<style scoped>

</style>
