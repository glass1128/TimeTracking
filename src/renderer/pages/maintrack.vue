<i18n src="@/assets/locales/pages/index.json" />

<template>
  <section class="index">
    <maintrack-header @quit="confirmExit" />
    <div class="mainTrackContent">
      <v-row>
        <v-col cols="12" class="taskPart">
          <div>
            <v-row>
              <v-col cols="2">
                <base-button type="button" @click="backToBeforePage">
                  <arrow-left-icon
                    size="1.5x"
                    class="custom-class"
                  ></arrow-left-icon>
                </base-button>
              </v-col>
              <v-col cols="5" class="taskInfo">
                <span v-once>{{ taskName }}</span>
              </v-col>
              <v-col cols="5" class="taskInfo">
                <span v-once>{{ groupName }} / {{ boardName }}</span>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" class="trackPart">
          <Split>
            <SplitArea :size="50">
              <ScreenshotList
                :items="items"
                @delShotOne="delScreenshot($event)"
              />
            </SplitArea>
            <SplitArea :size="50" :min-size="200">
              <form class="timePart">
                <v-container fluid>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea v-model="comment" color="teal" rows="3">
                        <template v-slot:label>
                          <div>Commment <small>(optional)</small></div>
                        </template>
                      </v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <div class="content">
                        <div class="timer">
                          <ticker
                            ref="refticker"
                            :started-at="startedAt"
                            :flagconpau="isTimerRunning"
                            :flagstrstp="isTimerStarted"
                            class="tickerCls"
                          />
                          <span v-once>Budget : 00</span>
                          <v-row>
                            <v-col cols="6">
                              <base-button
                                v-if="!isTimerStarted"
                                class="is-primary control-button start"
                                type="button"
                                @click="StrPauConTimer"
                              >
                                <icon name="play-icon" />
                              </base-button>
                              <base-button
                                v-else-if="isTimerRunning"
                                class="is-danger control-button stop"
                                type="button"
                                @click="StrPauConTimer"
                              >
                                <icon name="pause-icon" />
                              </base-button>
                              <base-button
                                v-else
                                class="is-primary control-button continue"
                                type="button"
                                @click="StrPauConTimer"
                              >
                                <icon name="chevrons-right-icon" />
                              </base-button>
                            </v-col>
                            <v-col cols="6">
                              <base-button
                                class="is-primary control-button stop"
                                type="button"
                                @click="stopTimer"
                              >
                                <icon name="square-icon" />
                              </base-button>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <base-button
                        v-if="!isTimerStarted"
                        type="button"
                        class="is-rounded is-primary btnSubmitAll"
                        @click="submitall"
                        >Submit tracked Screenshots+Comment</base-button
                      >
                      <base-button
                        v-else
                        type="button"
                        class="is-rounded is-disabled btnSubmitAll"
                        >Submit tracked Screenshots+Comment</base-button
                      >
                    </v-col>
                  </v-row>
                </v-container>
              </form>
            </SplitArea>
          </Split>
        </v-col>
      </v-row>
    </div>
    <footer class="footer">
      <div class="left">
        <base-button
          type="button"
          class="has-icon web-button"
          @click="openWebsite"
        >
          <icon
            v-tooltip="{ content: $t('website'), offset: 10 }"
            name="globe-icon"
            class="icon is-small"
          />
        </base-button>
      </div>

      <div class="right">
        <base-button
          type="button"
          class="has-icon quit-button"
          @click="confirmExit"
        >
          <icon
            v-tooltip="{ content: $t('quit'), offset: 10 }"
            name="x-circle-icon"
            class="icon is-small"
          />
        </base-button>
        <base-button
          type="button"
          class="has-icon logout-button"
          @click="confirmLogout"
        >
          <icon
            v-tooltip="{ content: $t('logout'), offset: 10 }"
            name="log-out-icon"
            class="icon is-small"
          />
        </base-button>
      </div>
    </footer>
    <confirm-modal
      :text="modalTxt"
      @isOkEvent="OkBtnClicked"
      @isCancelEvent="CancelBtnClicked"
    />
  </section>
</template>

<script>
import BaseButton from '@/components/atoms/base-button';
import MaintrackHeader from '@/components/molecules/maintrack-header';
import Icon from '@/components/atoms/icon';
import ScreenshotList from '@/components/organisms/screenshot-list';
import { mapGetters } from 'vuex';
import { ArrowLeftIcon } from 'vue-feather-icons';
import Ticker from '@/components/atoms/ticker';
import ConfirmModal from '@/components/modals/confirm-modal.vue';
const screenshot = require('screenshot-desktop');
const ioHook = require('iohook');

