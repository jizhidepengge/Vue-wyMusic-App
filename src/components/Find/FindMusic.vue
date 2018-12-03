<template>
  <div class="findMusic">
    <Banner :bannerData = 'bannerData'></Banner>
    <div class="toListBtnBox">
      <div class="listBtn" v-for='(item, index) in arrListBtn' @touchstart='touchstart(index)' @touchend='touchend(index)' :key='index'>
        <div class="imgBox" :class='item.isActive?"active":""'>
          <img :src="item.isActive?item.iconActSrc:item.iconSrc">
        </div>
        <p>{{item.txt}}</p>
      </div>
    </div>
    <LocalLoad v-if='listFindData.length===0'></LocalLoad>
    <div class="listSheels" v-if='listFindData.length' v-for='(items,i) in listFindData' :key='i' >
      <div class="sheelTitle"><span>{{items.name}}</span><mu-icon value='chevron_right' color='#999'></mu-icon></div>
      <div class="sheelBox" @click='items.click(item)' v-for='(item, index) in items.dataArr' :style='(index+1)%3===0 && index!==0?"margin-right:0":""' :key='index'>
        <div class="imgBox" ref='imgBox'>
          <img v-lazy="item.picUrl">
        </div>
        <div class="title">{{item.name}}</div>
      </div>
    </div>
    <div class="listMV" >
      <div class="MVTitle"><span>推荐MV</span><mu-icon value='chevron_right' color='#999'></mu-icon></div>
      <LocalLoad v-if='listMV.length===0'></LocalLoad>
      <div class="MVBox" v-if='listMV.length' v-for='(item, index) in listMV'  :key='index'>
        <div class="imgBox" ref='mvImgBox'>
          <img v-lazy="item.picUrl">
        </div>
        <div class="title">{{item.name}}</div>
        <div class="artistName">{{item.artistName}}</div>
      </div>
    </div>
    <div class="findMusicFooter">
      <div class="toVideo" @click='$emit("goVideo",1)'>看视频,发现更多有趣内容</div>
      <mu-icon value='chevron_right' color='#999'></mu-icon>
    </div>
  </div>
</template>

<script>
import Banner from '@/widget/Banner'
import LocalLoad from '@/widget/LocalLoad'
import {mapState} from 'vuex'
const arrListBtn = [
  {iconSrc: require('../../public/img/syj.png'), iconActSrc: require('../../public/img/syj_active.png'), txt: '私人FM', isActive: false},
  {iconSrc: require('../../public/img/rl.png'), iconActSrc: require('../../public/img/rl_active.png'), txt: '每日推荐', isActive: false},
  {iconSrc: require('../../public/img/music.png'), iconActSrc: require('../../public/img/music_active.png'), txt: '歌单', isActive: false},
  {iconSrc: require('../../public/img/phb.png'), iconActSrc: require('../../public/img/phb_active.png'), txt: '排行榜', isActive: false}
]
export default {
  created() {
    this.axios.get('api/banner')
      .then((res) => {
        this.bannerData = res.data.banners
      })
    this.axios.get('api/personalized/djprogram')
      .then((res) => {
        let obj = {name: '主播电台', dataArr: res.data.result, click: this.goRadio}
        this.listFindData.push(obj)
        this.$nextTick(() => {
          this.$refs.imgBox.map((item) => {
              item.style.height = item.offsetWidth + 'px'
          })
          this.axios.get('api/recommend/resource')
            .then((res) => {
              let obj = {name: '推荐歌单', dataArr: res.data.recommend, click: this.goSheel}
              this.listFindData.push(obj)
              this.$nextTick(() => {
                this.$refs.imgBox.map((item) => {
                  item.style.height = item.offsetWidth + 'px'
                })
              })
            })
        })
      })
    this.axios.get('api/personalized/mv')
      .then((res) => {
        this.listMV = res.data.result
         this.$nextTick(() => {
            let w = this.$refs.mvImgBox[0].offsetWidth
            console.log(w)
            let arr = [...this.$refs.mvImgBox]
            arr.map((item) => {
              item.style.height = w / 157 * 88 + 'px'
            })
          })
      })
  },
  data() {
    return {
      bannerData: [],
      arrListBtn: arrListBtn,
      listFindData: [],
      listMV: []
    }
  },
  methods: {
    touchstart(index) {
      this.arrListBtn[index].isActive = true
    },
    touchend(index) {
      this.arrListBtn[index].isActive = false
    },
    goSheel(data) {
      this.$store.dispatch('getCurrentSheel', data.id)
    },
    goRadio(data) {
      // this.axios.get('/api/dj/detail?rid=' + data.program.radio.id)
      //   .then((res) => {
      //     // console.log(res)
      //   })
      // this.axios.get('/api/dj/program?limit=40&rid=' + data.program.radio.id)
      //   .then((res) => {
      //     console.log(this.currentMusicList)
      //     console.log(res)
      //   })
      this.$store.dispatch('getCurrentDjSheel', {id: data.program.radio.id, offset: 0})
        .then(() => {})
    }
  },
  computed: {
    ...mapState(['currentMusicList'])
  },
  components: {
    Banner,
    LocalLoad
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.findMusic
  background-color: rgb(245,245,245)
  .toListBtnBox
    background-color: rgb(250,250,250)
    padding: 14px 0
    display: flex
    border-bottom: 1px solid #EEE
    .listBtn
      flex: 1
      text-align: center
      .imgBox
        display: inline-block
        width: 50px
        height: 50px
        line-height: 65px
        border: 1px solid #f10215
        border-radius: 50%
        &.active
          background-color: #f10215
        img
          width: 60%
      p
        margin-top: 6px
        font-size: 12px
  .listSheels
    padding-bottom: 30px
    overflow: hidden
    &::after
      display: block
      content: ""
      clear: both
    .sheelTitle
      padding: 0 8px
      margin-top: 10px
      border-left: 2px solid #f10215
      font-size: 14px
      span
        vertical-align: middle
      i
        vertical-align: middle
    .sheelBox
      margin-top: 10px
      width: 32%
      float: left
      margin-right: 2%
      .imgBox
        width: 100%
        overflow: hidden
        img
          width: 100%
      .title
        font-size: 12px
        line-height: 20px
        max-height: 40px
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2
        overflow: hidden
        padding: 0 5px
        height: 50px
  .listMV
    padding-bottom: 30px
    overflow: hidden
    &::after
      display: block
      content: ""
      clear: both
    .MVTitle
      padding: 0 8px
      margin-top: 10px
      border-left: 2px solid #f10215
      font-size: 14px
      span
        vertical-align: middle
      i
        vertical-align: middle
    .MVBox
      margin-top: 10px
      width: 49%
      float: left
      &:nth-child(odd)
        margin-left: 2%
      .imgBox
        width: 100%
        overflow: hidden
        img
          width: 100%
      .title, .artistName
        padding: 0 5px
        padding-top: 5px
        font-size: 12px
        line-height: 20px
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
      .artistName
        color: #999
  .findMusicFooter
    border-top: 1px solid #EEE
    padding: 30px 0
    text-align: center
    .toVideo
      display: inline-block
      vertical-align: middle
      font-size: 12px
      color: #666
    i
      vertical-align: middle
</style>
