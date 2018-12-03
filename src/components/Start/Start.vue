<template>
  <div class="start">
    <div class="boxTop"></div>
    <div class="boxBottom"></div>
  </div>
</template>

<script>

export default {
  created() {
    this.$store.dispatch('getUserStatus')
      .then(() => {
        setTimeout(() => {
          this.$router.push('/home')
        }, 1500)
      })
      .catch(() => {
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      })
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.start
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-image: url('../../public/img/p_login_bg.png')
  background-size: 100%
  .boxTop
    position: absolute
    top: 100px
    height: 40px
    width: 100%
    background-image: url('../../public/img/awr.png')
    background-size: auto 100%
    background-repeat: no-repeat
    background-position: center
  .boxBottom
    position: absolute
    bottom: 50px
    height: 60px
    width: 100%
    background-image: url('../../public/img/ahl.png')
    background-size: auto 100%
    background-repeat: no-repeat
    background-position: center
</style>