var kActFlag = false;
var mActFlag = false;
ioHook.on('keyup', event => {
  console.log('keyup event.');
  kActFlag = true;
});
ioHook.on('mouseclick', event => {
  console.log('mouseclick event.');
  mActFlag = true;
});
ioHook.on('mousemove', event => {
  console.log('mousemove event.');
  mActFlag = true;
});
ioHook.on('mousedrag', event => {
  console.log('mousedrag event.');
  mActFlag = true;
});
ioHook.on('mousewheel', event => {
  console.log('mousewheel event.');
  mActFlag = true;
});

function getNow() {
  var dateTime = new Date()
    .toISOString()
    .substr(0, 19)
    .replace('T', ' ');
  console.log(dateTime);
  return dateTime;
}

function getTimeStamp() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;
  var date = today.getDate();
  date = (today.getDate() < 10 ? '0' : '') + today.getDate();

  var time =
    today.getHours() + '.' + today.getMinutes() + '.' + today.getSeconds();
  var dateTime = month + '.' + date + '.' + year + '_' + time;
  return dateTime;
}

function deleteShotsDir() {
  const fs = require('fs');
  const path = require('path');
  var dirPath = '';
  switch (process.platform) {
    case 'darwin':
    case 'win32':
      dirPath =
        process.env.NODE_ENV !== 'development' ? process.resourcesPath : '';
      break;
    default:
      dirPath = '/tmp';
  }
  var FOLDER_PATH = path.join(dirPath, 'shots');
  if (fs.existsSync(FOLDER_PATH)) {
    var files = fs.readdirSync(FOLDER_PATH);
    files.forEach(element => {
      fs.unlinkSync(path.join(FOLDER_PATH, element));
    });
    fs.rmdirSync(FOLDER_PATH);
  }
}

