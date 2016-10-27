<template>
  <div class="m-login-bg">
    <div class="m-login-group pos-a">
      <div class="pl-4 pr-4">
        <h2 class="m-login-title">WELCOME</h2>
        <group class = 'm-login-input'>
          <x-input placeholder="用户名" :value.sync="username"  :required = 'false'></x-input>
        </group>
        <group class = 'm-login-input'>
          <x-input placeholder="密码" :value.sync="password" type="password" :required = 'false'></x-input>  
        </group>
        <x-button class="w-login-btn mt-2" @click='validate'>登录</x-button>
        <p @click="showforget=true" class="ta-c mt-1  color-white">忘记密码?</p>
      </div>
    </div>
  </div>
  <alert :show.sync='alert.show' title ='登陆成功'>{{alert.text}}</alert>
  <forget :show.sync = 'showforget'></forget>
</template>
<script>
import Forget from './login/forget'
import {Group, XButton, Toast, Alert, XInput, Cell} from 'vux-c'
export default {
  components: {
    Alert,
    Forget,
    Group,
    XInput,
    XButton,
    Toast,
    Cell
  },
  data () {
    return {
      islogin: 0,
      username: '',
      password: '',
      num: 1,
      timevalue: '',
      alert: {
        show: false,
        text: ''
      },
      showforget: false
    }
  },
  ready () {
    console.log(this.$router)
  },
  methods: {
    AlertText (txt) {
      this.alert = {
        show: true,
        text: txt
      }
    },
    /**
     * 登录验证
     * 1.填入为空验证
     * 2.用户名格式验证  (支持手机号,邮箱,UID登录)
     */
    validate () {
      if (this.username === '') {
        this.$root.Toast('请输入用户名')
        return
      } else if (this.password === '') {
        this.$root.Toast('请输入密码')
        return
      } else if (((/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/).test(this.username))) {
        this.logIn()
      } else if ((/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/).test(this.username)) {
        this.logIn()
      } else if (/^\d+$/.test(this.username)) {
        this.logIn()
      } else {
        this.$root.Toast('用户名错误')
      }
    },
    /**
     * 用户登录
     * @param uid
     * @param password
     */
    logIn () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/Account_1_0/BindingWeChat',
        params: {
          loginName: this.username,
          password: this.password,
          weChatNum: this.$route.params.wechatid
        }
      }).then(function (response) {
        if (response.data.isSecssed) {
          // this.AlertText('绑定成功，请关闭页面重新进入')
          this.username = ''
          this.password = ''
          window.Miu.Data.Token = response.data.authTkn
          this.$root.GetUserInfo(this.$router.replace('/user'))
        } else {
          this.$root.Toast('绑定失败')
        }
      }, function (response) {
        this.$root.Toast(response.data.errorMessage)
      })
    },
    getVerifCode () {
      this.num = 2
    }
  }
}
</script>
<style lang="less">
  .m-login-bg{
    height: 100%;
    position: absolute;
    width: 100%;
    background:#5f97f6 url(../assets/plane-bg.png) no-repeat;
    background-size: 100% 100%;
  }
  .m-login-title{
    font-weight: normal;
    font-size:2.2rem;
    height:5rem;
    line-height: 5rem;
    text-align:center;
    color:#9ec3fb;
  }
  .m-login-group{
    width: 100%;
    top:50%;
    margin-top: -160px;
  }
  .m-login-input{
    .weui_cells{
      background: none;
      color: #fff;
      &:before{
        content: none
      }
      ::-webkit-input-placeholder{
        color:#fff;
      }
      &:after{
        background: #fff;
      }
    }
    .weui_cell{
      padding: 10px 0
    }
  }
</style>     