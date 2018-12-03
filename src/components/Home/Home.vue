<template>
  <div class="home">
    <div class="nav">
      <mu-appbar style="width: 100%;" color="#f10215" z-depth='0'>
        <mu-button icon slot="left" @click='showDrawer=true'>
          <mu-icon size='28' value="menu"></mu-icon>
        </mu-button>
        <div class="navTitle">
          <mu-button icon v-for='(item, index) in arrNavImg' :to='routePath[index]' :key='index'>
            <img class="navImg" :class='actIndex===index?"active":""' :src="item">
          </mu-button>
        </div>
        <mu-button flat slot="right">
          <mu-icon fab size='28' value="search"></mu-icon>
        </mu-button>
      </mu-appbar>
    </div>
    <div class="navPlaceholder"></div>
    <div class="drawer">
      <mu-drawer :open="showDrawer" @close='showDrawer=false' :docked="false" :right="false">
        <div class="drawerUser">
          <div class="isLogin" v-if='isLogin&&userDetail'>
            <div class="avatar">
              <img :src="userDetail.profile.avatarUrl">
            </div>
            <span class="username">{{userDetail.profile.nickname}}</span>
            <div class="lv"><span>lv.{{userDetail.level}}</span></div>
            <div class="btnLogout" :class='isLoginBtnActive?"active":""'  @click='toLogout' @touchstart='isLoginBtnActive=true' @touchend='isLoginBtnActive=false'>退出登录</div>
          </div>
          <div class="noLogin" v-if='!isLogin'>
            <p>登录网易云音乐</p>
            <p>320K高音质无限下载,手机电脑多端同步</p>
            <div class="divBtn" :class='isLoginBtnActive?"active":""' @click='toLogin' @touchstart='isLoginBtnActive=true' @touchend='isLoginBtnActive=false'>
              立即登录
            </div>
          </div>
        </div>
        <mu-list>
          <mu-list-item class='listItem' button v-for='item in drawerList1' :key='item.txt'>
            <div class="box" ref='listItemBox'>
              <mu-list-item-title>{{item.txt}}</mu-list-item-title>
            </div>
          </mu-list-item>
          <Split></Split>
          <mu-list-item class='listItem' button v-for='item in drawerList2' :key='item.txt'>
            <div class="box" ref='listItemBox'>
              <mu-list-item-title>{{item.txt}}</mu-list-item-title>
            </div>
          </mu-list-item>
          <Split></Split>
          <mu-list-item class='listItem' button v-for='item in drawerList3' :key='item.txt'>
            <div class="box" ref='listItemBox'>
              <mu-list-item-title>{{item.txt}}</mu-list-item-title>
            </div>
          </mu-list-item>
        </mu-list>
      </mu-drawer>
    </div>
    <router-view />
    <transition name='miniMusicPlayer'>
      <div class="miniMusicPlayer" v-show='miniPlayerShow' v-if='currentMusicList.tracks'>
        <div class="leftBox" @click='openSongDatail'>
          <div class="box" ref='miniBox' @touchstart='touchStartMini($event)' @touchmove='touchMoveMini($event)' @touchend='touchEndMini($event)'>
            <div class="imgBox" v-if='currentMusicList.tracks[currentMusicIndex].al'>
              <img :src="currentMusicList.tracks[currentMusicIndex].al.picUrl">
            </div>
            <div class="txtBox">
              <p>{{currentMusicList.tracks[currentMusicIndex].name}}</p>
              <span>{{getStrAri}}</span>
            </div>
          </div>
        </div>
        <div class="rightBox">
        <mu-button icon class='btnC' @click='isPlaying?toPause():toPlay()'>
          <mu-icon size='20' :value="isPlaying?'pause':'play_arrow'" :color='isPlaying?"red":"#AAA"'></mu-icon>
          <div class="box">
            <mu-circular-progress class="demo-circular-progress" :stroke-width="1" mode="determinate" color="#CCC" :value="100" :size="30"></mu-circular-progress>
            <mu-circular-progress class="demo-circular-progress" :stroke-width="2" mode="determinate" color='red' :value="perMusic" :size="30"></mu-circular-progress>
          </div>
        </mu-button>
        <mu-button icon @click='openMiniCurrentList'>
          <mu-icon size='32' value="playlist_play" color='333'></mu-icon>
        </mu-button>
        </div>
      </div>
    </transition>
    <div class="mPlayerPlaceholder" v-if='currentMusicList.tracks'></div>
    <transition name='currentSheelShow'>
      <CurrentSheel @toPlay='toPlay' v-if='currentSheelShow'></CurrentSheel>
    </transition>
    <transition name='currentSheelShow'>
      <DjSheel v-if='currentDjSheelShow'></DjSheel>
    </transition>
    <Load v-if='isAjax'></Load>
    <audio :src="getAudioSrc" autoplay ref='audio'></audio>
    <transition name='MiniCurrentList'>
      <MiniCurrentList v-show='MCListShow' @close = 'closeMiniCurrentList'></MiniCurrentList>
    </transition>
    <transition name='SongDatail'>
      <SongDatail v-if='songDatailShow' @changeMCListShow='changeMCListShow' @toPlay='toPlay' @toPause='toPause' :isPlaying='isPlaying' @close='closeSongDatail' :songCurrentTime='songCurrentTime' :songLong='songLong' @changeMusicTime='changeMusicTime'></SongDatail>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Split from '@/widget/Split'