export default {
  name: 'Maintrack',
  components: {
    BaseButton,
    Icon,
    ArrowLeftIcon,
    Ticker,
    MaintrackHeader,
    ScreenshotList,
    ConfirmModal
  },
  data() {
    return {
      items: [],
      idxDelShotOne: undefined,
      taskId: undefined,
      taskName: '',
      boardId: undefined,
      boardName: '',
      groupId: undefined,
      groupName: '',
      comment: '',
      startedAt: undefined,
      stoppedAt: undefined,
      screenshotInterval: undefined,
      deviceInterval: undefined,
      focused: false,
      isTimerRunning: false,
      isTimerStarted: false,
      mActNum: 0,
      kActNum: 0,
      modalTxt: '',
      modalTitle: ''
    };
  },
  computed: {
    ...mapGetters({
      webUrl: 'auth/webUrl',
      working: 'activities/working'
    })
  },
  watch: {
    working() {
      this.setWorkingProps();
    }
  },
  beforeMount() {
    this.$electron.ipcRenderer.send('resize', 730, 600);
  },
  created() {
    if (this.$route.params && this.$route.params !== {}) {
      this.taskId = this.$route.params.taskId;
      this.taskName = this.$route.params.taskName;
      this.boardName = this.$route.params.boardName;
      this.boardId = this.$route.params.boardId;
      this.groupName = this.$route.params.groupName;
      this.groupId = this.$route.params.groupId;
    }
  },
  methods: {
    // Top left project info
    async backToBeforePage() {
      if (this.isTimerStarted) {
        await this.stopTimer();
      }
      deleteShotsDir();
      this.$electron.ipcRenderer.send('resize', 300, 500);
      this.$router.push('/task');
    },
    // // Top left project info

    // Middle left screenshot
    addSource(imgpath, timestamp, actLog, imgurl) {
      this.items.push({
        timestamp: timestamp,
        activity: actLog,
        comment: '',
        // url: source.thumbnail.toDataURL()
        path: imgpath,
        url: imgurl
      });
    },
    getCaptionTimeStamp() {
      return new Date().toLocaleString();
    },
    getDeviceActMsg(displayId) {
      this.kActNum = Math.min(this.kActNum, 100);
      this.mActNum = Math.min(this.mActNum, 100);
      var actMsg =
        'Mouse - ' +
        this.mActNum.toLocaleString() +
        '%' +
        ', Keyboard - ' +
        this.kActNum.toLocaleString() +
        '%, DisplayID - ' +
        displayId;
      this.kActNum = 0;
      this.mActNum = 0;
      return actMsg;
    },
    showSources() {
      screenshot.listDisplays().then(displays => {
        // displays: [{ id, name }, { id, name }]
        for (const displayone of displays) {
          console.log(displayone.id + ' : ' + displayone.name);
          var fname = getTimeStamp();

          var displayId = displayone.id
            .toLocaleString()
            .replace(/[^A-Za-z0-9]/g, '');
          fname = fname + '_' + displayId + '.png';

          var dirPath = '';
          switch (process.platform) {
            case 'darwin':
            case 'win32':
              dirPath =
                process.env.NODE_ENV !== 'development'
                  ? process.resourcesPath
                  : '';
              break;
            default:
              dirPath = '/tmp';
          }

          var path = require('path');
          var fpath = path.join(dirPath, 'shots');

          const fs = require('fs');
          fs.mkdir(fpath, { recursive: true }, err => {
            if (err) console.log(err);
          });
          fpath = path.join(fpath, fname);
          const imgUrl = 'shots' + '/' + fname;

          console.log(fpath);
          // screenshot({ filename: fpath }).then(imgPath => {
          //   // img: Buffer of screenshot of the last display
          //   const actMsg = this.getActMsg(displayId);
          //   this.addSource(imgPath, actMsg);
          // });
          screenshot({ screen: displayone.id, filename: fpath }).then(
            imgPath => {
              const actMsg = this.getDeviceActMsg(displayId);
              const timestamp = this.getCaptionTimeStamp();
              this.addSource(imgPath, timestamp, actMsg, imgUrl);
            }
          );
        }
      });
    },
    // //  Middle left screenshot
    setWorkingProps() {
      const props = this.working || {};
      this.taskId = props.taskId;
      // this.comment = props.comment;
      // this.startedAt = props.startTime;
      // this.stoppedAt = props.endTime;
    },
    async updateActivity() {
      const success = await this.$store.dispatch('activities/update', {
        taskId: this.taskId,
        comment: this.comment
      });
      if (success) {
        this.setWorkingProps();
        this.$store.dispatch('toast/success', this.$t('updated'));
        console.log(this.$ga);
        this.$ga.event('Activity', 'update');
      }
    },
    async startActivity() {
      this.startedAt = getNow();
      console.log('startActivity taskId : ' + this.taskId);
      const success = await this.$store.dispatch('activities/add', {
        taskId: this.taskId
      });
      if (success) {
        this.setWorkingProps();
        console.log(JSON.stringify(this.working));
        // console.log(this.stoppedAt);
        this.$store.dispatch('toast/success', this.$t('started'));
        // this.$ga.event('Activity', 'start');
      }
    },
    async stopActivity() {
      this.startedAt = undefined;
      const success = await this.$store.dispatch('activities/stop');
      if (success) {
        this.$store.dispatch('toast/success', this.$t('stopped'));
        this.$ga.event('Activity', 'stop');
        this.setWorkingProps();
        // this.stoppedAt = getNow();
      }
    },
    async pauseActivity() {
      const success = await this.$store.dispatch('activities/pause');
      if (success) {
        // this.stoppedAt = getNow();
        this.$store.dispatch('toast/success', this.$t('paused'));
      }
    },
    async continueActivity() {
      this.startedAt = getNow();
      const success = await this.$store.dispatch('activities/continue');
      if (success) {
        this.$store.dispatch('toast/success', this.$t('continued'));
      }
    },
    async deleteActivity() {
      await this.$store.dispatch('activities/delete', this.taskId);
      this.$store.dispatch('toast/success', this.$t('deleted'));
      this.$ga.event('Activity', 'delete');
      this.setWorkingProps();
      this.$modal.hide('dialog');
    },
    confirmDeleteActivity() {
      this.$modal.show('dialog', {
        text: this.$t('confirms.delete'),
        buttons: [
          { title: 'Cancel' },
          { title: 'OK', handler: this.deleteActivity }
        ]
      });
    },
    change() {
      if (this.taskId) this.updateActivity();
    },
    startTimer() {
      this.startActivity();
      // Register and start hook
      ioHook.start();
      // Alternatively, pass true to start in DEBUG mode.
      // ioHook.start(true);
      this.screenshotinterval = setInterval(this.incrementTime, 300000);
      this.deviceInterval = setInterval(this.increDeviceTime, 3000);
      this.isTimerStarted = true;
      this.isTimerRunning = true;
      console.log('timer starts');
    },
    pauseTimer() {
      clearInterval(this.screenshotinterval);
      clearInterval(this.deviceInterval);
      this.pauseActivity();
      ioHook.stop();
      this.$refs.refticker.setElapsed();
      this.isTimerRunning = false;
      console.log('timer pause');
    },
    continueTimer() {
      console.log('Got into continueTimer func.');
      this.screenshotinterval = setInterval(this.incrementTime, 300000);
      this.deviceInterval = setInterval(this.increDeviceTime, 3000);
      this.continueActivity();
      // ioHook.start(true);
      ioHook.start();
      this.isTimerRunning = true;
    },
    StrPauConTimer() {
      if (this.isTimerStarted) {
        if (this.isTimerRunning) {
          this.pauseTimer();
        } else {
          this.continueTimer();
        }
      } else {
        this.startTimer();
      }
    },
    incrementTime() {
      console.log('Screenshot is got.');
      this.showSources();
    },
    increDeviceTime() {
      if (mActFlag) this.mActNum++;
      if (kActFlag) this.kActNum++;
      kActFlag = false;
      mActFlag = false;
    },
    async stopTimer() {
      console.log('Got into stopTimer func.');
      clearInterval(this.screenshotinterval);
      clearInterval(this.deviceInterval);
      await this.stopActivity();
      ioHook.stop();
      this.isTimerStarted = false;
    },
    // // Middle right timer

    // Bottom footer
    openWebsite() {
      // this.$electron.shell.openExternal('this.webUrl');
      this.$electron.shell.openExternal('https://app.oc.plus/');
    },
    showSettings() {
      // this.$electron.ipcRenderer.send('showSettings');
      console.log('showSettings func.');
    },
    confirmLogout() {
      // this.$modal.show('dialog', {
      //   text: this.$t('confirms.logout'),
      //   buttons: [{ title: 'Cancel' }, { title: 'OK', handler: this.logout }]
      // });
      this.modalTitle = 'logout';
      this.modalTxt = this.$t('confirms.logout');
      this.$modal.show('confirm-modal');
    },
    OkBtnClicked() {
      if (this.modalTitle === 'logout') {
        this.logout();
      } else if (this.modalTitle === 'exit') {
        this.quit();
      }
    },
    CancelBtnClicked() {
      this.$modal.hide('confirm-modal');
    },
    async logout() {
      if (this.isTimerStarted) {
        await this.stopTimer();
      }
      await this.$store.dispatch('auth/logout');
      // this.$electron.ipcRenderer.send('logout');
      this.$electron.remote.app.relaunch();
      this.$electron.remote.app.exit(0);
    },
    confirmExit() {
      this.modalTitle = 'exit';
      this.modalTxt = this.$t('confirms.exit');
      this.$modal.show('confirm-modal');
    },
    async quit() {
      if (this.isTimerStarted) {
        await this.stopTimer();
      }
      await this.$store.dispatch('auth/logout');
      deleteShotsDir();
      // this.$electron.remote.app.quit();
      const { ipcRenderer } = require('electron');
      ipcRenderer.send('close-me');
    },
    // // Bottom footer

    // event
    delScreenshot(payload) {
      console.log('ShotOne to del : ' + JSON.stringify(payload));
      const idxToDel = payload.idx;
      const whyDel = payload.comment;

      var path = require('path');
      const dirPath =
        process.env.NODE_ENV !== 'development' ? process.resourcesPath : '';
      const delImgPath = path.join(
        dirPath,
        './extra-resources/DeletedScreenshot.png'
      );
      this.items[idxToDel].url = './extra-resources/DeletedScreenshot.png';
      var fs = require('fs');
      fs.unlink(this.items[idxToDel].path, function(err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
      });
      this.items[idxToDel].path = delImgPath;
      this.items[idxToDel].comment = whyDel;
    },
    // // event
    async submitall() {
      // await this.stopTimer();
      if (this.items.length === 0 && this.comment.replace(' ', '') === '') {
        this.$store.dispatch('toast/success', this.$t('nosubmit'));
        return;
      }
      if (this.items !== [] && this.items.length > 0) {
        console.log('Screenshots are not empty.');
        const payloadShots = this.items;
        await this.submitShotsCall(payloadShots);
      }
      if (
        typeof this.comment !== 'undefined' &&
        this.comment !== null &&
        this.comment.replace(' ', '') !== ''
      ) {
        console.log('Comments are not empty.');
        await this.submitcomment();
      }
    },
    async submitShotsCall(payload) {
      const success = await this.$store.dispatch(
        'activities/submitImgs',
        payload
      );
      if (success) {
        deleteShotsDir();
        this.items = [];
        this.$store.dispatch('toast/success', this.$t('submitted'));
      }
    },
    async submitcomment() {
      const payload = {
        taskId: this.taskId,
        boardId: this.boardId,
        groupId: this.groupId,
        commentBody: this.comment
      };
      await this.submitCommentCall(payload);
    },
    async submitCommentCall(payload) {
      const success = await this.$store.dispatch(
        'activities/submitComment',
        payload
      );
      if (success) {
        this.$store.dispatch('toast/success', this.$t('submitted'));
      }
    }
  }
};
// require('electron').ipcRenderer.on('close', function(event) {
//   console.log('Calling function of renderer process from main process.');
//   this.quit();
// });
</script>

