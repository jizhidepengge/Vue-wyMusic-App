<template>
  <div class="dynamic" ref='scrollDyn'>
    <div class="dynScroll">
      <div class="topLoad">
        <LocalLoad></LocalLoad>
      </div>
      <div class="bottomLoad" v-show='overAjax'>
        <LocalLoad></LocalLoad>
      </div>
      <div class="loadBox" v-if='showLoad'>
        <LocalLoad></LocalLoad>
      </div>
      <div class="dynBox" v-if='dynData.length' v-for='item in dynData' :key='item.id' @click='test(item.json)'>
        <div class="avatar">
          <img v-lazy="item.user.avatarUrl">
        </div>
        <div class="right">
          <div class="nickName">{{item.user.nickname}}<span>发布{{getType(JSON.parse(item.json))}}:</span></div>
          <div class="time">{{getTime(item.showTime)}}</div>
          <div class="btn">＋关注</div>
          <div class="boxContent">
            <div class="msg">{{JSON.parse(item.json).msg}}</div>
            <div class="videoImgBox" v-if='JSON.parse(item.json).video' ref='vdImg'>
              <img :src="JSON.parse(item.json).video.coverUrl" >
              <mu-icon size='36' class="control" value='play_circle_outline'></mu-icon>
            </div>
            <div class="albumBox" v-if='JSON.parse(item.json).album'>
              <img :src="JSON.parse(item.json).album.blurPicUrl">
              <mu-button flat class='albumBtn'>
                <div class="btnBox">
                  <img :src="JSON.parse(item.json).album.img80x80">
                </div>
              </mu-button>
            </div>
            <div class="songBox" v-if='JSON.parse(item.json).song'>
              <mu-button flat class='songBtn'>
                <div class="btnBox">
                  <img :src="JSON.parse(item.json).song.album.img80x80">
                  <div class="right">
                    <div class="songName">{{JSON.parse(item.json).song.name}}</div>
                    <div class="artName">{{getSongArtStr(JSON.parse(item.json).song.album.artists)}}</div>
                  </div>
                </div>
              </mu-button>
            </div>
          </div>
          <p class="type" v-if='item.rcmdInfo'>——{{item.rcmdInfo.reason}}</p>
          <div class="operationBtn">
            <div class="operbtnBox">
              <mu-icon size='20' value='thumb_up_alt'></mu-icon>
              <span>{{item.info.likedCount}}</span>
            </div>
            <div class="operbtnBox">
              <mu-icon size='20' value='chat_bubble_outline'></mu-icon>
              <span>{{item.info.commentCount}}</span>
            </div>
            <div class="operbtnBox">
              <mu-icon size='20' value='share'></mu-icon>
              <span>{{item.info.shareCount}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocalLoad from '@/widget/LocalLoad'
import BScroll from 'better-scroll'
import * as urls from '@/api/urls.js'
export default {
  mounted() {
    let time = new Date().getTime()
    this.axios.get(urls.event + '?timestamp=' + time)
      .then((res) => {
        this.allData = res.data.event
        this.dynData = this.getAllData()
        this.$nextTick(() => {
          this.overAjax = true
          this.showLoad = false
          let vdImg = this.$refs.vdImg
          vdImg.map((item) => {
            item.style.height = item.offsetWidth / 260 * 150 + 'px'
          })
          this.$nextTick(() => {
            this.dynScroll = new BScroll(this.$refs.scrollDyn, {
              click: true,
              pullUpLoad: {
                threshold: -80
              },
              pullDownRefresh: {
                threshold: 50,
                stop: 20
              }
            })
            this.dynScroll.on('pullingUp', () => {
              if (this.showNum < 30) {
                setTimeout(() => {
                  this.showNum += 10
                  this.dynData = this.getAllData()
                  this.$nextTick(() => {
                    setTimeout(() => {
                      this.dynScroll.refresh()
                    }, 200)
                    this.dynScroll.finishPullUp()
                  })
                }, 1000)
              } else {
                this.refresh()
              }
            })
            this.dynScroll.on('pullingDown', () => {
              this.refresh()
            })
          })
        })
      })
  },
  updated() {
    if (this.dynScroll) {
      this.dynScroll.refresh()
    }
  },
  data() {
    return {
      showNum: 10,
      allData: [],
      dynData: [],
      showLoad: true,
      overAjax: false
    }
  },
  methods: {
    getAllData() {
      let res = this.allData.filter((item, index) => {
        return index <= this.showNum
      })
      return res
    },
    getSongArtStr(arr) {
      let result = ''
      for (var i = 0; i < arr.length; i++) {
        result += arr[i].name
        result += '/'
      }
      let res = result.substr(0, result.length - 1)
      return res
    },
    getType(json) {
      if (json.video) {
        return '视频'
      } else if (json.album) {
        return '专辑'
      } else if (json.song) {
        return '音乐'
      }
    },
    refresh() {
      let time = new Date().getTime()
      this.showNum = 10
      this.axios.get(urls.event + '?timestamp=' + time)
        .then((res) => {
            this.allData = res.data.event
            this.dynData = this.getAllData()
            this.$nextTick(() => {
              setTimeout(() => {
              let vdImg = this.$refs.vdImg
                vdImg.map((item) => {
                  item.style.height = item.offsetWidth / 260 * 150 + 'px'
                })
                this.$nextTick(() => {
                  setTimeout(() => {
                      this.dynScroll.refresh()
                  }, 200)
                  this.dynScroll.finishPullUp()
                  this.dynScroll.finishPullDown()
                  this.dynScroll.scrollTo(0, 0, 100)
                })
              }, 500)
            })
        })
    },
    getTime(time) {
      let t = new Date(time)
      let y = t.getFullYear()
      let m = t.getMonth() + 1
      let d = t.getDate()
      return y + '-' + m + '-' + d
    }
  },
  components: {
    LocalLoad
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.dynamic
  position: fixed
  top: 50px
  bottom: 50px
  left: 0
  right: 0
  .topLoad
    position: absolute
    width: 100%
    height: 80px
    top: -80px
  .bottomLoad
    width: 100%
    position: absolute
    height: 80px
    bottom:  -80px
  .loadBox
    width: 100%
    position: absolute
    height: 80px
    top: 0
  .dynBox
    display: flex
    padding: 20px 10px
    border-bottom: 1px solid #EEE
    .avatar
      flex: 0 0 40px
      img
        border-radius: 50%
        width: 30px
    .right
      position: relative
      flex: 1
      .nickName
        color: #007FFF
        max-width: 80%
        font-size: 13px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        span
          color: #666
          display: inline-block
          margin-left: 5px
      .time
        font-size: 12px
        color: #999
      .btn
        color: red
        position: absolute
        right: 5px
        top: 0
        font-size: 13px
      .boxContent
        .msg
          font-size: 13px
          padding: 5px 0
        .videoImgBox
          position: relative
          overflow: hidden
          font-size: 0
          width: 100%
          margin-bottom: 5px
          img
            width: 100%
          .control
            color: #fff
            position: absolute
            top: 50%
            left: 50%
            margin-left: -18px
            margin-top: -18px
        .albumBox
          img
            width: 50%
          .albumBtn
            width: 100%
            background-color: #EEE
            text-align: left
            .btnBox
              width: 100%
              height: 100%
              img
                width: auto
                height: 80%
        .songBox
          .songBtn
            width: 100%
            background-color: #EEE
            text-align: left
            /deep/ .mu-button-wrapper
              padding: 0 10px
              .btnBox
                width: 100%
                height: 80%
                img
                  width: auto
                  height: 100%
                  margin-right: 5px
                .right
                  height: 100%
                  vertical-align: top
                  display: inline-block
                  div
                    font-size: 12px
                    line-height: 15px
                    height: 50%
                    &.artName
                      color: #888
      .type
        font-size: 12px
        color: #888
      .operationBtn
        margin-top: 15px
        div
          display: inline-block
          width: 25%
          color: #888
          font-size: 12px
          i
            vertical-align: middle
          span
            color: #999
            vertical-align: middle
</style>
