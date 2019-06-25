import * as types from './mutation-types'
import Vue from 'vue'
import * as urls from '../api/urls.js'
export default {
  toLogin({commit}, payload) {
    return new Promise((resolve, reject) => {
      let phone = payload.phone
      let password = payload.passwd
      commit(types.CHANGE_AJAX, true)
      Vue.axios.get(urls.login, {params: { phone, password }})
        .then((res) => {
          commit(types.CHANGE_LOGIN_ID, res.data.account.id)
          commit(types.TOGGLE_LOGIN, true)
          commit(types.CHANGE_AJAX, false)
          commit(types.CHANGE_AFTERSSTATUS, true)
          resolve()
        })
        .catch(() => {
          commit(types.CHANGE_AJAX, false)
          reject(new Error(''))
        })
    })
  },
  toLogout({commit}) {
    Vue.axios.get(urls.logout)
      .then(() => {
        commit(types.TOGGLE_LOGIN, false)
        commit(types.CHANGE_LOGIN_ID, '')
      })
  },
  getUserDetail({state, commit}) {
    Vue.axios.get(urls.userDetail, {params: { uid: state.loginId }})
      .then((res) => {
        // console.log(res)
        commit(types.CHANGE_USER_DETAIL, res.data)
      })
      .catch(() => {
        console.log('noLogin')
        commit(types.TOGGLE_LOGIN, false)
      })
  },
  getUserStatus({commit}) {
    return new Promise((resolve, reject) => {
      commit(types.CHANGE_AJAX, true)
      Vue.axios.get(urls.loginStatus)
        .then((res) => {
          commit(types.TOGGLE_LOGIN, true)
          commit(types.CHANGE_LOGIN_ID, res.data.profile.userId)
          commit(types.CHANGE_AJAX, false)
          commit(types.CHANGE_AFTERSSTATUS, true)
          resolve(res)
        })
        .catch(() => {
          commit(types.TOGGLE_LOGIN, false)
          commit(types.CHANGE_AJAX, false)
          reject(new Error('未登录'))
        })
    })
  },
  getSongSheets({state}, id) {
    return new Promise((resolve) => {
      let userId = state.loginId
      if (id) {
        userId = id
      }
      Vue.axios.get(urls.playlist, { params: { uid: userId } })
       .then((res) => {
          resolve(res)
       })
    })
  },
  getVideoArr({state, commit}) {
    return new Promise((resolve) => {
      Vue.axios.get(urls.video)
       .then((res) => {
          commit(types.CHANGE_VIDEOARR, res.data.data)
          resolve()
       })
    })
  },
  getStationClass({commit}) {
    Vue.axios.get(urls.djList)
      .then((res) => {
        commit(types.ADD_STATION_CLASS, res.data.categories)
      })
  },
  getCurrentSheel({commit}, id) {
    commit(types.CHANGE_AJAX, true)
    Vue.axios.get(urls.playListDetail + '?id=' + id)
        .then((res) => {
          let arr = res.data.playlist.tracks.filter((item, index) => {
            return index < 999
          })
          res.data.playlist.tracks = [...arr]
          commit(types.CHANGE_CURRENT_SHEEL, res.data.playlist)
          commit(types.TOGGLE_CURRENT_SHEEL_SHOW, true)
          commit(types.CHANGE_AJAX, false)
        })
        .catch(() => {
          Vue.$toast.error('获取失败')
          commit(types.CHANGE_AJAX, false)
        })
  },
  getCurrentDjSheel({state, commit}, playload) {
    return new Promise((resolve) => {
      let rid = playload.id
      let offset = playload.offset
      commit(types.CHANGE_AJAX, true)
      Vue.axios.get(urls.djPro, {params: { rid, offset, limit: 40 }})
        .then((res) => {
          let tracks = res.data.programs
          tracks.map((item) => {
            item.al = {picUrl: item.coverUrl}
            item.ar = [{name: item.dj.nickname}]
          })
          console.log(tracks)
          if (playload.add) {
            commit(types.CHANGE_CURRENT_DJ_SHEEL_ADD, tracks)
          } else {
            commit(types.CHANGE_CURRENT_DJ_SHEEL, {tracks})
          }
          commit(types.CHANGE_AJAX, false)
          commit(types.CHANGE_CURRENT_DJ_SHEEL_SHOW, true)
          resolve()
        })
        .catch(() => {
          Vue.$toast.error('获取失败')
          commit(types.CHANGE_AJAX, false)
        })
    })
  }
}
