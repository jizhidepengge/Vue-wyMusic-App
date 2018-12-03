<template>
  <div class="login">
    <div class="logoBox"></div>
    <div class="btnBox">
      <div class="btn" :class='btn1Active?"acitve":""' @touchstart='touchstart(0)' @touchend='touchend(0)' @click='toggleLogin'>手机号登录</div>
      <div class="btn" :class='btn2Active?"acitve":""' @touchstart='touchstart(1)' @touchend='touchend(1)' @click="$toast.message('暂时不支持注册功能')">注册</div>
    </div>
    <div class="testBox">
      <span>游客试用</span>
    </div>
    <div class="otherLogin">
      <div class="titleBox">
        <span>其他登录方式</span>
      </div>
      <div class="content">
        <div class="btn" @click="$toast.message('暂时不支持第三方登录')" v-for='(item, index) in otherBtn' :key='index'>
          <img :src="item.imgSrc">
          <span>{{item.txt}}</span>
        </div>
      </div>
    </div>
    <PhoneLogin @toggleLogin='toggleLogin' v-if='showPhoneLogin'></PhoneLogin>
  </div>
</template>

<script>
import PhoneLogin from './PhoneLogin'
const otherBtn = [
  {imgSrc: require('../../public/img/aj9.png'), txt: '微信'},
  {imgSrc: require('../../public/img/aj5.png'), txt: 'QQ'},
  {imgSrc: require('../../public/img/aj7.png'), txt: '微博'},
  {imgSrc: require('../../public/img/aj2.png'), txt: '网易邮箱'}
]
export default {
  data() {
    return {
      otherBtn: otherBtn,
      showPhoneLogin: false,
      btn1Active: false,
      btn2Active: false
    }
  },
  methods: {
    toggleLogin() {
      this.showPhoneLogin = !this.showPhoneLogin
    },
    touchstart(index) {
      if (index) {
        this.btn2Active = true
      } else {
        this.btn1Active = true
      }
    },
    touchend(index) {
      if (index) {
        this.btn2Active = false
      } else {
        this.btn1Active = false
      }
    }
  },
  components: {
    PhoneLogin
  }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.login
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-image: url('../../public/img/login_bg.jpg')
  background-color: #fff
  background-repeat: no-repeat
  background-size: 100%
  .logoBox
    width: 80px
    height: 95px
    margin: 80px auto 0 auto
    background-image: url('../../public/img/login_logo.png')
    background-size: 100%
  .btnBox
    padding: 0 30px
    margin-top: 40px
    .btn
      margin-top: 10px
      padding: 6px 0
      border: 1px solid #f10215
      color: #f10215
      text-align: center
      border-radius: 40px
      &.acitve
        color: #fff
        background-color: #f10215
  .testBox
    margin-top: 20px
    text-align: center
    font-size: 13px
    color: #666
    span
      border-bottom: 1px solid #666
  .otherLogin
    position: absolute
    bottom: 0
    width: 100%
    .titleBox
      font-size: 12px
      color: #555
      text-align: center
      span
        display: inline-block
        position: relative
        &:before
          display: block
          position: absolute
          left: -65px
          top: 50%
          content: ''
          width: 50px
          height: 1px
          background: linear-gradient(to left, #DDD , #EEE)
        &:after
          display: block
          position: absolute
          right: -65px
          top: 50%
          content: ''
          width: 50px
          height: 1px
          background: linear-gradient(to right, #DDD , #EEE)
    .content
      height: 100px
      display: flex
      padding: 0 30px
      padding-top: 15px
      .btn
        text-align: center
        margin-left: 20px
        flex: 1
        &:first-child
          margin-left: 0
        img
          width: 80%
          font-size: 0
        span
          font-size: 12px
          color: #CCC
</style>
