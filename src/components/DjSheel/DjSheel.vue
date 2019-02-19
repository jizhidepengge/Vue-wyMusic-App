<template>
  <div class="DjSheel">
    <div class="header">
      <mu-appbar style="width: 100%;" :color='appBarColor' z-depth='0'  ref='header'>
        <mu-button color='#fff' icon slot="left" @click='closeSelf'>
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
        <div class="title">
          {{currentDjSheel.tracks[0].radio.name}}
        </div>
      </mu-appbar>
    </div>
    <div class="ScrollNav" :class='navActive?"active":""'>
        <div class="navBox" ref='navBox'>
          <mu-button flat @click='changeActive(true)'><span class="txt" :class='isActive?"active":""'>详情</span></mu-button>
          <mu-button flat @click='changeActive(false)'><span class="txt" :class='isActive?"":"active"'>节目</span></mu-button>
          <div class="borderBottom" :class='isActive?"":"active"'></div>
        </div>
    </div>
    <div class="djScroll" ref='djScroll'>
      <div class="djScrollBox">
        <div class="imgBox">
          <div class="box" ref='box'>
            <img ref='headerImg' :src="currentDjSheel.tracks[0].al.picUrl">
          </div>
          <div class="aut">
            <p class="nickname">{{currentDjSheel.tracks[0].radio.name}}</p>
            <p>{{getSubCount}}人已订阅</p>
          </div>
          <div class="nav">
            <div class="navBox" ref='navBox' :class='navActive?"active":""'>
              <mu-button flat @click='changeActive(true)'><span class="txt" :class='isActive?"active":""'>详情</span></mu-button>
              <mu-button flat @click='changeActive(false)'><span class="txt" :class='isActive?"":"active"'>节目</span></mu-button>
              <div class="borderBottom" :class='isActive?"":"active"'></div>
            </div>
          </div>
        </div>
        <div class="contentBox" :class='isActive?"active":""'>
          <div class="info">
            <div class="dj">
              <div class="djTitle">主播</div>
              <mu-button flat large class='djBtn'>
                <div class="btnBox">
                  <div class="avatar">
                    <img :src="currentDjSheel.tracks[0].dj.avatarUrl">
                  </div>
                  <div class="djTxt">
                    <p>{{currentDjSheel.tracks[0].dj.nickname}}</p>
                    <p class='description'>{{currentDjSheel.tracks[0].dj.description}}</p>
                  </div>
                </div>
              </mu-button>
            </div>
            <div class="radio">
              <div class="radioTitle">电台内容简介</div>
              <div class="category">分类：<span>{{currentDjSheel.tracks[0].radio.category}}</span></div>
              <div class="desc">{{currentDjSheel.tracks[0].radio.desc}}</div>
            </div>
          </div>
          <div class="boxSheel">
            <div class="sheelHeader">
              共{{currentDjSheel.tracks[0].radio.programCount}}期
            </div>
            <mu-button :class='sheelType==="dj"&&currentMusicIndex===index?"active":""' flat large @click='playDj(index)' class='programBtn' v-for='(item, index) in currentDjSheel.tracks' :key='index'>
              <div class="btnBox">
                <p>{{item.name}}</p>
                <p class='count'>
                  <span class="time">{{getTime(item.createTime)}}</span>
                  <span class='listenCount'>
                    <mu-icon size='15' color='#ccc' value='play_arrow'></mu-icon>
                    <span class="num">{{getListenerCount(item.listenerCount)}}</span>
                  </span>
                </p>
              </div>
            </mu-button>
            <div class="bottomBox"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import BScroll from 'better-scroll'
