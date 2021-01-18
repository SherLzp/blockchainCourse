<template>
    <v-container>
        <v-row dense>
            <v-col cols="12">
                <v-banner elevation="2" color="primary">
                    <v-icon dark>
                        mdi-wrench
                    </v-icon>
                    我发起的众筹项目
                </v-banner>
            </v-col>
            <v-col cols="12" v-for="item in InfoList" :key="item.id" >
                <v-card v-if="item[0] == userAddr">
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="overline mb-4">
                                开始时间：{{ item["3"] }} 结束时间：{{ item["4"] }}
                            </div>
                            <v-list-item-title class="headline mb-1">
                                项目概述: {{ item["1"] }}
                            </v-list-item-title>
                            <v-list-item-subtitle>项目描述：{{ item["2"] }}</v-list-item-subtitle>
                            <v-list-item-subtitle>目标金额：{{ item["5"] }}</v-list-item-subtitle>
                            <v-list-item-subtitle>筹得金额：{{ item["6"] }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar
                        v-if="item[7]"
                        tile
                        size="80"
                        color="green"
                        >
                            目标达成
                            <v-icon dark>
                                mdi-checkbox-marked-circle
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-avatar
                        v-else-if="item[4] > new Date()"
                        tile
                        size="80"
                        color="yellow"
                        >
                            正在进行
                            <v-icon dark>
                                mdi-wrench
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-avatar
                        v-else
                        tile
                        size="80"
                        color="red"
                        >
                            项目失败
                            <v-icon dark>
                                mdi-cancel
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions v-if="BallotList.size != 0 && item[4] > new Date() && (BallotList.get(item.id))[0].length == 0">
                        <v-row dense>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field outlined
                                    label="投票议题"
                                    v-model="item.ballot"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn
                                outlined
                                rounded
                                text
                                v-on:click="createballot(item.id, item.ballot)"
                                >
                                发起投票
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                    <v-card-actions v-else-if="BallotList">
                        <v-row dense>
                            <v-col cols="12" sm="6" md="3">
                                投票议题：{{ (BallotList.get(item.id))[0] }}
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                同意比例：{{ (BallotList.get(item.id))[1] / (BallotList.get(item.id))[3] }}
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                反对比例：{{ (BallotList.get(item.id))[2] / (BallotList.get(item.id))[3]}}
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12">
                <v-banner elevation="2" color="yellow">
                    <v-icon dark>
                        mdi-wrench
                    </v-icon>
                    我参与的众筹项目
                </v-banner>
            </v-col>
            <v-col cols="12" v-for="item in InfoList" :key="item.id" >
                <v-card v-if="item[8].length > 0 && item[8].includes(userAddr)">
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="overline mb-4">
                                开始时间：{{ item["3"] }} 结束时间：{{ item["4"] }}
                            </div>
                            <v-list-item-title class="headline mb-1">
                                项目概述: {{ item["1"] }}
                            </v-list-item-title>
                            <v-list-item-subtitle>项目描述：{{ item["2"] }}</v-list-item-subtitle>
                            <v-list-item-subtitle>目标金额：{{ item["5"] }}</v-list-item-subtitle>
                            <v-list-item-subtitle>筹得金额：{{ item["6"] }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar
                        v-if="item[7]"
                        tile
                        size="80"
                        color="green"
                        >
                            目标达成
                            <v-icon dark>
                                mdi-checkbox-marked-circle
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-avatar
                        v-else-if="item[4] > new Date()"
                        tile
                        size="80"
                        color="yellow"
                        >
                            正在进行
                            <v-icon dark>
                                mdi-wrench
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-avatar
                        v-else
                        tile
                        size="80"
                        color="red"
                        >
                            项目失败
                            <v-icon dark>
                                mdi-cancel
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                        <v-row dense>
                            <v-col cols="12" sm="6" md="3">
                                <div>
                                    当前投票议题：{{ (BallotList.get(item.id))[0] }}
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn
                                outlined
                                rounded
                                text
                                v-on:click="agree(item.id)"
                                >
                                同意
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn
                                outlined
                                rounded
                                text
                                v-on:click="disagree(item.id)"
                                >
                                拒绝
                                </v-btn>
                            </v-col>
                        </v-row>
                        
                        
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
  import {userAddr, InfoList, BallotList} from "../main"
  import {participateProj, CreateBallot, AgreeBallot, DisagreeBallot} from '../util/getContract'
  export default {
      name: 'MyCrowdfunding',
      data: () => ({
            userAddr: userAddr,
            InfoList: InfoList,
            BallotList: BallotList,
            agree: AgreeBallot,
            disagree: DisagreeBallot
      }),
      methods: {
            participate: participateProj,
            createballot: CreateBallot
      }
  }
</script>