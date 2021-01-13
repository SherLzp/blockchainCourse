<template>
  <div class="hello bg">
<!--    <h1 style="text-align: center">-->

<!--      <div>-->
<!--        {{ account }}-->
<!--      </div>-->
<!--      <button @click="test1">-->
<!--        methods-->
<!--      </button>-->
<!--      <button @click="test">-->
<!--        new fund-->
<!--      </button>-->
<!--      <button @click="getFounds">-->
<!--        getFounds-->
<!--      </button>-->
<!--      <button @click="getFundNum">-->
<!--        getFundNum-->
<!--      </button>-->
<!--      <button @click="send">-->
<!--        send-->
<!--      </button>-->
<!--      <button @click="chainFee">-->
<!--        chainFee-->
<!--      </button>-->
<!--    </h1>-->
    <div style="height: 1000px">
      <el-tabs v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="新建众筹项目" name="新建众筹项目">
          <div style="width: 60%;margin:0 auto;">
            <el-form label-position="left">
              <el-form-item label="受益人(默认是自己)：">
                <el-input v-model="newFund.beneficiary"></el-input>
              </el-form-item>
              <el-form-item label="目标资金：">
                <el-input-number v-model="newFund.goal"></el-input-number>
              </el-form-item>
              <el-form-item label="资金单位：">
                <el-select v-model="unit">
                  <el-option v-for="(item,index) in units" :key="index"
                             :label="item[1]" :value="item[0]"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-form-item>
                  <div class="dialog-footer" style="text-align: center">
                    <el-button @click="newFund={};">取 消
                    </el-button>
                    <el-button type="primary" @click="createFund">确 定</el-button>
                  </div>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>

        </el-tab-pane>
        <el-tab-pane label="所有众筹项目" name="所有众筹项目">
          <el-table
            border
            :data="allList"
            style="width: 80%;background: lightgray;margin:0 auto;border-radius: 15px"
            stripe
            highlight-current-row
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left">
                  <el-form-item label="受益人">
                    <el-tag type="success" size="big">{{ props.row.beneficiary }}</el-tag>
                  </el-form-item>
                  <el-form-item label="投资人列表">
                    <el-collapse>
                      <el-collapse-item>
                        <el-row v-for="(item,index) in props.row.funders" :key="index"
                                style="margin:10px">
                          <el-col :span="10">
                            <el-tag>地址</el-tag>
                            {{ item }}
                          </el-col>
                          <el-col :span="5">
                            <el-tag>出资</el-tag>
                            {{ props.row.money[index] }} wei
                          </el-col>
                          <el-col :span="5" color="black">
                            <el-tag>占比</el-tag>
                            {{ (props.row.money[index] * 100 / props.row.sum).toFixed(2) }}%
                          </el-col>
                          <el-col :span="24">
                            <el-divider></el-divider>
                          </el-col>
                        </el-row>
                      </el-collapse-item>
                    </el-collapse>
                  </el-form-item>

                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="交易id" width="100px" prop="id" sortable></el-table-column>
            <el-table-column label="发起人" prop="starter"></el-table-column>
            <el-table-column label="收益人" prop="beneficiary"></el-table-column>
            <el-table-column label="众筹目标（wei）" width="200px" prop="goal" sortable></el-table-column>
            <el-table-column label="已筹额度(wei)" width="200px" prop="sum" sortable></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button type="success" style="margin: 5px;"
                           @click="dialogVisible=true;curIndex=props.row.id;"
                           :disabled="props.row.starter===account||props.row.funders.indexOf(account)!==-1"
                >
                  <!--                  v-if="props.row.starter!==account"-->
                  投资

                </el-button>
                <el-tooltip content="发起众筹的账户无法对其进行投资">
                  <el-icon class="el-icon-question"></el-icon>
                </el-tooltip>

                <el-button type="primary" style="margin: 5px;"
                           @click="activeTab='自己创建的众筹项目';dialogVisible=true;curIndex=props.row.id;"
                           :disabled="props.row.starter!==account||
                           props.row.sum<props.row.goal||props.row.isIssued"
                >申请使用
                </el-button>
                <el-tooltip content="仅能申请使用已达到要求的投资">
                  <el-icon class="el-icon-question"></el-icon>
                </el-tooltip>
              </template>

            </el-table-column>


          </el-table>
        </el-tab-pane>
        <el-tab-pane label="自己创建的众筹项目" name="自己创建的众筹项目">
          <el-table
            border
            :data="myFundList"
            style="width: 80%;background: lightgray;margin:0 auto;border-radius: 15px"
            stripe
            highlight-current-row
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left">
                  <el-form-item label="受益人">
                    <el-tag type="success" size="big">{{ props.row.beneficiary }}</el-tag>
                  </el-form-item>
                  <el-form-item label="投资人列表">
                    <el-collapse>
                      <el-collapse-item>
                        <el-row v-for="(item,index) in props.row.funders" :key="index"
                                style="margin:10px">
                          <el-col :span="10">
                            <el-tag>地址</el-tag>
                            {{ item }}
                          </el-col>
                          <el-col :span="5">
                            <el-tag>出资</el-tag>
                            {{ props.row.money[index] }} wei
                          </el-col>
                          <el-col :span="5" color="black">
                            <el-tag>占比</el-tag>
                            {{ (props.row.money[index] * 100 / props.row.sum).toFixed(2) }}%
                          </el-col>
                          <el-col :span="24">
                            <el-divider></el-divider>
                          </el-col>
                        </el-row>
                      </el-collapse-item>
                    </el-collapse>
                  </el-form-item>

                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="交易id" width="100px" prop="id" sortable></el-table-column>
            <el-table-column label="发起人" prop="starter"></el-table-column>
            <!--            <el-table-column label="收益人" prop="beneficiary"></el-table-column>-->
            <el-table-column label="众筹目标（wei）" width="200px" prop="goal" sortable></el-table-column>
            <el-table-column label="已筹额度(wei)" width="200px" prop="sum" sortable></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button type="primary" style="margin: 5px;"
                           @click="dialogVisible=true;curIndex=props.row.id;"
                           :disabled="props.row.sum<props.row.goal||props.row.isIssued"
                >

                  申请使用
                </el-button>
                <el-tooltip content="仅能申请使用已达到要求的投资">
                  <el-icon class="el-icon-question"></el-icon>
                </el-tooltip>
                <!--                <el-button type="primary" style="margin: 5px;">操作</el-button>-->
              </template>

            </el-table-column>


          </el-table>
        </el-tab-pane>
        <el-tab-pane label="自己投资的众筹项目" name="自己投资的众筹项目">
          <el-table
            border
            :data="myInvList"
            style="width: 80%;background: lightgray;margin:0 auto;border-radius: 15px"
            stripe
            highlight-current-row
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left">
                  <el-form-item label="受益人">
                    <el-tag type="success" size="big">{{ props.row.beneficiary }}</el-tag>
                  </el-form-item>
                  <el-form-item label="请求目的">
                    {{ props.row.desc }}
                  </el-form-item>
                  <el-form-item label="投资人列表">
                    <el-collapse>
                      <el-collapse-item>
                        <el-row v-for="(item,index) in props.row.funders" :key="index"
                                style="margin:10px">
                          <el-col :span="10">
                            <el-tag>地址</el-tag>
                            {{ item }}
                          </el-col>
                          <el-col :span="5">
                            <el-tag>出资</el-tag>
                            {{ props.row.money[index] }} wei
                          </el-col>
                          <el-col :span="5" color="black">
                            <el-tag>占比</el-tag>
                            {{ (props.row.money[index] * 100 / props.row.sum).toFixed(2) }}%
                          </el-col>
                          <el-col :span="24">
                            <el-divider></el-divider>
                          </el-col>

                        </el-row>
                      </el-collapse-item>
                    </el-collapse>
                  </el-form-item>

                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="交易id" width="100px" prop="id" sortable></el-table-column>
            <el-table-column label="发起人" prop="starter"></el-table-column>
            <el-table-column label="请求使用额度（wei）" width="200px" prop="issueAmount" sortable></el-table-column>
            <el-table-column label="已筹额度(wei)" width="200px" prop="sum" sortable></el-table-column>
            <el-table-column label="需求额度（wei）" prop="goal" sortable ></el-table-column>
            <el-table-column label="当前赞同百分率" >
              <template slot-scope="props">
                {{ getApprovingRatio(props.row) }}%
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="props">
                <el-button type="success"
                             @click="curIndex=props.row.id;vote()"
                             :disabled="props.row.starter===account||
                              !props.row.isIssued"
                  >
                    投赞成票
                  </el-button>
                  <el-tooltip content="仅能对已issue的众筹进行投票，且投票完成后，众筹剩下的前归创建者所有">
                    <el-icon class="el-icon-question"></el-icon>
                  </el-tooltip>



              </template>

            </el-table-column>


          </el-table>
        </el-tab-pane>
        <el-tab-pane label="历史众筹项目" name="历史众筹项目">
          <el-table
            border
            :data="historyList"
            style="width: 80%;background: lightgray;margin:0 auto;border-radius: 15px"
            stripe
            highlight-current-row
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left">
                  <el-form-item label="受益人">
                    <el-tag type="success" size="big">{{ props.row.beneficiary }}</el-tag>
                  </el-form-item>
                  <el-form-item label="投资人列表">
                    <el-collapse>
                      <el-collapse-item>
                        <el-row v-for="(item,index) in props.row.funders" :key="index"
                                style="margin:10px">
                          <el-col :span="10">
                            <el-tag>地址</el-tag>
                            {{ item }}
                          </el-col>
                          <el-col :span="5">
                            <el-tag>出资</el-tag>
                            {{ props.row.money[index] }} wei
                          </el-col>
                          <el-col :span="5" color="black">
                            <el-tag>占比</el-tag>
                            {{ (props.row.money[index] * 100 / props.row.sum).toFixed(2) }}%
                          </el-col>
                          <el-col :span="24">
                            <el-divider></el-divider>
                          </el-col>
                        </el-row>
                      </el-collapse-item>
                    </el-collapse>
                  </el-form-item>

                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="交易id" width="100px" prop="id" sortable></el-table-column>
            <el-table-column label="发起人" prop="starter"></el-table-column>
            <el-table-column label="收益人" prop="beneficiary"></el-table-column>
            <el-table-column label="众筹目标（wei）" width="200px" prop="goal" sortable></el-table-column>
            <el-table-column label="已筹额度(wei)" width="200px" prop="sum" sortable></el-table-column>
            <el-table-column label="使用额度（wei）" prop="issueAmount" sortable></el-table-column>

          </el-table>
        </el-tab-pane>

      </el-tabs>
    </div>


    <div>
      <el-dialog
        title="选择对应操作的信息"
        :visible.sync="dialogVisible"
        width="30%"
        center
        destroy-on-close
      >
        <el-form v-if="activeTab==='所有众筹项目'"
                 label-position="left">
          <el-form-item label="请输入投资金额">
            <el-input-number
              v-model="investmentNum"
              size="large"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="选择投资单位">
            <el-select v-model="unit">
              <el-option v-for="(item,index) in units" :key="index"
                         :label="item[1]" :value="item[0]"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="dialog-footer" style="text-align: center">
              <el-button @click="investmentNum=0;
                             dialogVisible=false">取 消
              </el-button>
              <el-button type="primary" @click="investment">确 定</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-form v-else-if="activeTab==='自己创建的众筹项目'"
                 label-position="left">
          <el-form-item label="请输入使用金额（小于已筹金额）">
            <el-input-number
              v-model="investmentNum"
              size="large"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="选择单位">
            <el-select v-model="unit">
              <el-option v-for="(item,index) in units" :key="index"
                         :label="item[1]" :value="item[0]"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指定用途描述">
            <el-input v-model="desc"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="dialog-footer" style="text-align: center">
              <el-button @click="investmentNum=0;desc='';
                             dialogVisible=false">取 消
              </el-button>
              <el-button type="primary" @click="issueUse">确 定</el-button>
            </div>
          </el-form-item>
        </el-form>
        <el-form v-else
                 label-position="left">
          <el-form-item label="请输入投资金额">
            <el-input-number
              v-model="investmentNum"
              size="large"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="选择投资单位">
            <el-select v-model="unit">
              <el-option v-for="(item,index) in units" :key="index"
                         :label="item[1]" :value="item[0]"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="dialog-footer" style="text-align: center">
              <el-button @click="investmentNum=0;
                             dialogVisible=false">取 消
              </el-button>
              <el-button type="primary" @click="vote">确 定</el-button>
            </div>
          </el-form-item>
        </el-form>

      </el-dialog>
    </div>
    <div>
      {{fundList}}
    </div>
  </div>
