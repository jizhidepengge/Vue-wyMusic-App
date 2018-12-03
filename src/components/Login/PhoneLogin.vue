<template>
  <div class="phoneLogin">
    <div class="header">
      <mu-appbar style="width: 100%;" z-depth='0' color="primary">
        <mu-button icon slot="left" @click='$emit("toggleLogin")'>
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
        <span class="title">手机号登录</span>
      </mu-appbar>
    </div>
    <div class="from">
      <div class="inputBox">
        <div class="icon">
          <mu-icon size="20" value="phone_android"></mu-icon>
        </div>
        <input ref='user' type="number" v-model='user' placeholder="请输入手机号">
        <div class="iconBtn" v-if='user' @click='user=""'>
          <mu-icon size="20" value="close"></mu-icon>
        </div>
      </div>
      <div class="inputBox">
        <div class="icon">
          <mu-icon size="20" value="lock"></mu-icon>
        </div>
        <input type="password"  v-model='passwd' placeholder="请输入密码">
      </div>
    </div>
    <div class="btnBox">
      <div class="submit" ref='btn' :class='submitActive?"active":""' @touchstart ='touchstart' @touchend='touchend' @click='login'>登录</div>
    </div>
    <div class="loadBox" v-if='showLoad'>
      <Load></Load>
    </div>
  </div>
</template>

<script>
import Load from '@/widget/Load'
import {mapActions} from 'vuex'
export default {
    mounted() {
      this.$refs.user.focus()
    },
    data() {
      return {
        user: '',
        passwd: '',
        submitActive: false,
        showLoad: false
      }
    },
    methods: {
      ...mapActions(['toLogin']),
      touchstart() {
        this.submitActive = true
      },
      touchend() {
        this.submitActive = false
      },
      login() {
        if (!this.user.trim().length) {
          this.$toast.error('手机号不能为空')
          return 0
        }
        if (!this.passwd.trim().length) {
          this.$toast.error('密码不能为空')
          return 0
        }
        this.showLoad = true
        this.toLogin({
          phone: this.user,
          passwd: this.passwd
        })
          .then(() => {
            this.close()
            this.$router.push('/home')
          })
          .catch((req) => {
            console.log(req)
            this.$toast.error('用户名或密码错误')
            this.close()
          })
      },
      close() {
        this.showLoad = false
      }
    },
    components: {
      Load
    }
}
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
.phoneLogin
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  background-color: #fff
  .title
    font-size: 17px
  .mu-appbar
    background-color: #f10215
    height: 55px
  .from
    margin-top: 40px
    .inputBox
      margin-top: 15px
      padding: 0 20px
      position: relative
      .icon
        position: absolute
        top: 7px
        .mu-icon
          color: #AAA
      .iconBtn
        position: absolute
        right: 25px
        top: 9px
        .mu-icon
          color: #AAA
      input
        width: 100%
        height: 35px
        padding-left: 30px
        outline: none
        border: 0
        border-bottom: 1px solid #CCC
  .btnBox
    padding: 0 15px
    margin-top: 20px
    .submit
      display: inline-block
      width: 100%
      padding: 7px 0
      color: #fff
      background-color: #f10215
      text-align: center
      border-radius: 40px
      &.active
        background-color: rgb(220, 0, 0)
</style>
