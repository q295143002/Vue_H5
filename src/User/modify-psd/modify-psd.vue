<template>
  <!-- <x-header :left-options="{showBack:true,backText:'修改登录密码'}" style="background:#37f"></x-header> -->
  <!-- <h2 class="mt-1" style="text-align:center;color:#37f;">公司账户支付密码</h2> -->
  <flexbox orient="vertical" class="w-modify-box mt-2">
    <flexbox-item class="w-modify-item">
      <flexbox>
        <flexbox-item class="w-modify-item" :span="0.6">
          <input v-model="checkCode" placeholder="校验码" class="w-modify-input"/>
        </flexbox-item>
        <flexbox-item :span="0.4">
          <input v-if="isShowCode===false" @click="getPayCode" class="w-company-btn" type="button" value="获取验证码"/>
          <span v-else class="w-company-btn2">(
            <countdown :time="time" :start="start" @on-finish="showCodeAgain"></countdown>
            ) 秒后再试
          </span>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <flexbox-item class="w-modify-item">
      <input style="ime-mode:disabled" onpaste="return false;" v-model="newPayPsd" placeholder="新密码" class="w-modify-input" maxlength="20" type="password"/>  
    </flexbox-item>
    <flexbox-item class="w-modify-item">
      <input style="ime-mode:disabled" onpaste="return false;" v-model="renewpsd" placeholder="再次确认新密码" class="w-modify-input" maxlength="20" type="password"/>  
    </flexbox-item>
    <flexbox-item>
      <x-button class="mt-3" type="primary" @click="valid">保存</x-button>
    </flexbox-item>
  </flexbox>
  <!-- 提示错误 -->
  <alert :show.sync="showErr" title="" button-text="确定">
    <p style="text-align:center;">{{err}}</p>
  </alert>
  <!-- 提示成功 -->
  <alert :show.sync="showSuccess" title="" button-text="确定" @on-hide="onSuccess">
    <p style="text-align:center;">修改公司账户密码成功</p>
  </alert>
</template>
<script>
import {Flexbox, FlexboxItem, XInput, XButton, XHeader, Alert, Tab, TabItem, Countdown} from 'vux-c'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    XInput,
    XButton,
    XHeader,
    Alert,
    Tab,
    TabItem,
    Countdown
  },
  data () {
    return {
      renewpsd: '',
      showErr: false,
      showSuccess: false,
      isShowCode: false,
      time: 60,
      start: false,
      checkCode: '',
      newPayPsd: '',
      err: ''
      // Psd: '公司账户支付密码',
      // PsdArr: ['登录密码', '公司账户支付密码']
    }
  },
  ready () {
  },
  methods: {
    valid () {
      var newpaysdStr = window.Miu.Trim(this.newPayPsd)
      var renewpsdStr = window.Miu.Trim(this.renewpsd)
      if (window.Miu.Trim(this.checkCode) === '') {
        this.showErr = true
        this.err = '请输入验证码'
        return
      } else if (window.Miu.Trim(this.checkCode).length !== 6) {
        this.showErr = true
        this.err = '验证码长度不正确'
        return
      }
      if (newpaysdStr === '') {
        this.showErr = true
        this.err = '请输入新密码'
        return
      } else if (newpaysdStr.length < 6) {
        this.showErr = true
        this.err = '新密码长度不能小于6'
        return
      }
      if (renewpsdStr === '') {
        this.showErr = true
        this.err = '请再次输入密码'
        return
      }
      if (newpaysdStr !== '' && renewpsdStr !== '' && newpaysdStr !== renewpsdStr) {
        this.showErr = true
        this.err = '两次密码输入不一致'
        return
      } else {
        this.setCropPayPwd()
      }
    },
    /* 获取验证码 */
    getPayCode () {
      this.start = true
      this.isShowCode = true
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/GenForgetPayCode',
        params: {token: window.Miu.Data.Token}
      }).then(function (response) {
        console.log(response.data)
        if (response.data.Success === true) {
          this.showErr = true
          this.err = '验证码已发送'
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    showCodeAgain () {
      this.isShowCode = false
    },
    /* 设置公司账户密码 */
    setCropPayPwd () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/SetCorpPayPwd',
        params: {
          token: window.Miu.Data.Token,
          code: this.checkCode,
          pwd: this.newPayPsd
        }
      }).then(function (response) {
        console.log(response.data)
        if (response.data.errorCode === '70008') {
          this.showErr = true
          this.err = '验证码错误'
        } else {
          // this.$router.go('/user')
          this.showSuccess = true
        }
      }, function (response) {
        console.log(response.data)
      })
    },
    onSuccess () {
      this.$router.go('/user')
    }
  }
}
</script>
<style lang="less">
   @import '../../styles/user/modifypsd/modifypsd.less';
</style>