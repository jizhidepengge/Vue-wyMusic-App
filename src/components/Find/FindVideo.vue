<template>
  <div class="findVideo" ref='videoScroll'>
    <div class="videoScroll">
      <div class="videoBox" v-for='(item, index) in showVideoArr' :key='item.id'>
        <video :src="item.videoUrl" ref='aVideo' controls></video>
        <div class="videoInfo">
          <div class="videoTitle">{{item.name}}</div>
          <div class="btnBox">
            <div class="btnLike" @click='toLike(index)'>
              <mu-icon :class='item.likeActive?"active":""' value='thumb_up'></mu-icon>
              <p>{{item.likeCount}}</p>
            </div>
            <div class="btnComment">
              <mu-icon value='chat_bubble_outline'></mu-icon>
              <p>{{item.commentCount}}</p>
            </div>
          </div>
        </div>
        <div class="bgBox" v-show='item.bgShow' @click='toPlay(index)'>
          <img :src="item.cover">
          <mu-icon size='40' value='play_circle_outline'></mu-icon>
        </div>
      </div>
      <div class="loading">
        <mu-circular-progress v-show = 'showVideoNum < 100' class="demo-circular-progress" color='#f10215' :size="30"></mu-circular-progress>
        <p v-show = 'showVideoNum < 100'>loading...</p>
        <p v-show = 'showVideoNum >= 100'>没有更多了</p>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { mapState } from 'vuex'
export default {
  created() {
    if (!this.videoArr.length) {
      this.$store.dispatch('getVideoArr')
        .then(() => {
          this.getVideoList()
        })
    } else {
      this.getVideoList()
    }
  },
  data() {
    return {
      showVideoNum: 0,
      showVideoArr: [],
      ajaxNum: 0
    }
  },
  methods: {
    getVideoList() {
      let startIndex = this.showVideoNum
      this.showVideoNum += 10
      let index = this.showVideoNum
      let res = this.videoArr.slice(0, index)
      for (let i = startIndex; i < res.length; i++) {
        let mvid = res[i].id
        this.axios.get('/api/mv/detail?mvid=' + mvid)
          .then((resData) => {
            let key = '480'
            let videoUrl = resData.data.data.brs[key]
            let commentCount = resData.data.data.commentCount
            let likeCount = resData.data.data.likeCount
            let resItem = {...res[i], 'videoUrl': videoUrl, commentCount, likeCount, bgShow: true, likeActive: false}
            this.showVideoArr.push(resItem)
            this.ajaxNum++
          })
      }
      this.$nextTick(() => {
        if (!this.videoScroll) {
          this.videoScroll = new BScroll(this.$refs.videoScroll, {
            click: true,
            pullUpLoad: {
              threshold: -80
            }
          })
          this.videoScroll.on('pullingUp', () => {
            this.getVideoList()
            this.videoScroll.finishPullUp()
          })
        } else {
          this.videoScroll.refresh()
        }
      })
    },
    toPlay(i) {
      for (let j = 0; j < this.showVideoArr.length; j++) {
        this.showVideoArr[j].bgShow = true
        this.$refs.aVideo[i].pause()
      }
      this.showVideoArr[i].bgShow = false
      this.$refs.aVideo[i].play()
    },
    toLike(i) {
      if (this.showVideoArr[i].likeActive) {
        this.showVideoArr[i].likeCount--
      } else {
        this.showVideoArr[i].likeCount++
      }
      this.showVideoArr[i].likeActive = !this.showVideoArr[i].likeActive
    },
    changeVideoHeight() {
      let w = window.innerWidth
      for (var i = 0; i < this.$refs.aVideo.length; i++) {
        this.$refs.aVideo[i].style.height = w / 16 * 9 + 'px'
      }
    }
  },
  watch: {
    ajaxNum(newVal) {
      if (newVal === this.showVideoNum) {
        for (var i = 0; i < this.$refs.aVideo.length; i++) {
          let oVideo = this.$refs.aVideo[i]
          oVideo.oncanplay = () => {
            this.videoScroll.refresh()
            this.changeVideoHeight()
          }
        }
      }
    }
  },
  computed: {
    ...mapState(['videoArr'])
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.findVideo
  position: fixed
  top: 90px
  bottom: 50px
  left: 0
  right: 0
  .videoScroll
    position: relative
    .loading
      position: absolute
      height: 50px
      width: 100%
      bottom: -50px
      padding-top: 10px
      text-align: center
    .videoBox
      position: relative
      width: 100%
      video
        width: 100%
      .videoInfo
        display: flex
        padding: 10px 0
        margin-bottom: 10px
        .videoTitle
          width: 60%
          flex: 2
          font-size: 13px
          line-height: 20px
          max-height: 40px
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 2
          overflow: hidden
          padding: 0 5px
          height: 50px
        .btnBox
          flex: 1
          color: #999
          padding-right: 10px
          text-align: right
          div
            display: inline-block
            margin-left: 15px
            font-size: 12px
            i.active
              color: rgb(241, 2, 21)
    .bgBox
      position: absolute
      left: 0
      top: 0
      text-align: center
      img
        width: 100%
      i
        position: absolute
        left: 50%
        top: 50%
        margin-left: -25px
        margin-top: -25px
        color: #FFF
</style>
