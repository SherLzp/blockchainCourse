<template>
  <div class="mainNav" style="position: relative">
    <a class="navButton" :href="myIndex">主页</a>
    <a class="navButtonSmall" :href="myCalled">发起项目</a>
    <a class="navButtonSmall" :href="myInvested">投资项目</a>
  </div>
</template>

<script>
import cookies from "js-cookie";
import axios from "axios";

export default {
  name: "navigation",
  stores: {
    logged: "state.logged",
    loggedUser: 'state.currentUser',
  },
  data() {
    return {
      myIndex: "/",
      myCalled: "/CalledProjList",
      myInvested: "/InvestedProjList",
    };
  },

  mounted() {
    // console.log(this.logged)
    let user = cookies.get("user");
    this.loggedUser = user;
    if (typeof user !== "undefined") {
      this.logged = true;
      axios.post("/api", "method=get&key=user." + user).then((res) => {
        this.loggedUser = res.data;
        // console.log(this.loggedUser)
      });
    } else {
      this.logged = false;
    }

  },

  methods: {
    

  },
};
</script>

<style scoped>
.mainNav {
  background-color: #3a445c;
  height: 50px;
  padding: 0 160px;
  font-size: 16px;
  font-family: 微软雅黑;
  color: white;
  /* width: 100%; */
  /* border: 1px solid black; */
}

.navButton {
  font-size: 20px;
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
  top: 14px;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>