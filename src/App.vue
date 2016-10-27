<template>
  <div>
    <router-view></router-view>
    <div style='position:relative;z-index:99999'>
      <toast :show.sync = 'toast.show' type ='text'>{{toast.text}}</toast>
      <loading :show.sync = 'loading.show' :text.sync = 'loading.text'></loading>
      <alert :show.sync = 'alert.show' :title.sync='alert.title' :button-text='
      alert.buttontext' >
        <div class="mb-05">{{alert.text}}</div>
        <div v-for='item in alert.list' class="color-red" >{{item}}</div>
      </alert>
    </div>
  </div>
</template>
<script>
  require('../static/miu.js')
  import {Loading, Toast, Alert} from 'vux-c'
  export default {
    components: {
      Loading,
      Toast,
      Alert
    },
    data () {
      return {
        loading: {
          show: false,
          text: '加载中'
        },
        loadList: [],
        toast: {
          show: false,
          text: ''
        },
        alert: {
          show: false,
          text: '',
          title: '',
          list: '',
          buttontext: '确定'
        }
      }
    },
    methods: {
      /* 加载动画 */
      Loading (bool, text) {
        if (text) {
          this.loading.text = text
        } else {
          this.loading.text = '加载中'
        }
        if (bool) {
          this.loadList.push(bool)
          this.loading.show = true
        } else {
          if (this.loadList.length > 0) {
            this.loadList.pop(bool)
          }
          if (this.loadList.length === 0) {
            this.loading.show = bool
          }
        }
      },
      /* 获取用户信息 */
      GetUserInfo (callback, DisableLoading) {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GetUserLoginInfo',
          params: {
            'token': window.Miu.Data.Token
          },
          DisableLoading: DisableLoading
        }).then(function (response) {
          this.showLoading = false
          window.localStorage.setItem('USERINFO', JSON.stringify(response.data))
          window.Miu.init()
          ;(callback && typeof (callback) === 'function') && callback()
        }, function (response) {
          this.toast('用户信息加载失败，请重试')
        })
      },
      /* alert组件 */
      Alert (title = '', text = '', buttontext = '确定', list = []) {
        this.alert = {
          show: true,
          text: text,
          title: title,
          list: list,
          buttontext: buttontext
        }
      },
      /* toast组件 */
      Toast (str) {
        this.toast = {
          show: true,
          text: str
        }
      },
      WechatInit () {
        this.$http({
          method: 'GET',
          url: 'http://wechat.miutrip.com/WeChat/GetWeinxin_jsapi_ticket',
          params: {
            url: encodeURIComponent(window.location.href.split('#')[0]),
            str: new Date().getTime()
          }
        }).then((response) => {
          console.log('wechatinit')
          window.wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.AppId,
            timestamp: +response.data.TimesTamp,
            nonceStr: response.data.NonceStr,
            signature: response.data.SignaTure,
            jsApiList: ['getNetworkType', 'getLocation', 'hideAllNonBaseMenuItem']
          })
          window.wx.error(() => {
            window.alert('系统错误，请刷新页面重试')
          })
          window.wx.ready(() => {
            console.log('wechatready')
            window.wx.getNetworkType({
              fail: function (res) {
                window.alert('网络访问失败，请检查网络状态')
              }
            })
            window.wx.hideAllNonBaseMenuItem()
          })
        }, (response) => {
          window.alert('初始化失败,请刷新重试')
        })
      }
    }
  }
</script>
<style>
  @import '~vux/dist/vux.css';
</style>
<style lang="less">
  @import './styles/icon.less';
  @import './styles/golbal.less';
  @import './styles/theme.less';
</style>