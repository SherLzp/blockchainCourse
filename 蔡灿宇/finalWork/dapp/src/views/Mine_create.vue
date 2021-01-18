<template>
  <el-table
    :data="my_funding"
    stripe
    height=550px
    style="width: 100%">
    <el-table-column
      prop="name"
      label="项目名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="sum"
      label="众筹金额"
      width="180">
    </el-table-column>
   <el-table-column
      prop="already"
      label="已筹金额"
      width="180">
    </el-table-column>
    <el-table-column
      prop="date"
      label="截止时间"
      width="180">
    </el-table-column>
     <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="fault">转账</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        allFundings: [],
        my_funding:[]
      }
    },
    async mounted(){
      let accounts = await this.GLOBAL.web3.eth.getAccounts();
      this.account=accounts[0];
      console.log(this.account)

      this.allFundings=[];
      this.my_funding=[];
      let funding_num = await this.GLOBAL.contract.methods.funding_num().call();

      for(let i=0;i<funding_num;i++)
      {
        let funding=await this.GLOBAL.contract.methods.Fundings(i).call();
        let date=new Date(funding.time*1000)
        let f={
          id:i,
          name:funding.name,
          sum:funding.sum,
          already:funding.already_sum,
          introduction:funding.introduction,
          date:date.toString(),
          status:funding.status,
          owner:funding.owner
        }
        if(f.owner == this.account)
          this.my_funding.push(f);
        this.allFundings.push(f);
      }
      console.log(this.my_funding)
    },
    methods:{
      async handleClick(row)
      {
        try {
              await this.GLOBAL.contract.methods.want_use(row.id).send({
                from: this.account,
              });
              alert("发起成功");
            } catch (e) {
              alert("发起失败");
            }
        location.reload();
      }
    }
  }
</script>