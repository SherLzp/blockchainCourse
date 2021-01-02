<template>
  <v-app>
    <v-card>
      <v-toolbar
        color="cyan"
        dark
        flat
      >
        <v-toolbar-title>{{title}}</v-toolbar-title>
      </v-toolbar>
      <v-tabs v-model="activeTab" centered>
        <v-tab
          v-for="item in items" :key="item.id" :to="item.route"
        >
        {{ item.title }}
        </v-tab>
      </v-tabs>
      <router-view></router-view>
    </v-card>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    activeTab: '',
    items: [
      {
        id: 1,
        title: '发起众筹',
        route: '/'
      },
      {
        id: 2,
        title: '参与众筹',
        route: '/join'
      },
      {
        id: 3,
        title: '我的众筹',
        route: '/my'
      }
    ],
    title: "基于ETH的众筹DApp",
  }),
};
</script>
