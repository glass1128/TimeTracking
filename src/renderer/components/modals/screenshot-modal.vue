<template>
  <modal
    name="screenshot-modal"
    transition="pop-out"
    :pivot-x="modalPosX"
    :pivot-y="modalPosY"
    :width="modalWidth"
    :height="modalHeight"
    @before-close="beforeClose"
  >
    <v-row>
      <v-col cols="12">
        <div align="center" justify="center">
          {{ shotone.timestamp }}, {{ shotone.activity }}
        </div>
      </v-col>
      <v-col cols="12" class="imgOne">
        <v-img
          contain
          align="center"
          justify="center"
          :src="shotone.path"
          :height="imgHeight"
          aspect-ratio="1.7"
          class="ma-3 pt-3"
        />
      </v-col>
      <v-col cols="12" class="commentOne">
        <v-textarea
          v-model="comment"
          color="teal"
          rows="2"
          class="ma-3 pt-3"
          label="Comment (Optional)"
        >
        </v-textarea>
      </v-col>
      <v-col cols="6" class="buttons">
        <base-button
          type="button"
          class="is-rounded is-primary btnOne"
          @click="btnDeleteClicked"
        >
          Delete
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
const MODAL_WIDTH = 680;
const MODAL_HEIGHT = 550;
export default {
  name: 'ScreenshotModal',
  components: {
    BaseButton
  },
  props: {
    shotone: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      modalWidth: MODAL_WIDTH,
      modalHeight: MODAL_HEIGHT,
      modalPosX: 0.1,
      modalPosY: 0.5,
      comment: '',
      imgHeight: undefined
    };
  },
  created() {
    this.modalWidth =
      window.innerWidth - 50 < MODAL_WIDTH
        ? MODAL_WIDTH
        : window.innerWidth - 50;
    this.modalHeight =
      window.innerHeight - 50 < MODAL_HEIGHT
        ? MODAL_HEIGHT
        : window.innerHeight - 50;

    this.imgHeight = this.modalHeight * 0.6;
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
      console.log('btnCan clicked.');
      // this.$emit('close');
      this.$emit('isCancelScrShot');
    },
    btnDeleteClicked() {
      console.log('btnDel clicked.');
      this.$emit('isDelScrShot', this.comment);
      // this.$emit('modal-close');
    }
  }
};
</script>
<style lang="scss">
$background_color: #404142;
$github_color: #dba226;
$facebook_color: #3880ff;
.box {
  background: white;
  overflow: hidden;
  width: 656px;
  height: 400px;
  border-radius: 2px;
  box-sizing: border-box;
  box-shadow: 0 0 40px black;
  color: #8b8c8d;
  font-size: 0;
  .box-part {
    display: inline-block;
    position: relative;
    vertical-align: top;
    box-sizing: border-box;
    height: 100%;
    width: 50%;
  }
  .partition {
    width: 100%;
    height: 100%;
    .partition-title {
      box-sizing: border-box;
      padding: 30px;
      width: 100%;
      text-align: center;
      letter-spacing: 1px;
      font-size: 20px;
      font-weight: 300;
    }
    .partition-form {
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
  .button-set {
    margin-bottom: 8px;
  }
  .autocomplete-fix {
    position: absolute;
    visibility: hidden;
    overflow: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
  }
}
.pop-out-enter-active,
.pop-out-leave-active {
  transition: all 0.5s;
}
.pop-out-enter,
.pop-out-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
.imgOne {
  margin-top: -28px;
}
.commentOne {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: -25px;
  margin-bottom: -5px;
}
.buttons {
  margin-bottom: -15px;
  margin-top: -15px;
}
.btnOne {
  justify-content: center;
  align-content: center;
  margin: auto;
}
</style>
