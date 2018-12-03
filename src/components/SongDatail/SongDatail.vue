<template>
  <div class="songDatail" v-if='currentMusicList.tracks'>
    <div class="songDatailBg" v-if='currentMusicList.tracks'>
      <img :src="currentMusicList.tracks[currentMusicIndex].al.picUrl">
    </div>
    <div class="songDatailBox">
      <div class='songHeader'>
        <mu-button icon @click='comeBack'>
          <mu-icon value='arrow_back' color='#fff'></mu-icon>
        </mu-button>
        <div class="songTitleBox">
          <div class="songTitle">{{currentMusicList.tracks[currentMusicIndex].name}}</div>
          <div class="songArtist">
            {{getStrAri(currentMusicList.tracks[currentMusicIndex])}}
            <mu-icon size='19' color='#DDD' value="chevron_right"></mu-icon>
          </div>
        </div>
      </div>
      <transition name='Lyric'>
        <Lyric v-if='showLyr' @toggleShowLyr='toggleShowLyr' :songCurrentTime='songCurrentTime' />
      </transition>
      <transition name='SongInfo'>
        <SongInfo v-if='!showLyr' @toggleShowLyr='toggleShowLyr' :isPlaying='isPlaying' />
      </transition>
      <div class="control">
        <div class="progressBar">
          <span class="currentTime">{{secondToMin(songCurrentTime)}}</span>
          <div class="barBox" @touchstart = 'touchstart($event)' @touchmove = 'touchmove($event)' @touchend = 'touchend($event)'>
            <div class="bar" ref='bar'></div>
            <div class="activeBar" ref='activeBar'></div>
            <div class="btn" ref='controlBtn'></div>
          </div>
          <span class="allTime">{{secondToMin(songLong)}}</span>
        </div>
        <div class="controlBtnBox">
          <mu-button flat @click='changeType'>
            <img :src="getPlayTypeUrl">
          </mu-button>
          <mu-button flat @click='beforeSong'>
            <img src="../../public/img/ap7.png">
          </mu-button>
          <mu-button flat large @click='togglePlay'>
            <img class="big" :src="getPlayBtnUrl">
          </mu-button>
          <mu-button flat @click='nextSong'>
            <img src="../../public/img/ap1.png">
          </mu-button>
          <mu-button flat @click ='changeMCListShow'>
            <img src="../../public/img/ar7.png">
          </mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Lyric from './Lyric'
