<template>
  <MainLayout :lg="24" style="background-color:#545c64">
    <el-row :gutter="10">
      <el-col :span="3">
        <el-menu
            default-active="1"
            @select="Myselect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">所有的</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">我创建的</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">我参与的</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <FundingList :funding-list="myFindinglist"></FundingList>
      </el-col>
    </el-row>

  </MainLayout>
</template>

<script>
import MainLayout from "@/components/MainLayout";
import FundingList from "@/components/FundingList";
import DetailCard from "@/components/DetailCard";

export default {
  name: "Home",
  components: {DetailCard, FundingList, MainLayout},
  data() {
    return {
      myFindinglist:[]
    }
  },
  created() {
    this.$store.dispatch('updateFundingList')
  },
  methods: {
    Myselect(index){
      if(index=='1'){
        console.log(this.$store)
        this.myFindinglist=this.$store.state.fundingList1;}
      else if(index=='2')
        this.myFindinglist=this.$store.state.fundingList2;
      else
        this.myFindinglist=this.$store.state.fundingList3;
    }
  }
}
</script>

<style scoped>

</style>