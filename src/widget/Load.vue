<template>
  <div class="bgw" @click='close'>
    <mu-circular-progress class="demo-circular-progress" :color='"#666"' :size="36"></mu-circular-progress>
  </div>
</template>

<script>

export default {
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.bgw
    background-color: rgba(240, 240, 240, .5)
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 10000
    text-align: center
    .mu-circular-progress
      margin-top: 70%
</style>
