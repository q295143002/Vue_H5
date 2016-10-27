<template>
  <button @click = 'getNetWork()'>getNetWork</button>
</template>
<script>
  import {XButton} from 'vux-c'
  export default {
    components: {
      XButton
    },
    ready () {
      // this.WechatInit()
    },
    methods: {
      WechatInit () {
        this.$http.get('http://192.168.0.108' + '/WeChat/GetWeinxin_jsapi_ticket?url=' + encodeURIComponent('http://wx.miutrip.com/')).then((response) => {
          console.log(response.data)
          window.wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.AppId,
            timestamp: +response.data.TimesTamp,
            nonceStr: response.data.NonceStr,
            signature: response.data.SignaTure,
            jsApiList: ['getNetworkType']
          })
          window.wx.error(() => {
            this.$root.Toast('系统错误，请重试')
          })
        }, (response) => {
          window.alert('初始化失败,请重试')
          this.init()
        })
      },
      getNetWork () {
        window.wx.getNetworkType({
          success: function (res) {
            window.alert('success')
            window.alert(JSON.stringify(res))
            // var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
            // console.log(networkType)
          },
          fail: function (res) {
            window.alert('fail')
            window.alert(JSON.stringify(res))
          }
        })
      }
    }
  }
</script>