import Load from '@/widget/Load'
import MiniCurrentList from '@/widget/MiniCurrentList'
import CurrentSheel from '@/components/CurrentSheel/CurrentSheel'
import SongDatail from '@/components/SongDatail/SongDatail'
import DjSheel from '@/components/DjSheel/DjSheel'
import * as types from '@/store/mutation-types'
const arrNavImg = [
  require('../../public/img/nav1.png'),
  require('../../public/img/nav2.png'),
  require('../../public/img/nav3.png')
]
const routePath = ['/home', '/home/find', '/home/dynamic']
const drawerList1 = [
  { icon: '', txt: '我的消息' },
  { icon: '', txt: '会员中心' },
  { icon: '', txt: '商城' },
  { icon: '', txt: '在线听歌免流量' }
]
const drawerList2 = [
  { icon: '', txt: '我的好友' },
  { icon: '', txt: '附近的人' }
]
const drawerList3 = [
  { icon: '', txt: '个性换肤' },
  { icon: '', txt: '听歌识曲' },
  { icon: '', txt: '定时停止播放' },
  { icon: '', txt: '扫一扫' },
  { icon: '', txt: '音乐闹钟' },
  { icon: '', txt: '驾驶模式' }
]
export default {
  created() {
    if (this.loginId) {
      this.$store.dispatch('getUserDetail')
    } else {
      this.$store.dispatch('getUserStatus')
      .then(() => {
        this.$store.dispatch('getUserDetail')
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      for (var i = 0; i < this.$refs.listItemBox.length; i++) {
        this.$refs.listItemBox[i].parentNode.style.height = '30px'
        this.$refs.listItemBox[i].parentNode.parentNode.style.padding = '5px 0'
      }
    })
    let audioDOM = this.$refs.audio
    audioDOM.ondurationchange = () => {
      this.songLong = audioDOM.duration
    }
    audioDOM.ontimeupdate = () => {
      let allTime = audioDOM.duration
      let currentTime = audioDOM.currentTime
      this.songCurrentTime = currentTime
      this.$store.commit(types.CHANGE_PREMUSIC, parseInt(currentTime / allTime * 100))
    }
    audioDOM.onplaying = () => {
      this.isPlaying = true
    }
    audioDOM.onended = () => {
      this.isPlaying = false
      this.$store.commit(types.CHANGE_PREMUSIC, 0)
      this.toChangeMusic(1)
    }
    audioDOM.onpause = () => {
      this.isPlaying = false
    }
    audioDOM.onerror = () => {
      this.toChangeMusic(1)
    }
  },
  data() {
    return {
      arrNavImg: arrNavImg,
      routePath: routePath,
      showDrawer: false,
      isLoginBtnActive: false,
      drawerList1: drawerList1,
      drawerList2: drawerList2,
      drawerList3: drawerList3,
      isPlaying: true,
      touchStartX: 0,
      touchMoveX: 0,
      MCListShow: false,
      songDatailShow: false,
      songLong: 0,
      songCurrentTime: 0
    }
  },
  methods: {
    toLogin() {
      this.$router.push('/login')
    },
    toLogout() {
      this.$store.dispatch('toLogout')
      this.$router.push('/login')
    },
    toPlay() {
      this.$refs.audio.play()
    },
    toPause() {
      this.$refs.audio.pause()
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
    touchStartMini(e) {
      this.touchStartX = e.changedTouches[0].pageX
      this.$refs.miniBox.style.transition = 'none'
      this.touchMoveX = this.touchStartX
    },
    touchMoveMini(e) {
      this.touchMoveX = e.changedTouches[0].pageX
      let translateX = (this.touchMoveX - this.touchStartX)
      this.$refs.miniBox.style.transform = `translateX(${translateX + 'px'})`
    },
    touchEndMini(e) {
      let touchDir
      if (this.touchMoveX - this.touchStartX > 50) {
        touchDir = 1
        this.toChangeMusic(1)
      } else if (this.touchMoveX - this.touchStartX < -50) {
        touchDir = -1
        this.toChangeMusic(-1)
      }
      if (touchDir === 1) {
        this.$refs.miniBox.style.transform = `translateX(-100%)`
      } else if (touchDir === -1) {
        this.$refs.miniBox.style.transform = `translateX(100%)`
      }
      setTimeout(() => {
        this.$refs.miniBox.style.transition = 'all .5s'
        this.$refs.miniBox.style.transform = `translateX(0)`
      }, 1)
      this.touchStartX = 0
      this.touchMoveX = 0
    },
    closeMiniCurrentList() {
      this.MCListShow = false
    },
    openMiniCurrentList() {
      this.MCListShow = true
    },
    changeMCListShow() {
      this.MCListShow = !this.MCListShow
    },
    closeSongDatail() {
      this.songDatailShow = false
    },
    openSongDatail() {
      this.songDatailShow = true
    },
    changeMusicTime(time) {
      this.$refs.audio.currentTime = time
    }
  },
  computed: {
    ...mapState(['isLogin', 'loginId', 'userDetail', 'currentSheelShow', 'miniPlayerShow', 'isAjax', 'currentMusicList', 'currentMusicIndex', 'perMusic', 'playType', 'currentDjSheelShow', 'sheelType']),
    actIndex() {
      let routeName = this.$route.name
      let activeRoute = ''
      switch (routeName) {
        case 'MyMusic':
            activeRoute = 0
          break
        case 'Find':
            activeRoute = 1
          break
        case 'Dynamic':
            activeRoute = 2
          break
      }
      return activeRoute
    },
    getAudioSrc() {
      if (!this.currentMusicList.tracks) {
        return null
      }
      let musicUrl
      if (this.sheelType === 'music') {
        musicUrl = this.currentMusicList.tracks[this.currentMusicIndex].id
      } else if (this.sheelType === 'dj') {
        musicUrl = this.currentMusicList.tracks[this.currentMusicIndex].mainTrackId
      }
      return `https://music.163.com/song/media/outer/url?id=${musicUrl}.mp3`
    },
    getStrAri() {
      let arArr = this.currentMusicList.tracks[this.currentMusicIndex].ar
      let ar = ''
      for (var i = 0; i < arArr.length; i++) {
         ar += arArr[i].name
         ar += '/'
      }
      ar = ar.slice(0, -1)
      return ar
    }
  },
  components: {
    Split,
    CurrentSheel,
    Load,
    MiniCurrentList,
    SongDatail,
    DjSheel
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.mu-appbar
  position: fixed
  top: 0
  left: 0
  height: 50px
  text-align: center
  line-height: 50px
.navTitle
  margin-top: 4px
  line-height: 50px
  height: 50px
  .navImg
    width: 53px
    opacity: 0.6
    &.active
      opacity: 1
.navPlaceholder
  height: 50px
  width: 100%
.drawerUser
  height: 150px
  background-image: url('../../public/img/drawer_user_bg.png')
  background-size: auto 100%
  overflow: hidden
  .isLogin
    color: #fff
    padding-left: 10px
    position: relative
    .avatar
      margin-top: 45px
      img
        border-radius: 50%
        height: 65px
        width: 65px
    .username
      font-size: 15px
    .lv
      padding: 2px 6px
      height: 15px
      line-height: 10px
      vertical-align: middle
      display: inline-block
      font-size: 12px
      border: 1px solid rgba(240,240,240,.3)
      margin-left: 5px
      border-radius: 30px
      font-style: italic
    .btnLogout
      color: rgb(240,240,240)
      position: absolute
      display: inline-block
      right: 5px
      border: 1px solid rgba(240,240,240,.3)
      font-size: 12px
      padding: 0 5px
      border-radius: 50px
      &.active
        background-color: rgba(240,240,240,.3)
  .noLogin
    color: #DDD
    font-size: 12px
    text-align: center
    margin-top: 15%
    .divBtn
      display: inline-block
      color: #fff
      margin-top: 15px
      padding: 4px 35px
      border: 1px solid rgba(240,240,240,.3)
      border-radius: 40px
      &.active
        background-color: rgba(240,240,240,.3)
  .listItem
    .box
      .mu-item-title
        font-size: 14px
.miniMusicPlayer
  position: fixed
  bottom: 0
  left: 0
  right: 0
  height: 50px
  z-index: 9000
  border-top: 1px solid #EEE
  background-color: rgb(250,250,250)
  display: flex
  .leftBox
    flex: 1
    position: relative
    overflow: hidden
    .box
      width: 100%
      transition: all .5s
      position: absolute
      display: flex
      .imgBox
        flex: 0 0 45px
        display: inline-block
        width: 40px
        height: 40px
        margin-top: 5px
        border-radius: 2px
        overflow: hidden
        margin-left: 5px
        img
          width: 42px
      .txtBox
        flex: 1
        height: 100%
        display: inline-block
        vertical-align: top
        padding-top: 5px
        padding-left: 5px
        p, span
          vertical-align: middle
          font-size: 12px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        p
          color: #333
          font-size: 13px
        span
          color: #999
  .rightBox
    flex: 0 0 110px
    .btnC
      vertical-align: top
      .box
        position: absolute
        top: 9px
        left: 9px
        div
          position: absolute
          top: 0
          left: 0
          &:last-child
            transform: rotateZ(-90deg)
.mPlayerPlaceholder
  height: 50px
  width: 100%
.currentSheelShow-enter-active, .currentSheelShow-leave-active
  transition: all .5s
.currentSheelShow-enter, .currentSheelShow-leave-to
  opacity: 0
  transform: translateY(100%)
.miniMusicPlayer-enter-active,.miniMusicPlayer-leave-active
  transition: all .5s
.miniMusicPlayer-enter, .miniMusicPlayer-leave-to
  opacity: 0
.MiniCurrentList-enter-active, .MiniCurrentList-leave-active
  transition: all .5s
.MiniCurrentList-enter, .MiniCurrentList-leave-to
  opacity: 0
  transform: translateY(100%)
.SongDatail-enter-active, .SongDatail-leave-active
  transition: all .5s
.SongDatail-enter, .SongDatail-leave-to
  opacity: 0
  transform: translateY(100%)
</style>
