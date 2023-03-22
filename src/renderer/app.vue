<template>
  <div id="app">
    <v-app id="inspire">
      <router-view></router-view>
      <toast />
      <v-dialog width="80%" />
    </v-app>
  </div>
</template>

<script>
import Toast from './components/molecules/toast';

export default {
  name: 'OC',
  components: {
    Toast
  },
  data() {
    return {
      animation: {}
    };
  }
};
</script>

<style lang="scss">
@import './src/renderer/assets/sass/main';
@import './src/renderer/assets/sass/v-tooltip';
#app {
  overflow-y: hidden;
}
</style>