</template>

<script>
import fundingLib from "../uitls/fundingLib";

export default {
  name: 'HelloWorld',
  async mounted() {
    let rst = await fundingLib.web3.eth.getAccounts()
    this.newFund.beneficiary = this.account = rst[0]
    console.log(rst)
    await this.refresh()
  },
  computed: {
    myFundList() {
      return this.allList.filter(item => {
        return item.starter === this.account
      })
    },
    allList() {
      return this.fundList.filter(item => {
        return !item.isTransferred
      })
    },
    myInvList() {
      return this.allList.filter(item => {
        return item.funders.indexOf(this.account) !== -1
      })
    },

    historyList() {
      return this.fundList.filter(item => {
        return item.isIssued && item.isTransferred
      })
    }
  },
  data() {
    return {
      activeTab: '所有众筹项目',
      dialogVisible: false,
      units: [
        [1, 'wei'], [1e3, 'kwei'], [1e6, 'mwei'], [1e9, 'gwei'], [1e12, 'szabo'], [1e18, 'eth']
      ],
      unit: 1,
      curIndex: -1,
      account: [],
      dialogOp: 0,
      fundList: [],
      investmentNum: 0,
      desc: '',

      newFund: {
        beneficiary: '123',
        goal: 0,
      }

    }
  },
  methods: {
    async refresh() {
      let ret = await fundingLib.rpc.getAllFunds().call()
      this.fundList = fundingLib.loadInfo(ret)
      console.log(this.fundList)
      this.dialogVisible = false
    },

    async handleClick() {
    },

    async createFund() {
      try{
        let res = await fundingLib.rpc.newFunding(
          this.newFund.beneficiary, this.newFund.goal * this.unit
        ).send({
          from:this.account,
          gas:500000
        })
        console.log(res)
        await this.refresh()
        this.newFund={}
        this.$message.success('新建众筹成功')
      }catch (e){
        console.log(e)
        this.$message,error('新建众筹失败')
      }
    },

    async investment() {
      try {
        console.log('invs',fundingLib.web3.utils.toWei((this.unit * this.investmentNum).toString(), 'wei'),)
        let res = await fundingLib.fundingInstance.methods.contribute(this.curIndex).send({
          from: this.account,
          value: fundingLib.web3.utils.toWei((this.unit * this.investmentNum).toString(), 'wei'),
          gas: '500000',
        })
        console.log(res)
        await this.refresh()
        // location.reload()
        this.$message.success('投资成功')
      } catch (e) {
        console.log(e)
        this.$message.error('投资失败')
      }

    },

    async issueUse() {
      try {
        let res = await fundingLib.rpc.issue(
          this.curIndex,
          this.unit * this.investmentNum,
          this.desc
        ).send({
          from: this.account,
          gas: 500000
        })

        await this.refresh()
        this.$message.success('发起请求成功')
      } catch (e) {
        console.log(e)
        this.$message.success('发起请求失败')
      }
    },

    /**
     * 计算赞同率
     * @param row
     * @returns {string}
     */
    getApprovingRatio(row) {
      let sum = 0
      for (let i = 0; i < row.hasVoted.length; i++) {
        if (row.hasVoted[i]) sum += row.money[i]
      }
      return (sum * 100 / row.sum).toFixed(2)
    },

    async vote() {
      try {
        let res = await fundingLib.rpc.vote(
          this.curIndex
        ).send({
          from: this.account,
          gas: 500000
        })
        await this.refresh()
        this.$message.success('投票成功')
      } catch (e) {
        console.log(e, 'error')
        this.$message.error('投票失败')
      }
    },
    test1() {
      console.log(fundingLib.rpc.issue)
    },

    async test() {
      // let res = await fundingLib.fundingInstance.methods.getBalance().call()
      // console.log(rst)
      let res = await fundingLib.fundingInstance.methods.newFunding(this.account, 1000000).send({
        from: this.account,
        gas: '500000'
      })
      console.log(res)
      res = await fundingLib.web3.eth.getBalance(this.account)
      console.log(res)
    },
    async getFounds() {
      let rst = await fundingLib.fundingInstance.methods.getFund(0).call()
      console.log(rst)
    },

    async getFundNum() {
      let rst = await fundingLib.fundingInstance.methods.getFundNum().call()
      console.log(rst)
    },

    async send() {
      // 这里不call
      let rst = await fundingLib.fundingInstance.methods.contribute(0).send({
        from: this.account,
        value: fundingLib.web3.utils.toWei('10000', 'wei'),
        gas: '500000',
      })

      console.log(rst)
    },
    async chainFee() {
      let rst = await fundingLib.rpc.getBalance().call()
      console.log(rst)
    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.bg {
  background-color: #eceaea;
  margin: 0 auto;
}
</style>
