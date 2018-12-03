<template>
  <div class="findStation">
    <Banner :bannerData = 'bannerData'></Banner>
    <LocalLoad v-if='!djArr.length'></LocalLoad>
    <div class="djRecommend" v-if='djArr.length'>
      <div class="classTitle"><span>电台个性推荐</span></div>
      <div class="djBox" v-for='item in djArr' :key='item.id'>
        <div class="imgBox">
          <img v-lazy="item.picUrl">
          <div class="autName">{{item.name}}</div>
        </div>
        <div class="title">{{item.rcmdtext}}</div>
      </div>
    </div>
    <div class="shouldPay">
      <div class="classTitle" @touchstart='touchstart($event)' @touchend='touchend($event)'>
        <span>付费精品</span>
        <mu-icon value='chevron_right' color='#CCC'></mu-icon>
      </div>
      <LocalLoad v-if='!shouldPayData.length'></LocalLoad>
      <div class="shouldPayContent" v-if='shouldPayData.length'>
          <div class="payBox" v-for='item in shouldPayData' :key='item.id'>
            <div class="left"><img v-lazy="item.picUrl"></div>
            <div class="right">
              <p class="title">{{item.name}}</p>
              <p class="content">{{item.rcmdText}}</p>
              <p class="content">{{item.lastProgramName}}</p>
              <p class="price">￥{{parseInt(item.originalPrice / 100)}}</p>
            </div>
          </div>
      </div>
    </div>
    <div class="StationClass" >
      <div class="classTitle"><span>全部分类</span></div>
      <LocalLoad v-if='!stationClass.length'></LocalLoad>
      <div class="classBox" v-if='stationClass.length' v-for='item in stationClass' :key='item.id'>
        <mu-button flat >
          <div class="box">
            <img :src="item.pic56x56Url">
            <span>{{item.name}}</span>
          </div>
        </mu-button>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/widget/Banner'
import LocalLoad from '@/widget/LocalLoad'
import {mapState} from 'vuex'
export default {
  created() {
    this.axios.get('api/banner')
      .then((res) => {
        this.bannerData = res.data.banners.reverse()
      })
    if (!this.stationClass.length) {
      this.$store.dispatch('getStationClass')
    }
    this.axios.get('api/dj/paygift?limit=3&offset=1')
      .then((res) => {
        this.shouldPayData = res.data.data.list
      })
    this.axios.get('api/dj/recommend')
      .then((res) => {
        let arr = res.data.djRadios
        let result = arr.length > 6 ? arr.splice(0, 6) : arr
        this.djArr = result
      })
  },
  data() {
    return {
      bannerData: [],
      shouldPayData: [],
      djArr: []
    }
  },
  methods: {
    touchstart(e) {
    },
    touchend(e) {
    }
  },
  computed: {
    ...mapState(['stationClass'])
  },
  components: {
    Banner,
    LocalLoad
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.findStation
  overflow: hidden
  .djRecommend
    margin-top: 15px
    overflow: hidden
    .classTitle
      padding: 10px 0
      span
        padding-left: 10px
        border-left: 2px solid red
    .djBox
      float: left
      width: 32%
      margin-right: 2%
      &:nth-child(3n+1)
        margin-right: 0
      .imgBox
        width: 100%
        position: relative
        background-color: #999
        font-size: 0
        img
          width: 100%
          opacity: .7
        div
          position: absolute
          color: #FFF
          font-size: 12px
          bottom: 5px
          left: 2px
      .title
        padding: 5px
        font-size: 13px
        display: -webkit-box
        -webkit-box-orient: vertical
        -webkit-line-clamp: 2
        overflow: hidden
  .shouldPay
    margin-top: 20px
    .classTitle
      padding: 10px 0
      span
        padding-left: 10px
        border-left: 2px solid red
        vertical-align: middle
      i
        vertical-align: middle
    .shouldPayContent
      border-top: 1px solid #EEE
      .payBox
        margin-top: 5px
        display: flex
        border-bottom: 1px solid #EEE
        &:first-child
          margin-top: 0
        .left
          flex: 0 0 100px
          height: 100px
          img
            width: 100px
        .right
          height: 100px
          flex: 1
          padding: 0 10px
          .title
            padding-top: 3px
            color: black
          .content
            margin-top: 5px
            font-size: 12px
            color:#999
            width: 85%
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
          .price
            margin-top: 7px
            color: red
  .StationClass
    margin-top: 20px
    .classTitle
      padding: 10px 0
      span
        padding-left: 10px
        border-left: 2px solid red
    .classBox
      float: left
      width: 50%
      overflow: hidden
      &:nth-child(odd)
        border-right: 1px solid #EEE
      button
        width: 100%
        height: 50px
        border-top: 1px solid #EEE
        .box
          width: 100%
          text-align: left
          padding-left: 10%
          img
            width: 25px
            vertical-align: middle
          span
            padding-left: 10px
            vertical-align: middle
</style>
