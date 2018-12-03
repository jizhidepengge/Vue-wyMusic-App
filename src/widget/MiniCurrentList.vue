<template>
  <div class="miniCurrentList">
    <div class="miniCurrentListBox">
      <div class="miniCurrentListTitle">
        <div class="leftBox">
          <mu-button flat @click = 'changeType'>
              <img :src="getType.icon">
              <span v-if='currentMusicList.tracks'>{{getType.txt+'  '}}({{currentMusicList.tracks.length}})</span>
          </mu-button>
        </div>
        <div class="rightBox">
          <mu-button flat @click='delList'>
            <mu-icon value='delete_forever' color='#CCC'></mu-icon>
          </mu-button>
        </div>
      </div>
      <div class="mCLScroll" ref='mCLScroll'>
        <div class="mCLBox">
          <mu-button flat large class="miniCurrentListItem" v-for='(item, index) in currentMusicList.tracks' :key='index' @click='changeSong(index)'>
            <div class="box">
              <div class="leftBox" :class='index === currentMusicIndex?"active":""'>{{item.name}}<span :class='index === currentMusicIndex?"active":""'>{{'-'+getStrAri(item)}}</span></div>
              <div class="rightBox">
                <mu-button flat @click.stop='del(index)'>
                  <mu-icon :size='20' value='close' color='#CCC'></mu-icon>
                </mu-button>
              </div>
            </div>
          </mu-button>
        </div>
      </div>
    </div>
    <div class="miniCurrentListSheetBg" @click='closeSelf'></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import * as types from '@/store/mutation-types'
const mapBtnIcon = [
  {type: 1, icon: require('../public/img/order.png'), txt: '列表循环'},
  {type: 2, icon: require('../public/img/one.png'), txt: '单曲循环'},
  {type: 3, icon: require('../public/img/rand.png'), txt: '随机播放'}
]
export default {
  mounted() {
    this.mCLBScroll = new BScroll(this.$refs.mCLScroll, {
      click: true
    })
  },
  update() {
    if (this.mCLBScroll) {
      this.mCLBScroll.refresh()
    }
  },
  computed: {
    ...mapState(['currentMusicList', 'currentMusicIndex', 'playType']),
    getType() {
      let res = this.mapBtnIcon.find((item) => {
        return item.type === this.playType
      })
      return res
    }
  },
  data() {
    return {
      mapBtnIcon
    }
  },
  methods: {
    getStrAri(json) {
      let arArr = json.ar
      let ar = ''
      for (var i = 0; i < arArr.length; i++) {
         ar += arArr[i].name
         ar += '/'
      }
      ar = ar.slice(0, -1)
      return ar
    },
    changeType() {
      this.$store.commit('CHANGE_PLAYTYPE')
    },
    closeSelf() {
      this.$emit('close')
    },
    changeSong(i) {
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_INDEX, i)
    },
    delList() {
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_LIST, {})
      this.closeSelf()
    },
    del(i) {
      this.$store.commit(types.DEL_CURRENT_MUSIC, i)
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.miniCurrentList
  position: fixed
  bottom: 0
  z-index: 10001
  width: 100%
  height: 320px
  padding-bottom: 10px
  .miniCurrentListBox
    position: fixed
    left: 0
    right: 0
    bottom: 0
    z-index: 2
    height: 320px
    background-color: #fff
    padding-bottom: 10px
    .miniCurrentListTitle
      padding: 5px 0
      border-bottom: 1px solid #DDD
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      .leftBox
        float: left
        img
          width: 20px
        span
          margin-left: 5px
          font-size: 14px
      .rightBox
        float: right
        button
          min-width: 40px
    .mCLScroll
      position: fixed
      bottom: 0
      left: 0
      right: 0
      height: 273px
      overflow: hidden
      .miniCurrentListItem
        border-bottom: 1px solid #EEE
        width: 100%
        /deep/ .mu-button-wrapper
          padding: 0
        .box
          width: 100%
          text-align: left
          .leftBox
            padding-left: 10px
            height: 36px
            float: left
            max-width: 70%
            overflow: hidden
            font-size: 14px
            &.active
              color: red
            span
              margin-left: 5px
              font-size: 12px
              color: #999
              &.active
                color: red
          .rightBox

            height: 36px
            float: right
            button
              min-width: 0px
              /deep/ .mu-button-wrapper
                padding: 0 10px
  .miniCurrentListSheetBg
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 320px
    background-color: rgba(7,17,27,.6)
    z-index: 1
</style>
