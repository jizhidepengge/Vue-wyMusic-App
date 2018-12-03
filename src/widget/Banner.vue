<template>
  <div class="banner">
    <div class="swiper-container" ref='swiper'>
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-if='bannerData' v-for='(item, index) in bannerData' :key='index'>
          <img :src="item.imageUrl">
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper'
export default {
    props: ['bannerData'],
    watch: {
      bannerData(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.swiper = new Swiper(this.$refs.swiper, {
              autoplay: {
                 disableOnInteraction: false,
                 delay: 3000
              },
              loop: true,
              pagination: {
                el: '.swiper-pagination',
                clickable: true
              }
            })
          })
        }
      }
    }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.banner
  img
    width: 100%
</style>
