导航栏页

<template>
  <div class="mainNav" style="position: relative">
    <a class="navButton" :href="index">去中心化众筹Dapp</a>
    <!--<a class="navButtonSmall" :href="projectList">浏览项目</a>-->
    <a class="navButtonSmall" :href="myProject">我的众筹</a>
    <a class="navButtonSmall">当前账户：{{account}}</a>
    <a class="navButtonSmall positionRight" :href="launch">发起众筹</a>
  </div>
</template>

<script>

import {getAccount, Authenticate, addListener} from "../server/serve"

export default {
  name: "navigation",
  stores: {
    logged: "state.logged",
    loggedUser: 'state.currentUser',
  },
  data() {
    return {
      account: "",
      index: "/",
      projectList: "/ProjectList",
      myProject: "/MyProject",
      launch: "/Launch",
    };
  },

  mounted() {

  },

  async created () {
    var that = this
    async function updateAccount() {
      await Authenticate();
      try {
        that.account = await getAccount()
      } catch (e) {
        console.log(e);
        alert("获取账户信息失败")
      }
    }
    updateAccount();
    addListener(updateAccount)
    return {Authenticate}
  },

  methods: {

  },
};
</script>

<style scoped>
.mainNav {
  background-color: #301105;
  height: 90px;
  padding: 0 160px;
  font-size: 16px;
  font-family: 微软雅黑;
  color: white;
  /* width: 100%; */
  /* border: 1px solid black; */
}

.navButton {
  font-size: 40px;
  color: white;
  text-decoration: none;
  position: relative;
  top: 11px;
  margin: 0 10px;
}

.navButton :visited {
  color: white;
  text-decoration: none;
}

.navButtonSmall {
  font-size: 16px;
  color: white;
  text-decoration: none;
  position: relative;
  top: 10px;
  margin: 0 10px;
}

.navButtonSmall :visited {
  color: white;
  text-decoration: none;
}

.positionRight {
  position: absolute;
  right: 160px;
  top: 32px;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>