<template>
  <header class="maintrack-header">
    <div class="left">
      <v-img contain src="static/header_icon_32x32.png" class="ma-1 pt-1" />
      <span v-once class="title" align="center">Time-Tracker</span>
    </div>
    <div class="middle" />
    <div class="right">
      <base-button
        type="button"
        class="has-icon minimize-button"
        @click="minimize"
      >
        <icon
          v-tooltip="{ content: 'Minimize', offset: 10 }"
          name="minimize-2-icon"
          class="icon is-small"
        />
      </base-button>
      <base-button type="button" class="has-icon quit-button" @click="quit">
        <icon
          v-tooltip="{ content: 'Quit', offset: 10 }"
          name="x-icon"
          class="icon is-small"
        />
      </base-button>
    </div>
  </header>
</template>

<script>
import Icon from '@/components/atoms/icon';
import BaseButton from '@/components/atoms/base-button';

export default {
  components: {
    Icon,
    BaseButton
  },
  methods: {
    quit() {
      this.$emit('quit');
    },
    minimize() {
      const { remote } = require('electron');
      remote.BrowserWindow.getFocusedWindow().minimize();
    }
  }
};
</script>

<style scoped lang="scss">
.maintrack-header {
  display: flex;
  position: fixed;
  top: 0;
  align-items: center;
  justify-content: space-between;
  background-color: #3769a7;
  height: 45px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  z-index: index($z, maintrack-header);
}
.is-small {
  height: 30px;
}
.is-light {
  background-color: $grey-fafafa;
  border-bottom: 1px $grey-eee solid;
}
.menu-button {
  transition: all 0.2s;
  padding: 6px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: 0;
  transition: all 0.3s ease;
  &:active {
    transform: scale(0.97);
  }
  &:hover {
    background: darken($background-dark, 5%);
  }
  .icon {
    color: $grey-f5f5f5;
  }
}
.left {
  display: flex;
  -webkit-app-region: drag;
  .icon {
    margin-right: 20px;
  }
}
.middle {
  flex: 1;
  height: 100%;
  -webkit-app-region: drag;
}
.right {
  display: flex;
  .minimize-button {
    z-index: 1;
  }
  .icon {
    margin-left: 20px;
    color: white;
  }
}
.title {
  color: white;
  margin: auto;
}
</style>
