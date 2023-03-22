import { notify } from '../../../main/notifier';
var FormData = require('form-data');
var fs = require('fs');
export const SET_WORKING = 'SET_WORKING';
export const DELETE_WORKING = 'DELETE_WORKING';
export const SET_STOP_ON_SUSPEND = 'SET_STOP_ON_SUSPEND';
export const SET_STOP_ON_SHUTDOWN = 'SET_STOP_ON_SHUTDOWN';

export const state = () => ({
  stopOnSuspend: true,
  stopOnShutdown: true,
  initialized: false,
  working: {}
});

export const mutations = {
  [SET_WORKING](state, data) {
    state.initialized = true;
    state.working = data;
  },
  [DELETE_WORKING](state) {
    state.working = {};
  },
  [SET_STOP_ON_SUSPEND](state, stopOnSuspend) {
    state.stopOnSuspend = stopOnSuspend;
  },
  [SET_STOP_ON_SHUTDOWN](state, stopOnShutdown) {
    state.stopOnShutdown = stopOnShutdown;
  }
};
export const actions = {
  async fetchWorking({ commit, dispatch }) {
    console.log('Got into activities/fetchWorking.');
    // try {
    //   const { data } = await dispatch(
    //     'auth-api/request',
    //     { url: '/v1/activities/working' },
    //     { root: true }
    //   );
    //   commit(SET_WORKING, data);
    // } catch (e) {
    //   dispatch('toast/error', e, { root: true });
    // }
  },
  async update({ commit, dispatch }, payload) {
    try {
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: `/v1/activities/${payload.id}`,
          method: 'put',
          data: {
            activity: payload
          }
        },
        { root: true }
      );
      commit(SET_WORKING, data);
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async stop({ state, commit, dispatch }) {
    console.log('Got into activities/stop func.');
    const id = state.working.id;
    console.log('Timer ID : ' + id);
    if (!id) return;
    try {
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/timer/stop',
          method: 'post',
          data: {
            timerId: id
          }
        },
        { root: true }
      );
      console.log('stop : ' + JSON.stringify(data));
      commit(DELETE_WORKING);
      commit(SET_WORKING, data.log.timer);
      notify({
        title: 'Timer Stop',
        message: data.message
      });
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async add({ state, commit, dispatch }, payload) {
    try {
      const taskid = payload.taskId;
      console.log('Got into activity/add. taskId : ' + taskid);
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/timer/create-start',
          method: 'post',
          data: {
            taskId: taskid
          }
        },
        { root: true }
      );
      console.log(
        'activites/add response timer : ' + JSON.stringify(data.timer)
      );
      if (data.timer.taskId === null) return false;
      commit(SET_WORKING, data.timer);
      console.log('activities/working : ' + JSON.stringify(state.working));
      notify({
        title: 'Timer Start',
        message: data.message
      });
      return true;
    } catch (e) {
      console.log(e);
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async continue({ state, commit, dispatch }) {
    console.log('Got into activities/continue func.');
    const id = state.working.id;
    console.log('Timer ID : ' + id);
    if (!id) return;
    try {
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/timer/continue',
          method: 'post',
          data: {
            timerId: id
          }
        },
        { root: true }
      );
      console.log('continue : ' + JSON.stringify(data));
      commit(DELETE_WORKING);
      commit(SET_WORKING, data.timer);
      notify({
        title: 'Timer Continue',
        message: data.message
      });
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async pause({ state, commit, dispatch }) {
    console.log('Got into activities/pause func.');
    const id = state.working.id;
    console.log('Timer ID : ' + id);
    if (!id) return;
    try {
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/timer/pause',
          method: 'post',
          data: {
            timerId: id
          }
        },
        { root: true }
      );
      console.log('pause : ' + JSON.stringify(data));
      commit(DELETE_WORKING);
      commit(SET_WORKING, data.timer);
      notify({
        title: 'Timer Pause',
        message: data.message
      });
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async delete({ commit, dispatch }, id) {
    try {
      await dispatch(
        'auth-api/request',
        {
          url: `/v1/activities/${id}`,
          method: 'delete'
        },
        { root: true }
      );
      commit(DELETE_WORKING);
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async submitImgs({ state, rootGetters, dispatch }, payload) {
    console.log('Got into activities/submitImgs func.');

    var formData = new FormData();
    for (const itemone of payload) {
      const path = itemone.path;
      const comment =
        itemone.timestamp + ', ' + itemone.activity + ', ' + itemone.comment;
      formData.append('attachment[]', fs.createReadStream(path));
      formData.append('comments[]', comment);
    }
    console.log(JSON.stringify(formData));
    const formHeaders = formData.getHeaders();

    try {
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/attachment/save',
          method: 'post',
          data: formData,
          headers: {
            ...formHeaders
          }
        },
        { root: true }
      );
      console.log('Submit response : ' + JSON.stringify(data));
      notify({
        title: 'Submit',
        message: 'Screenshots submit success'
      });
      return true;
    } catch (e) {
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  async submitComment({ state, rootGetters, dispatch }, payload) {
    try {
      const taskid = payload.taskId;
      const boardid = payload.boardId;
      const groupid = payload.groupId;
      const commentbody = payload.commentBody;
      console.log('Comment : ' + commentbody);
      console.log('Got into activity/submitComment.');
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/comment/create',
          method: 'post',
          data: {
            comment_res: 'long',
            taskId: taskid,
            boardId: boardid,
            groupId: groupid,
            body: commentbody
          }
        },
        { root: true }
      );
      console.log('submitComment response : ' + JSON.stringify(data));
      notify({
        title: 'Submit',
        message: 'Comments submit success'
      });
      return true;
    } catch (e) {
      console.log(e);
      dispatch('toast/error', e, { root: true });
      return false;
    }
  },
  setStopOnSuspend({ commit }, stopOnSuspend) {
    commit(SET_STOP_ON_SUSPEND, stopOnSuspend);
  },
  setStopOnShutdown({ commit }, stopOnShutdown) {
    commit(SET_STOP_ON_SHUTDOWN, stopOnShutdown);
  }
};

export const getters = {
  initialized(state) {
    return state.initialized;
  },
  working(state) {
    return state.working;
  },
  stopOnSuspend(state) {
    return state.stopOnSuspend;
  },
  stopOnShutdown(state) {
    return state.stopOnShutdown;
  }
};

export default {
  state,
  actions,
  getters,
  mutations
};
