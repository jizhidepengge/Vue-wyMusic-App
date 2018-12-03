<template>
  <div class="currentSheel"  ref='currentSheel'>
    <mu-appbar style="width: 100%;" color="rgba(2,50,57,.7)" z-depth='0'>
      <mu-button icon slot="left" @click='comeBack'>
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>
      <div class="title">
        {{currentSheel.name}}
      </div>
      <mu-button flat slot="right">
        <mu-icon size='24' value='search'></mu-icon>
      </mu-button>
    </mu-appbar>
    <div class="headerPlaceholder"></div>
    <div class="titleContainer">
      <div class="left" ref='imgBox'>
        <img :src="currentSheel.coverImgUrl">
      </div>
      <div class="right">
        <p class="sheelTitle">{{currentSheel.name}}</p>
        <div class="creator">
          <img :src="currentSheel.creator.avatarUrl">
          <span>{{currentSheel.creator.nickname}}</span>
          <mu-icon size='15' value='chevron_right' color='#fff'></mu-icon>
        </div>
      </div>
      <div class="bottom">
        <div v-for='(item,index) in bottomBtnArr' :key='index' @touchstart='touchstart(index)' @touchend='touchend(index)'>
          <mu-icon :class='item.active?"active":""' size='20' :value='item.icon'></mu-icon>
          <p>{{item.txt}}</p>
        </div>
      </div>
    </div>
    <div class="playAllBtn" @click='listenAll'>
      <mu-button flat large>
        <div class="box">
          <mu-icon size='20' value='play_circle_outline'></mu-icon>
          <b>播放全部</b>
          <span>(共{{currentSheel.trackCount}}首)</span>
        </div>
      </mu-button>
    </div>
    <mu-divider></mu-divider>
    <mu-list>
      <div class="itemBox" :class='currentMusicList.id===currentSheel.id&&currentMusicIndex===index?"active":""' v-for='(item, index) in currentSheel.tracks' :key='item.id'>
        <mu-list-item button ripple class='item'  @click='playMusic(index)'>
          <mu-list-item-content>
            <mu-list-item-title>
              <div class="titile">
                {{item.name}}
              </div>
            </mu-list-item-title>
            <mu-list-item-sub-title>
              <div class="subTitle">
                {{getStrAri(item)}}
              </div>
            </mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action style='height: 50px'>
            <div class="btn">
              <mu-button flat @click.stop='handleMusic(item, index)'>
                <mu-icon value="more_vert" ></mu-icon>
              </mu-button>
            </div>
          </mu-list-item-action>
        </mu-list-item>
        <mu-divider shallow-inset></mu-divider>
      </div>
    </mu-list>
    <transition name='bottomSheet'>
      <BottomSheet v-show='open' @close='closeBottomSheet' :bottomIndex='bottomIndex' :bottomSheelData='bottomSheelData'></BottomSheet>
    </transition>
    <div class="mPlayerPlaceholder"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import * as types from '@/store/mutation-types'
import BottomSheet from '@/widget/BottomSheet'
const bottomBtnArr = [
  {icon: 'create_new_folder', txt: '收藏', active: false},
  {icon: 'chat_bubble_outline', txt: '评论', active: false},
  {icon: 'share', txt: '分享', active: false},
  {icon: 'save_alt', txt: '下载', active: false}
]
export default {
  mounted() {
    let dom = document.querySelectorAll('.item')
    let arr = [...dom]
    arr.map((item) => {
      item.children[0].children[0].style.height = '55px'
    })
    this.$refs.imgBox.style.height = this.$refs.imgBox.offsetWidth + 'px'
  },
  data() {
    return {
      bottomBtnArr: bottomBtnArr,
      open: false,
      bottomSheelData: {},
      bottomIndex: 0
    }
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.$refs.currentSheel.style.overflowY = 'hidden'
      } else {
        this.$refs.currentSheel.style.overflowY = 'auto'
      }
    }
  },
  methods: {
    comeBack() {
      this.$store.commit(types.TOGGLE_CURRENT_SHEEL_SHOW, false)
    },
    touchstart(i) {
      bottomBtnArr[i].active = true
    },
    touchend(i) {
      bottomBtnArr[i].active = false
    },
    getStrAri(json, isNotName) {
      let isNameFlag = isNotName || false
      let al = json.al.name || ''
      let arArr = json.ar
      let ar = ''
      for (var i = 0; i < arArr.length; i++) {
         ar += arArr[i].name
         ar += '/'
      }
      ar = ar.slice(0, -1)
      if (isNameFlag) {
        return ar
      }
      let res = ar + '-' + al
      return res
    },
    playMusic(index) {
      this.$store.commit(types.CHANGE_SHEELTYPE, 'music')
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_LIST, this.currentSheel)
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_INDEX, index)
    },
    handleMusic(item, i) {
      this.bottomSheelData = {...item}
      this.bottomIndex = i
      this.openBotttomSheet()
    },
    closeBottomSheet () {
      this.open = false
      this.$store.commit(types.TOGGLE_MINIPLAYER_SHOW, true)
    },
    openBotttomSheet () {
      this.open = true
      this.$store.commit(types.TOGGLE_MINIPLAYER_SHOW, false)
    },
    listenAll() {
      this.playMusic(0)
    }
  },
  computed: {
    ...mapState(['currentSheel', 'currentMusicList', 'currentMusicIndex', 'sheelType'])
  },
  components: {
    BottomSheet
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.currentSheel
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  background-color: #fff
  z-index: 100
  overflow-y: auto
  overflow-x: hidden
  .mu-appbar
    position: fixed
    top: 0
    left: 0
    .title
      width: 100%
      font-size: 14px
      overflow: hidden
      text-overflow:ellipsis
      white-space: nowrap
  .titleContainer
    padding: 0 15px 60px 15px
    background-color: rgba(2,50,57,.7)
    display: flex
    position: relative
    .left
      overflow: hidden
      flex: 2
      img
        width: 100%
    .right
      padding-left: 10px
      font-size: 14px
      color: #fff
      flex: 3
      p
        padding: 10px 0
      .creator
        img
          width: 30px
          border-radius: 50%
          vertical-align: middle
        span
          display: inline-block
          margin-left: 10px
          font-size: 12px
          vertical-align: middle
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
          max-width: 60%
        i
          vertical-align: middle
    .bottom
      position: absolute
      bottom: 0
      left: 0
      right: 0
      height: 50px
      div
        text-align: center
        display: inline-block
        width: 24%
        color: #fff
        i.active
          color: #CCC
        p
          font-size: 12px
  .playAllBtn
    .mu-button
      width: 100%
      .box
        width: 100%
        text-align: left
        vertical-align: middle
        i
          vertical-align: middle
        b
          vertical-align: middle
          font-weight: 500
        span
          vertical-align: middle
          font-size: 13px
          color: #888
  .mu-list
    padding: 0
    .itemBox
      position: relative
      &.active::after
        content: ""
        width: 2px
        height: 90%
        position: absolute
        left: 0
        top: 5%
        background-color: red
      .item
        position: relative
        .titile
          font-size: 14px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .subTitle
          font-size: 12px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .btn
          position: absolute
          right: 0
          .mu-button
            min-width: 50px
            height: 55px
            color: #666
  .headerPlaceholder
    height: 56px
    width: 100%
  .mPlayerPlaceholder
    height: 50px
    width: 100%
  .bottomSheet-enter-active, .bottomSheet-leave-active
    transition: .5s all
  .bottomSheet-enter, .bottomSheet-leave-to
    transform: translateY(100%)
    opacity: 0
</style>
