<template>
  <div class="find">
    <div class="nav">
      <mu-tabs :value="findNavActive" @change='changeActive' inverse color="rgb(241, 2, 21)" text-color="rgba(0, 0, 0, .54)"  center>
        <mu-tab>音乐</mu-tab>
        <mu-tab>视频</mu-tab>
        <mu-tab>电台</mu-tab>
      </mu-tabs>
      <div class="tabPlaceholder"></div>
      <div class="demo-text" v-if="findNavActive === 0">
        <FindMusic @goVideo='changeActive'></FindMusic>
      </div>
      <div class="demo-text" v-if="findNavActive === 1">
        <FindVideo></FindVideo>
      </div>
      <div class="demo-text" v-if="findNavActive === 2">
        <FindStation></FindStation>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import FindMusic from './FindMusic'
import FindVideo from './FindVideo'
import FindStation from './FindStation'
export default {
  computed: {
    ...mapState(['findNavActive'])
  },
  methods: {
    changeActive(value) {
      this.$store.commit('CHANGE_FIND_NAV_ACTIVE', value)
    }
  },
  components: {
    FindMusic,
    FindVideo,
    FindStation
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.find
  .mu-tabs
    position: fixed
    top: 50px
    left: 0
    right: 0
    height: 36px
    .mu-tab
      min-width: 92px
  .tabPlaceholder
    height: 36px
    width: 100%
</style>
