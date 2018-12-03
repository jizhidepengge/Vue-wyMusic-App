import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)

const state = {
  isLogin: false,
  loginId: '',
  userDetail: '',
  afterStatus: false,
  isAjax: false,
  findNavActive: 0,
  videoArr: [],
  stationClass: [],
  currentMusicList: [],
  currentMusicIndex: 0,
  currentSheel: [],
  currentSheelShow: false,
  currentDjSheel: [],
  currentDjSheelShow: false,
  sheelType: 'music',
  miniPlayerShow: true,
  perMusic: 0,
  playType: 1
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
