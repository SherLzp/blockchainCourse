import Vue from 'vue'
import Vuex from 'vuex'
import {getFundingDetails} from "@/eth/interface";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    funding: {},
    fundingList1: [],
    fundingList2: [],
    fundingList3: [],
    isEmpty: true,
  },
  mutations: {
    updateFunding(state, res) {
      state.funding = res
      state.isEmpty = false
    },
  },
  actions: {
    updateFundingList(context) {
      getFundingDetails(1)
          .then(res => {
            context.state.fundingList1 = res.filter(value => {
              return !value.isDiscarded
            })
          })

      getFundingDetails(2)
          .then(res => {
            context.state.fundingList2 = res.filter(value => {
              return !value.isDiscarded
            })
          })

      getFundingDetails(3)
          .then(res => {
            context.state.fundingList3 = res.filter(value => {
              return !value.isDiscarded
            })
          })
      context.state.isEmpty = true
    },
  },
})

export default store