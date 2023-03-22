<template>
  <section class="index">
    <main-header />
    <div class="SelTask">
      <v-card class="mx-auto" max-width="500">
        <v-sheet class="pa-4 primary lighten-2">
          <v-row>
            <div class="left">
              <v-text-field
                v-model="search"
                label="Search Task"
                dark
                flat
                solo-inverted
                hide-details
                clearable
                clear-icon="mdi-close-circle-outline"
                @click="expandAll()"
              ></v-text-field>
            </div>
            <div class="right">
              <base-button type="button" class="has-icon" @click="refreshPage">
                <icon
                  v-tooltip="{ content: 'Refresh', offset: 10 }"
                  name="refresh-cw-icon"
                  class="icon is-small"
                />
              </base-button>
            </div>
          </v-row>
          <v-checkbox
            v-model="caseSensitive"
            dark
            hide-details
            label="Case sensitive search"
          ></v-checkbox>
        </v-sheet>
        <v-card-text class="taskList">
          <v-treeview
            ref="tasktreeview"
            :items="items"
            :search="search"
            :filter="filter"
            :open.sync="open"
          >
            <template slot="label" slot-scope="{ item }">
              <v-icon v-if="item.type === 'Task'"></v-icon>
              <v-icon
                v-else
                v-text="
                  `mdi-${item.type === 'Group' ? 'group' : 'developer-board'}`
                "
              ></v-icon>
              <a v-if="item.type === 'Task'" @click="showMainTrack(item)">{{
                item.name
              }}</a>
              <span v-else>{{ item.name }}</span>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </div>
  </section>
</template>

<script>
import Icon from '@/components/atoms/icon';
import BaseButton from '@/components/atoms/base-button';
import MainHeader from '@/components/molecules/main-header';
export default {
  name: 'Task',
  components: {
    BaseButton,
    Icon,
    MainHeader
  },
  data: () => ({
    items: [],
    open: [1, 2],
    search: null,
    caseSensitive: false
  }),
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    }
  },
  beforeMount() {
    this.$electron.ipcRenderer.send('resize', 300, 500);
    this.getItems();
  },
  methods: {
    expandAll() {
      this.$refs['tasktreeview'].updateAll(true);
    },
    showMainTrack(item) {
      // this.$electron.ipcRenderer.send('showMainTrack');
      const payload = {
        taskId: item.taskId,
        taskName: item.name,
        boardId: item.brdId,
        boardName: item.brdName,
        groupId: item.grpId,
        groupName: item.grpName
      };
      this.$router.push({
        name: 'Maintrack',
        params: payload
      });
    },
    getItems() {
      console.log('Got into getItems func.');
      const payload = this.$store.dispatch('task/fetchTaskTree');
      payload.then(value => {
        this.items = value;
      });
    },
    refreshPage() {
      this.getItems();
    }
  }
};
</script>

<style scoped lang="scss">
@import url('https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css');
.btnRefresh {
  color: white;
}
.left {
  display: flex;
  width: 320px;
}
.right {
  display: flex;
  .icon {
    margin-left: 20px;
    color: white;
  }
}
.index {
  display: flex;
  flex-direction: column;
  height: 100vh;
  // overflow: hidden;
}
.SelTask {
  margin-top: 42px;
}
.taskList {
  overflow: scroll;
  height: 433px;
}
</style>