<style scoped lang="scss">
.mainTrackContent {
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  flex: 2;
  // height: 530px;
  // position: relative;
}
.taskInfo {
  margin-top: 9px;
  // vertical-align: middle;
  font-size: larger;
  padding-bottom: 0px;
}
.taskPart {
  padding-bottom: 0px;
}
.trackPart {
  padding-top: 0px;
  padding-bottom: 0px;
}
.screenshotList {
  overflow: hidden;
  overflow-y: scroll;
}
.index {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.footer {
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  background-color: $grey-fafafa;
  border-top: 1px $grey-eee solid;
  height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  .icon {
    color: $text;
  }
}
.left {
  display: flex;
  .icon {
    margin-right: 20px;
  }
}
.right {
  display: flex;
  .quit-button {
    z-index: 1;
  }
  .icon {
    margin-left: 20px;
  }
}
.empty-message {
  display: flex;
  flex: 1;
  width: 100%;
  padding: 10px 0;
  justify-content: center;
  color: $text-light;
}
.big-timer {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;
}
.project-select {
  padding: 0 30px;
}
.form {
  position: fixed;
  top: 30px;
  width: 100%;
  background: #fff;
  box-shadow: 0 3px 5px #00000005;
}
.form-item {
  border-bottom: 1px $border solid;
  box-sizing: border-box;
  padding: 0 0;
  height: 65px;
  align-items: center;
  display: flex;
}
.comment {
  height: 100%;
  width: 100%;
  padding: 0 30px;
  border: 0;
}
.suggestion-list-wrapper {
  position: absolute;
  animation-duration: 150ms;
  width: 100%;
  background-color: #00000050;
  height: 100vh;
}
.suggestion-list {
  list-style-type: none;
  list-style-position: inside;
  padding: 0;
  background-color: #fffffffe;
  box-shadow: 0 3px 5px #00000010;
  margin: 0;
  max-height: calc(60px * 4);
  overflow: hidden;
  overflow-y: scroll;
}
.suggestion {
  display: flex;
  align-items: center;
  height: 60px;
  box-sizing: border-box;
  padding: 0 30px;
  border-bottom: 1px $border solid;
  &:last-child {
    border: 0;
    padding-bottom: 2px;
  }
  &:hover {
    background-color: lighten($grey-f5f5f5, 2%);
  }
}
.delete-button {
  position: absolute;
  bottom: 15px;
  right: 10px;
}
.submit-button {
  display: flex;
  align-self: center;
  flex-shrink: 0;
  margin-bottom: 5px;
  pointer-events: auto;
  justify-content: center;
}
.timer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  time {
    font-size: 46px;
    font-family: $font-family-duration;
    font-weight: 300;
    margin-bottom: 10px;
  }
}
.control-button {
  display: flex;
  align-self: center;
  flex-shrink: 0;
  padding: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  pointer-events: auto;
  box-shadow: 0 3px 3px #00000010;
}
.control-button .icon {
  width: 22px;
  height: 22px;
}
.control-button.start .icon {
  padding-left: 3px;
}
.control-button.continue {
  background-color: green;
}
.timePart {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}
.modal {
  display: block;
}
.btnSubmitAll {
  margin: auto;
}
.tickerCls {
  margin-top: -30px;
}
</style>
