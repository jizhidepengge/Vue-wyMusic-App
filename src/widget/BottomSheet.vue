<template>
  <div class="bottomSheet">
    <div class="bottomSheetBox">
      <div class="bottomSheetTitle">
        歌曲：{{bottomSheelData.name}}
      </div>
      <mu-button flat large class="bottomSheetItem" @click='closeSelf(0)'>
        <div class="box">
          <mu-icon value='play_circle_outline' size='28' color='red'></mu-icon>
          <span>播放</span>
        </div>
      </mu-button>
      <mu-button flat large class="bottomSheetItem" @click='closeSelf(1)'>
        <div class="box">
          <mu-icon value='create_new_folder' size='28' color='red'></mu-icon>
          <span>收藏到歌单</span>
        </div>
      </mu-button>
      <mu-button flat large class="bottomSheetItem" @click='closeSelf(2)'>
        <div class="box">
          <mu-icon value='chat_bubble_outline' size='28' color='red'></mu-icon>
          <span>评论</span>
        </div>
      </mu-button>
      <mu-button flat large class="bottomSheetItem" @click='closeSelf(3)'>
        <div class="box">
          <mu-icon value='person_outline' size='28' color='red'></mu-icon>
          <span>歌手：{{bottomSheelData.id?getStrAri(bottomSheelData,true):""}}</span>
        </div>
      </mu-button>
      <mu-button flat large class="bottomSheetItem" @click='closeSelf(4)'>
        <div class="box">
          <mu-icon value='album' color='red' size='28'></mu-icon>
          <span>专辑：{{bottomSheelData.al?bottomSheelData.al.name:""}}</span>
        </div>
      </mu-button>
      <mu-button flat large class="bottomSheetItem" @click='closeSelf(5)'>
        <div class="box" @click='del'>
          <mu-icon value='delete_forever' size='28' color='red'></mu-icon>
          <span>删除</span>
        </div>
      </mu-button>
    </div>
    <div class="bottomSheetBg" @click='closeSelf'></div>
  </div>
</template>

<script>
import * as types from '@/store/mutation-types'
export default {
  props: ['bottomSheelData', 'bottomIndex'],
  methods: {
    getStrAri(json, isNotName) {
      let isNameFlag = isNotName || false
      let al = json.al.name
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
    closeSelf(num) {
      if (num === 0) {
        this.changeSong()
      } else if (num === 5) {
        this.del()
      }
      this.$emit('close')
    },
    changeSong() {
      this.$store.commit(types.CHANGE_SHEELTYPE, 'music')
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_INDEX, this.bottomIndex)
    },
    del() {
      this.$store.commit(types.DEL_CURRENT_MUSIC, this.bottomIndex)
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.bottomSheet
  position: fixed
  bottom: 0
  z-index: 9001
  width: 100%
  height: 320px
  padding-bottom: 10px
  .bottomSheetBox
    position: fixed
    left: 0
    right: 0
    bottom: 0
    z-index: 2
    background-color: #fff
    border-top-left-radius: 10px
    border-top-right-radius: 10px
    padding-bottom: 10px
    .bottomSheetTitle
      padding: 15px 15px
      border-bottom: 1px solid #DDD
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .bottomSheetItem
      border-bottom: 1px solid #EEE
      width: 100%
      /deep/ .mu-button-wrapper
        padding: 15px
      .box
        padding: 10px 0
        width: 100%
        text-align: left
        i,span
          vertical-align: middle
        span
          padding-left: 10px
          font-size: 13px
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
  .bottomSheetBg
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(7,17,27,.6)
    z-index: 1
</style>
