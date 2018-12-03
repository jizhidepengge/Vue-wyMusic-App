<template>
  <div class="Lyric" @click='toggleShowLyr'>
    <div class="lyricBox" v-if='lyricData.length' ref='lyricBox'>
      <p ref='p' v-for='(item, index) in lyricData' :class='index===showIndex?"active":""' :key='index'>{{item.lyric}}</p>
    </div>
    <div class="load" v-if='!lyricData.length'>
      歌词加载中...
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: ['songCurrentTime'],
  created() {
    this.axios.get('/api/lyric?id=' + this.getNowMusicId)
      .then((res) => {
        this.changeLyricData(res)
      })
  },
  data() {
    return {
      lyricData: [],
      showIndex: 0,
      pHeightMap: []
    }
  },
  updated() {
    if (this.$refs.p) {
      let arr = []
      let h = 0
      this.$refs.p.map((item) => {
        h += item.offsetHeight
        arr.push(h)
      })
      this.pHeightMap = arr
    }
  },
  methods: {
    strToSecond(str) {
      let arr = str.split(':')
      let s1 = parseInt(arr[0]) * 60
      let s2 = parseInt(arr[1])
      return s1 + s2
    },
    changeLyricData(data) {
      let arr = data.data.lrc.lyric.split('[')
      arr = arr.filter(item => item)
      let result = []
      arr.map((item) => {
        let arrItem = item.split(']')
        let time = this.strToSecond(arrItem[0].substr(0, 5))
        let lyric = arrItem[1]
        lyric = lyric.replace(/[\r\n]/g, '')
        if (lyric) {
          result.push({time, lyric})
        }
      })
      this.lyricData = [...result]
    },
    toggleShowLyr() {
      this.$emit('toggleShowLyr')
    }
  },
  watch: {
    songCurrentTime(newVal) {
      if (this.lyricData) {
        let arr = this.lyricData.filter((item) => {
          return item.time <= newVal
        })
        this.showIndex = arr.length - 1
      }
    },
    showIndex(newVal) {
      if (this.$refs.lyricBox) {
        this.$refs.lyricBox.style.transform = `translateY(-${this.pHeightMap[newVal]}px)`
      }
    },
    getNowMusicId(newVal) {
      this.lyricData = []
      this.showIndex = 0
      this.axios.get('/api/lyric?id=' + this.getNowMusicId)
        .then((res) => {
          this.changeLyricData(res)
        })
    }
  },
  computed: {
    ...mapState(['currentMusicList', 'currentMusicIndex']),
    getNowMusicId() {
      return this.currentMusicList.tracks[this.currentMusicIndex].id
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.Lyric
  position: fixed
  top: 53px
  bottom: 100px
  left: 0
  right: 0
  overflow: hidden
  .lyricBox
    position: absolute
    top: 50%
    width: 100%
    transition: all 0.5s
    p
      padding: 0 15px
      line-height: 40px
      color: #DDD
      width: 100%
      text-align: center
      &.active
        color: #FFF
  .load
    position: absolute
    top: 50%
    width: 100%
    text-align: center
</style>
