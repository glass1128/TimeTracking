<template>
  <modal
    name="confirm-modal"
    transition="pop-out"
    :width="modalWidth"
    :height="modalHeight"
    @before-close="beforeClose"
  >
    <v-row>
      <v-col cols="12">
        <div align="center" justify="center" class="ma-1">
          {{ text }}
        </div>
      </v-col>
      <v-col cols="6" class="buttons">
        <base-button
          type="button"
          class="is-rounded is-primary btnOne"
          @click="btnOkClicked"
        >
          OK
        </base-button>
      </v-col>
      <v-col cols="6" class="buttons">
        <base-button
          type="button"
          class="is-rounded is-primary btnOne"
          @click="btnCancelClicked"
        >
          Cancel
        </base-button>
      </v-col>
    </v-row>
  </modal>
</template>
<script>
import BaseButton from '@/components/atoms/base-button';
const MODAL_WIDTH = 280;
const MODAL_HEIGHT = 120;
export default {
  name: 'ComfirmModal',
  components: {
    BaseButton
  },
  props: {
    text: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      modalWidth: MODAL_WIDTH,
      modalHeight: MODAL_HEIGHT
    };
  },
  created() {
    this.modalWidth = MODAL_WIDTH;
    this.modalHeight = MODAL_HEIGHT;
  },
  methods: {
    beforeClose(event) {
      console.log(event);
      // If modal was open less then 5000 ms - prevent closing it
      if (this.time + this.duration < Date.now()) {
        event.stop();
      }
    },
    btnCancelClicked() {
      this.$emit('isCancelEvent');
    },
    btnOkClicked() {
      this.$emit('isOkEvent');
    }
  }
};
</script>
<style lang="scss">
.pop-out-enter-active,
.pop-out-leave-active {
  transition: all 0.5s;
}
.pop-out-enter,
.pop-out-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
.buttons {
  margin-bottom: -15px;
  margin-top: -15px;
}
.btnOne {
  justify-content: center;
  align-content: center;
  margin: auto;
  width: 85px;
}
</style>
