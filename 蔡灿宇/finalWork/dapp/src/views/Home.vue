<template>
  <div class="home">
  <div>
    <i style="float:right">欢迎，{{account}}</i>
  </div>
    <h4>
      投资项目步骤：
    </h4>
    <el-steps :active="1" simple>
      <el-step title="点击众筹项目" icon="el-icon-position"></el-step>
      <el-step title="选择心仪项目" icon="el-icon-thumb"></el-step>
      <el-step title="完成众筹交易" icon="el-icon-finished"></el-step>
    </el-steps>
    <h4>
      发起众筹步骤：
    </h4>
    <el-steps :active="1" simple>
      <el-step title="点击发起众筹" icon="el-icon-edit-outline"></el-step>
      <el-step title="完善众筹信息" icon="el-icon-edit"></el-step>
      <el-step title="发布众筹项目" icon="el-icon-share"></el-step>
    </el-steps>
    <br>
    <el-divider><i class="el-icon-loading"></i></el-divider>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="(img, index) in imgList" :key="index">
        <img v-bind:src="img.url" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [
        { url: require("../assets/home1.jpg") },
        { url: require("../assets/home2.jpg") },
        { url: require("../assets/home3.jpg") },
      ],
      account:""
    };
  },
  async mounted()
  {
    let accounts = await this.GLOBAL.web3.eth.getAccounts();
    this.account=accounts[0];
    console.log(this.account)
  }
};
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
