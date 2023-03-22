<template>
  <div class="list">
    <div v-for="(item, idx) in items" :key="item + idx" class="ma-2">
      <div class="subheading pt-4">
        {{ item.timestamp }}<br />{{ item.activity }}
      </div>
      <v-img
        :src="item.path"
        aspect-ratio="1.7"
        @click="manageScreenshot(item, idx)"
      ></v-img>
    </div>
    <screenshot-modal
      :shotone="shotone"
      :shotidx="shotidx"
      @isDelScrShot="DelScrShot($event)"
      @isCancelScrShot="HideModal"
    />
  </div>
</template>

<script>
import ScreenshotModal from '../modals/screenshot-modal.vue';
export default {
  name: 'ScreenshotList',
  components: {
    ScreenshotModal
  },
  props: {
    items: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      shotone: {},
      shotidx: undefined
    };
  },
  methods: {
    initOne(item, idx) {
      this.shotone = item;
      this.shotidx = idx;
    },
    manageScreenshot(item, idx) {
      this.initOne(item, idx);
      this.$modal.show('screenshot-modal');
    },
    DelScrShot(whyDelete) {
      console.log('DelScrShot in screenshot-list.vue');
      const payload = { idx: this.shotidx, comment: whyDelete };
      this.$emit('delShotOne', payload);
      this.$modal.hide('screenshot-modal');
    },
    HideModal() {
      this.$modal.hide('screenshot-modal');
    }
  }
};
</script>

<style scoped lang="scss">
.list {
  overflow: hidden;
  overflow-y: scroll;
  height: 450px;
}
.modal {
  display: block;
}
</style>
