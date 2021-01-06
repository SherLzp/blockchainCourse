<template>
  <div>
    <v-text-field v-model="coinbase"></v-text-field>
  </div>
</template>

<script>
export default {
  name: 'JoinCrowdfunding',
  data: () => ({
    coinbase: global.coinbase
  }),
  methods: {
    participate: function() {
      console.log(this.coinbase)
    }
  }
}
</script>