export const state = {};

export const mutations = {};

export const actions = {
  async fetchTaskTree({ state, commit, dispatch }) {
    console.log('Got into fetchTaskTree func');
    try {
      const { data } = await dispatch(
        'auth-api/request',
        {
          url: '/api/v1/group',
          method: 'get',
          data: {
            board_res: 'long'
          }
        },
        { root: true }
      );
      var ret = [];
      var idx = 1;
      for (var i = 0; i < data.groups.length; i++) {
        var element = data.groups[i];
        var arrayboard = [];
        for (var j = 0; j < data.groups[i].boards.length; j++) {
          var subelement = data.groups[i].boards[j];
          var array = [];
          for (var k = 0; k < data.groups[i].boards[j].tasks.length; k++) {
            var innersubelem = data.groups[i].boards[j].tasks[k];
            var taskone = {
              id: idx,
              taskId: innersubelem.id,
              name: innersubelem.name,
              grpId: element.id,
              grpName: element.name,
              brdId: subelement.id,
              brdName: subelement.name,
              type: 'Task'
            };
            idx += 1;
            array.push(taskone);
          }
          var subone = {
            // id: subelement.id,
            id: idx,
            name: subelement.name,
            type: 'Board',
            children: array
          };
          idx += 1;
          arrayboard.push(subone);
        }
        var one = {
          // id: element.id,
          id: idx,
          name: element.name,
          type: 'Group',
          children: arrayboard
        };
        idx += 1;
        ret.push(one);
      }
      // console.log(JSON.stringify(ret));
      return ret;
    } catch (e) {
      console.log(e);
      dispatch('toast/error', e, { root: true });
      return null;
    }
  }
};

export default {
  state,
  mutations,
  actions
};
