<template>
    <v-container>
        <v-row dense>
            <v-col cols="12">
                <v-banner elevation="2" color="primary">
                    <v-icon
                        dark
                        right
                    >
                        mdi-cloud-upload
                    </v-icon>
                    所有众筹项目的金额单位均为WEI
                </v-banner>
            </v-col>
            <v-col cols="12" v-for="item in InfoList" :key="item.id">
                <v-card>
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
                        <v-row dense v-if="item[4] > new Date()">
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field outlined
                                    label="投资金额"
                                    v-model="item.amount"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn
                                outlined
                                rounded
                                text
                                v-on:click="participate(item.id, item.amount)"
                                >
                                投资
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
  import {userAddr, InfoList} from "../main"
  import {participateProj} from '../util/getContract'
  export default {
      name: 'MyCrowdfunding',
      data: () => ({
            userAddr: userAddr,
            InfoList: InfoList,
      }),
      methods: {
          participate: participateProj
      }
  }
</script>