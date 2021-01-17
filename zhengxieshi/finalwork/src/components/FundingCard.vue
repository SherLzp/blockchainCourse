<template>
  <el-card :body-style="'padding: 0px'" @click.native="selectFunding">
    <img class="funding-cover" src="~@/assets/img/elliot.jpg">
    <div style="padding: 10px">
      <div style="font-size: 20px; font-weight: bold;">{{funding.projectName}}</div>
      <div style="font-size: 15px; color: #999;">{{remainTime}}</div>
      <div><el-progress :percentage="timePercent"></el-progress></div>
    </div>
    <div>
      <el-row type="flex">
        <el-col class="bottom-bar-col">
          <div>已筹</div>
          {{fundingBalance}} wei
        </el-col>
        <el-col class="bottom-bar-col">
          <div>已达</div>
          {{balancePercent}}%
        </el-col>
        <el-col class="bottom-bar-col">
          <div>参与人数</div>
          {{funding.investorsCount}} 人
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "FundingCard",
  props: {
    funding: {
      type: Object,
    }
  },
  computed: {
    fundingBalance() {
      if (this.funding.balance <= 9999)
        return this.funding.balance
      else
        return '...'
    },
    remainTime() {
      if (this.funding.endTime < (new Date).valueOf()) {
        return '已结束'
      }
      return Math.ceil((this.funding.endTime - (new Date).valueOf()) / (1000*3600*24)) + ' 天'
    },
    timePercent() {
      if (this.funding.endTime > (new Date).valueOf())
        return Math.ceil(( 1 - (this.funding.endTime - (new Date).valueOf())
            / (this.funding.endTime - this.funding.startTime)) * 100)
      else
        return 100
    },
    balancePercent() {
      return Math.ceil((this.funding.balance)
          / (this.funding.targetBalance) * 100)
    },
  },
  methods: {
    selectFunding() {
      this.$store.commit('updateFunding', this.funding)
    }
  }
}
</script>

<style scoped>
.funding-cover {
  height: 200px;
  width: 100%;
}

.el-card:hover {
  cursor: pointer;
}

.bottom-bar-col {
  border: 1px solid #ddd;
  text-align: center;
}
</style>