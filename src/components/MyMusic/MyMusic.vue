<template>
  <div class="myMusic">
    <mu-list class='topList'>
      <div class="boxList" v-for='(item, index) in arrList' :key='index'>
        <mu-list-item button :ripple="true">
          <mu-list-item-action>
            <img :src="item.img">
          </mu-list-item-action>
          <mu-list-item-title>
            <span class="txt">{{item.txt}}<span class="num"></span></span>
          </mu-list-item-title>
        </mu-list-item>
      </div>
    </mu-list>
    <div class="songSheets" v-if='isLogin'>
      <div class="sheetsTitle" @click='showSheets=!showSheets'>
        <mu-icon :value='showSheets?"expand_more":"chevron_right"' color='#666'></mu-icon>
        <span class="titleTxt">创建的歌单<span class="num"></span></span>
      </div>
      <LocalLoad v-if = '!dataMySheets'></LocalLoad>
      <div class="sheetsContent" v-if='dataMySheets'  v-show='showSheets'>
        <mu-list class='bottomList'>
          <div class="itemBox" v-for='(item, index) in dataMySheets' :key='index'>
            <mu-list-item @click='goSheetsList(item.id)' button :ripple="true">
              <mu-list-item-action>
                <div class="imgBox"><img :src="item.coverImgUrl"></div>
              </mu-list-item-action>
              <mu-list-item-content>
                <mu-list-item-title>
                  <span class="txt">{{index?item.name:'我喜欢的音乐'}}</span>
                </mu-list-item-title>
                <mu-list-item-sub-title><p class="num">{{item.trackCount}}首</p></mu-list-item-sub-title>
              </mu-list-item-content>
            </mu-list-item>
          </div>
        </mu-list>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import LocalLoad from '@/widget/LocalLoad'
const arrList = [
  {img: require('../../public/img/my1.png'), txt: '本地音乐'},
  {img: require('../../public/img/my2.png'), txt: '最近播放'},
  {img: require('../../public/img/my3.png'), txt: '下载管理'},
  {img: require('../../public/img/my4.png'), txt: '我的电台'},
  {img: require('../../public/img/my5.png'), txt: '我的收藏'}
]
export default {
  created() {
    if (this.afterStatus) {
      this.$store.dispatch('getSongSheets')
      .then((res) => {
        this.dataMySheets = res.data.playlist
      })
    }
  },
  data() {
    return {
      arrList: arrList,
      showSheets: true,
      dataMySheets: []
    }
  },
  computed: {
    ...mapState(['afterStatus', 'isLogin'])
  },
  methods: {
    goSheetsList(id) {
      this.$store.dispatch('getCurrentSheel', id)
    }
  },
  watch: {
    afterStatus(newVal) {
      if (newVal) {
        this.$store.dispatch('getSongSheets')
        .then((res) => {
          this.dataMySheets = res.data.playlist
        })
      }
    }
  },
  components: {
    LocalLoad
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.myMusic
  .topList
    padding: 0
    li
      border-bottom: 1px solid #EEE
      width: 100%
      height: 50px
      img
        width: 30px
        padding: 5px
  .songSheets
    .sheetsTitle
      padding-left: 18px
      line-height: 30px
      background-color: #EEE
      .mu-icon
        vertical-align: middle
      .titleTxt
        color: #666
        font-size: 12px
        vertical-align: middle
    .sheetsContent
      .bottomList
        padding: 0
        li
          border-bottom: 1px solid #eee
          .imgBox
            height: 45px
            width: 45px
            overflow: hidden
            border-radius: 3px
            img
              width: 45px
          .txt
            font-size: 14px
            color: #444
            font-weight: 550
          .num
            font-size: 12px
</style>
