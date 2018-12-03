import * as types from './mutation-types'

export default {
  [types.TOGGLE_LOGIN](state, toChange) {
    state.isLogin = toChange
  },
  [types.CHANGE_LOGIN_ID](state, id) {
    state.loginId = id
  },
  [types.CHANGE_USER_DETAIL](state, data) {
    state.userDetail = data
  },
  [types.CHANGE_AJAX](state, toChange) {
    state.isAjax = toChange
  },
  [types.CHANGE_AFTERSSTATUS](state, toChange) {
    state.afterStatus = toChange
  },
  [types.CHANGE_FIND_NAV_ACTIVE](state, index) {
    state.findNavActive = index
  },
  [types.CHANGE_VIDEOARR](state, data) {
    state.videoArr = data
  },
  [types.ADD_STATION_CLASS](state, data) {
    state.stationClass = data
  },
  [types.CHANGE_CURRENT_SHEEL](state, data) {
    state.currentSheel = data
  },
  [types.TOGGLE_CURRENT_SHEEL_SHOW](state, toChange) {
    state.currentSheelShow = toChange
  },
  [types.TOGGLE_MINIPLAYER_SHOW](state, toChange) {
    state.miniPlayerShow = toChange
  },
  [types.CHANGE_CURRENT_MUSIC_LIST](state, data) {
    state.currentMusicList = data
  },
  [types.CHANGE_CURRENT_MUSIC_INDEX](state, index) {
    state.currentMusicIndex = index
  },
  [types.CHANGE_PREMUSIC](state, percent) {
    state.perMusic = percent
  },
  [types.CHANGE_PLAYTYPE](state) {
    let playType = state.playType
    if (playType === 3) {
      state.playType = 1
    } else {
      state.playType = playType + 1
    }
  },
  [types.DEL_CURRENT_MUSIC](state, index) {
    let data = state.currentSheel
    data.tracks.splice(index, 1)
    state.currentSheel = data
    if (state.currentMusicIndex > index) {
      --state.currentMusicIndex
    }
  },
  [types.CHANGE_CURRENT_DJ_SHEEL](state, data) {
    state.currentDjSheel = data
  },
  [types.CHANGE_CURRENT_DJ_SHEEL_ADD](state, data) {
    data.map((item) => {
      state.currentDjSheel.tracks.push(item)
    })
  },
  [types.CHANGE_CURRENT_DJ_SHEEL_SHOW](state, toChange) {
    state.currentDjSheelShow = toChange
  },
  [types.CHANGE_SHEELTYPE](state, toChange) {
    state.sheelType = toChange
  }
}
