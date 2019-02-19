<template>
  <div class="songInfo" @click='toggleShowLyr'>
    <div class="needle" :class='isPlaying?"":"active"'></div>
    <div class="circle" ref='circle' v-if='currentMusicList.tracks'>
      <img ref='imgCircle' :src="currentMusicList.tracks[currentMusicIndex].al.picUrl">
    </div>
    <div class="about">
      <mu-button flat @click='toLike'>
        <img :src="getLikeBtnUrl">
      </mu-button>
      <mu-button flat>
        <img src="../../public/img/aq_.png">
      </mu-button>
      <mu-button flat>
        <img src="../../public/img/apl.png">
      </mu-button>
      <mu-button flat>
        <img src="../../public/img/aqp.png">
      </mu-button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: ['isPlaying'],
  data() {
    return {
      activeToLike: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.circle.style.height = this.$refs.circle.offsetWidth + 'px'
      this.$refs.imgCircle.style.height = this.$refs.imgCircle.offsetWidth + 'px'
    })
  },
  updated() {
    this.$refs.circle.style.height = this.$refs.circle.offsetWidth + 'px'
    this.$refs.imgCircle.style.height = this.$refs.imgCircle.offsetWidth + 'px'
  },
  beforeDestroy() {
    clearInterval(this.circleTimer)
  },
  methods: {
    toLike() {
      this.activeToLike = !this.activeToLike
    },
    toggleShowLyr() {
      this.$emit('toggleShowLyr')
    }
  },
  computed: {
    ...mapState(['currentMusicList', 'currentMusicIndex']),
    getLikeBtnUrl() {
      if (this.activeToLike) {
        return require('../../public/img/apq.png')
      } else {
        return require('../../public/img/app.png')
      }
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.songInfo
  position: fixed
  top: 53px
  bottom: 100px
  left: 0
  right: 0
  overflow: hidden
  border-top: 1px solid rgba(250,250,250,.1)
  .needle
    z-index: 5
    position: absolute
    top: -17px
    left: 40%
    background-image: url('../../public/img/ar_.png')
    width: 100px
    height: 150px
    background-repeat: no-repeat
    background-size: 100%
    transition: all 1s
    &.active
      transform-origin: 16px 13px
      transform: rotate(-30deg)
  .circle
    position: absolute
    left: 50%
    top: 80px
    transform: translateX(-50%)
    width: 80%
    background-image: url('../../public/img/apg.png')
    background-repeat: no-repeat
    background-size: 100%
    border-radius: 50%
    border: 4px solid rgba(250,250,250,.2)
    img
      width: 70%
      border-radius: 50%
      margin-top: 15%
      margin-left: 15%
  .about
    position: absolute
    left: 0
    right: 0
    bottom: 0
    text-align: center
    button
      min-width: 0
      /deep/ .mu-button-wrapper
        padding: 10px
        img
          width: 45px
</style>