import SongInfo from './SongInfo'
import * as types from '@/store/mutation-types'
export default {
  props: ['isPlaying', 'songLong', 'songCurrentTime'],
  data() {
    return {
      controlDown: false,
      showLyr: false
    }
  },
  computed: {
    ...mapState(['currentMusicList', 'currentMusicIndex', 'playType', 'sheelType']),
    getPlayBtnUrl() {
      if (this.isPlaying) {
        return require('../../public/img/ap3.png')
      } else {
        return require('../../public/img/ap5.png')
      }
    },
    getPlayTypeUrl() {
      if (this.playType === 1) {
        return require('../../public/img/aqi.png')
      } else if (this.playType === 2) {
        return require('../../public/img/aqq.png')
      } else if (this.playType === 3) {
        return require('../../public/img/ar4.png')
      }
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
    comeBack() {
      this.$emit('close')
    },
    togglePlay() {
      if (this.isPlaying) {
        this.$emit('toPause')
      } else {
        this.$emit('toPlay')
      }
    },
    changeType() {
      this.$store.commit(types.CHANGE_PLAYTYPE)
    },
    getRandom(arrLength, nowIndex) {
      let res = Math.floor(Math.random() * (arrLength))
      if (res !== nowIndex) {
        return res
      }
      this.getRandom(arrLength, nowIndex)
    },
    toChangeMusic(num) {
      if (this.playType === 1) {
        let nowIndex = this.currentMusicIndex
        let arrLength = this.currentMusicList.tracks.length
        let newIndex
        if (nowIndex > arrLength - 1) {
          newIndex = 0
        } else {
          newIndex = nowIndex + num
          if (newIndex < 0) {
            newIndex = arrLength - 1
          }
        }
        this.$store.commit(types.CHANGE_CURRENT_MUSIC_INDEX, newIndex)
      } else if (this.playType === 2) {
        this.toPlay()
      } else if (this.playType === 3) {
        let nowIndex = this.currentMusicIndex
        let arrLength = this.currentMusicList.tracks.length
        let newIndex = this.getRandom(arrLength, nowIndex)
        this.$store.commit(types.CHANGE_CURRENT_MUSIC_INDEX, newIndex)
      }
    },
    beforeSong() {
      this.toChangeMusic(-1)
    },
    nextSong() {
      this.toChangeMusic(1)
    },
    changeMCListShow() {
      this.$emit('changeMCListShow')
    },
    secondToMin(second) {
      let sec = parseInt(second)
      let s = sec % 60 + ''
      let m = parseInt(sec / 60) + ''
      if (s.length < 2) {
        s = '0' + s
      }
      if (m.length < 2) {
        m = '0' + m
      }
      let res = m + ':' + s
      return res
    },
    changeBarPos(e) {
      let pageX = e.changedTouches[0].pageX
      let clientW = window.innerWidth
      let barW = this.$refs.bar.offsetWidth
      let offsetL = (clientW - barW) / 2
      let btnW = this.$refs.controlBtn.offsetWidth
      let w = pageX - offsetL
      let l = pageX - offsetL - btnW / 2
      if (w < 0) {
        w = 0
        l = 0
      } else if (w > clientW * 0.7) {
        w = clientW * 0.7
        l = clientW * 0.7 - btnW
      }
      this.$refs.activeBar.style.width = w + 'px'
      this.$refs.controlBtn.style.left = l + 'px'
    },
    touchstart(e) {
      this.controlDown = true
      this.changeBarPos(e)
    },
    touchmove(e) {
      this.changeBarPos(e)
    },
    touchend(e) {
      this.controlDown = false
      let pageX = e.changedTouches[0].pageX
      let clientW = window.innerWidth
      let barW = this.$refs.bar.offsetWidth
      let offsetL = (clientW - barW) / 2
      let scale = (pageX - offsetL) / barW
      let time = parseInt(this.songLong * scale)
      this.$emit('changeMusicTime', time)
    },
    toggleShowLyr() {
      if (this.sheelType === 'music') {
        this.showLyr = !this.showLyr
      }
    }
  },
  watch: {
    songCurrentTime(newVal) {
      if (!this.controlDown) {
        let scale = newVal / this.songLong
        this.$refs.activeBar.style.width = this.$refs.bar.offsetWidth * scale + 'px'
        this.$refs.controlBtn.style.left = (this.$refs.bar.offsetWidth - this.$refs.controlBtn.offsetWidth) * scale + 'px'
      }
    }
  },
  components: {
    Lyric,
    SongInfo
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.songDatail
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 9999
  .songDatailBg
    position: absolute
    top: -100px
    left: -100px
    right: -100px
    bottom: -100px
    filter: blur(30px)
    z-index: -1
    img
      height: 100%
  .songDatailBox
    color: #fff
    width: 100%
    height: 100%
    background-color: rgba(150,150,150,.5)
    .songHeader
      padding-top: 5px
      i
        vertical-align: top
      .songTitleBox
        vertical-align: top
        padding-top: 5px
        display: inline-block
        max-width: 60%
        .songTitle
          font-size: 15px
          max-width: 100%
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .songArtist
          font-size: 12px
          max-width: 100%
          color: #DDD
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
  .control
    position: absolute
    height: 100px
    bottom: 0
    left: 0
    right: 0
    .progressBar
      text-align: center
      div
        display: inline-block
      span
        vertical-align: middle
        font-size: 12px
      .barBox
        width: 70%
        vertical-align: middle
        position: relative
        height: 20px
        .bar
          position: absolute
          left: 0
          top: 50%
          width: 100%
          height: 2px
          border-radius: 20px
          background-color: #CCC
          transform: translateY(-50%)
        .activeBar
          position: absolute
          left: 0
          top: 50%
          z-index: 1
          width: 0%
          height: 2px
          border-radius: 20px
          background-color: red
          transform: translateY(-50%)
        .btn
          position: absolute
          left: 0
          top: 50%
          z-index: 2
          width: 14px
          height: 14px
          border-radius: 50%
          background-color: white
          transform: translateY(-50%)
    .controlBtnBox
      width: 100%
      text-align: center
      padding-top: 12px
      button
        min-width: 0
        vertical-align: middle
        /deep/ .mu-button-wrapper
          padding: 0
        img
          width: 50px
          &.big
            width: 70px
.Lyric-enter-active, .Lyric-leave-active, .SongInfo-enter-active, .SongInfo-enter-active
  transition: .5s all
.Lyric-enter, .Lyric-leave-to, .SongInfo-enter, .SongInfo-enter-to
  opacity: 0
</style>