import * as types from '@/store/mutation-types'
export default {
  mounted() {
    this.$nextTick(() => {
      this.djScroll = new BScroll(this.$refs.djScroll, {
        click: true,
        probeType: 3,
        pullUpLoad: {
          threshold: 50
        }
      })
      this.djScroll.on('scroll', ({y}) => {
        let h
        if (this.$refs.box.offsetHeight) {
          h = this.$refs.box.offsetHeight
        }
        if (y > 0) {
          this.$refs.box.style.transform = ` scale(${y / 100 + 1})`
        }
        if (h - 92 < -y && !this.navActive) {
          this.navActive = true
          this.appBarColor = 'rgba(2,17,27,1)'
        } else if (h - 92 > -y && this.navActive) {
          this.navActive = false
          this.appBarColor = 'rgba(2,17,27,0)'
        }
      })
      this.djScroll.on('pullingUp', () => {
        if (this.currentDjSheel.tracks[0].radio.programCount > this.currentDjSheel.tracks.length && !this.isActive) {
          this.$store.dispatch('getCurrentDjSheel', {id: this.currentDjSheel.tracks[0].radio.id, offset: this.offset * 40, add: true})
            .then(() => {
                this.offset = this.offset + 1
                this.djScroll.finishPullUp()
            })
        }
      })
    })
  },
  data() {
    return {
      appBarColor: 'rgba(2,17,27,0)',
      navActive: false,
      isActive: false,
      offset: 1
    }
  },
  methods: {
    closeSelf() {
      this.$store.commit('CHANGE_CURRENT_DJ_SHEEL_SHOW', false)
    },
    changeActive(flag) {
      this.isActive = flag
    },
    getListenerCount(num) {
      if (num > 10000) {
        return parseInt(num / 1000) + '万'
      } else {
        return num
      }
    },
    getTime(time) {
      let t = new Date(time)
      let y = t.getFullYear()
      let m = t.getMonth() + 1
      let d = t.getDate()
      return y + '-' + m + '-' + d
    },
    playDj(index) {
      this.$store.commit(types.CHANGE_SHEELTYPE, 'dj')
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_LIST, this.currentDjSheel)
      this.$store.commit(types.CHANGE_CURRENT_MUSIC_INDEX, index)
      setTimeout(() => { this.$emit('toPlay') }, 100)
    }
  },
  watch: {
    isActive() {
      if (this.djScroll) {
        this.$nextTick(() => {
          this.djScroll.refresh()
        })
      }
    }
  },
  computed: {
    ...mapState(['currentDjSheel', 'currentMusicIndex', 'sheelType']),
    getSubCount() {
      let subCount = this.currentDjSheel.tracks[0].radio.subCount
      if (subCount > 100000) {
        return parseInt(subCount / 10000) + '万'
      } else {
        return subCount
      }
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.DjSheel
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  z-index: 3000
  background-color: #fff
  .header
    position: fixed
    top: 0
    left: 0
    right: 0
    z-index: 2
    .mu-appbar
      /deep/ .mu-appbar-title
        padding: 0
        .title
          font-size: 14px
          color: #fff
  .ScrollNav
    position: fixed
    top: 56px
    width: 100%
    background-color: #fff
    border-top-left-radius: 10px
    border-top-right-radius: 10px
    border-bottom: 1px solid #EEE
    height: 37px
    z-index: 1000
    display: none
    &.active
      display: block
    .navBox
      width: 100%
      height: 37px
      .mu-button
        width: 50%
        coolor: red
        float: left
        .txt
          color: #777
          &.active
            color: red
      .borderBottom
        position: absolute
        width: 20%
        height: 3px
        background-color: red
        bottom: 2px
        left: 15%
        transition: .5s all
        &.active
          transform: translateX(250%)
  .imgBox
    background-color: #999
    font-size: 0
    position: relative
    .title
    .box
      background-color: #999
    img
      width: 100%
      opacity: .7
      font-size: 0
    .aut
      position: absolute
      left: 0
      bottom: 30px
      color: #fff
      padding-left: 10px
      padding-bottom: 10px
      p
        font-size: 12px
      .nickname
        font-weight: 600
        font-size: 16px
    .nav
      position: absolute
      bottom: 0
      width: 100%
      background-color: #fff
      border-top-left-radius: 10px
      border-top-right-radius: 10px
      border-bottom: 1px solid #EEE
      height: 37px
      .navBox
        width: 100%
        height: 37px
        .mu-button
          width: 50%
          coolor: red
          .txt
            color: #777
            &.active
              color: red
        .borderBottom
          position: absolute
          width: 20%
          height: 3px
          background-color: red
          bottom: 2px
          left: 15%
          transition: .5s all
          &.active
            transform: translateX(250%)
  .djScroll
    position: absolute
    left: 0
    right: 0
    top: 0
    bottom: 0
    .contentBox
      background-color: #fff
      width: 200%
      transition: 0.5s all
      transform: translateX(-50%)
      &.active
        transform: translateX(0)
        height: 320px
      &:after
        content: ""
        display: block
        clear: both
      .info
        width: 50%
        height: 50px
        float: left
        .dj
          .djTitle
            padding: 10px
            font-weight: 600
          .djBtn
            width: 100%
            height: 60px
            text-align: left
            border-top: 1px solid #EEE
            border-bottom: 1px solid #EEE
            /deep/ .mu-button-wrapper
              padding: 0px 10px
              text-align: left
              .btnBox
                height: 44px
                width: 100%
                & div
                  display: inline-block
                .avatar
                  border-radius: 50%
                  overflow: hidden
                  width: 40px
                  height: 40px
                  vertical-align: middle
                  img
                    width: 40px
                .djTxt
                  padding-left: 10px
                  vertical-align: middle
                  p
                    line-height: 20px
                    font-size: 16px
                    &.description
                      font-size: 12px
                      color: #999
        .radio
          padding: 20px 10px
          .radioTitle
            font-size: 15px
            font-weight: 600
          .category
            margin-top: 12px
            font-size: 13px
            color: #777
            span
              font-size: 12px
              padding: 0 5px
              color: red
              border: 1px solid red
          .desc
            margin-top: 3px
            font-size: 13px
      .boxSheel
        width: 50%
        float: right
        .sheelHeader
          height: 25px
          background-color: #EEE
          font-size: 13px
          line-height: 25px
          padding-left: 8px
          color: #777
        .programBtn
          width: 100%
          height: 60px
          border-bottom: 1px solid #EEE
          position: relative
          &.active::after
            position: absolute
            content: ""
            left: 0
            top: 10px
            height: 40px
            width: 2px
            background-color: red
          /deep/ .mu-button-wrapper
            padding: 0 10px
            .btnBox
              height: 40px
              width: 100%
              text-align: left
              p
                line-height: 20px
                vertical-align: middle
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                font-size: 14px
                &.count
                  color: #CCC
                  font-size: 12px
                  vertical-align: middle
                  i
                    margin-left: 10px
                    vertical-align: middle
                  .num
                    vertical-align: middle
        .bottomBox
          width: 100%
          height: 50px
</style>
