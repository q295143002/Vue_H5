<!-- 修改公司支付密码 -->
<template>
  <h3 class='theme-color-blue'>修改支付密码</h3>
  <group>
    <x-input :value.sync="checkCode" type = 'number' placeholder="校验码" :required ='false'>
      <x-button @click="getPayCode"  :type='wait.show?"cancel":"primary"' mini><span>获取验证码{{wait.text}}</span></x-button>
    </x-input>
    <x-input  :value.sync="newPayPsd" placeholder="新的支付密码" :required ='false' type="password"></x-input>
    <x-input  :value.sync="reNewPsd" placeholder="再次输入支付密码" type="password" :required ='false'></x-input>
  </group>
  <flexbox>
    <flexbox-item>
      <x-button class="mt-1" type="primary" @click="valid">修改</x-button>
    </flexbox-item>
    <flexbox-item>
      <x-button class="mt-1" type="cancel" @click = 'close'>返回</x-button>
    </flexbox-item>
  </flexbox>
</template>
<script>
import {Flexbox, FlexboxItem, XInput, XButton, Group} from 'vux-c'
export default {
  components: {
    Group,
    Flexbox,
    FlexboxItem,
    XInput,
    XButton
  },
  data () {
    return {
      wait: {
        show: false,
        val: 60,
        text: ''
      },
      toast: {
        text: '',
        show: false
      },
      checkCode: '',
      newPayPsd: '',
      reNewPsd: '',
      vailList: {
        code: false,
        pwd: false,
        repwd: false,
        compare: false
      }
    }
  },
  methods: {
    valid () {
      if (window.Miu.Trim(this.checkCode).length === 0) {
        this.$root.Toast('请输入验证码')
        return
      }
      if (window.Miu.Trim(this.newPayPsd).length < 6) {
        if (window.Miu.Trim(this.newPayPsd).length === 0) {
          this.$root.Toast('请输入密码')
        } else {
          this.$root.Toast('密码长度不能小于6')
        }
        return
      }
      if (window.Miu.Trim(this.newPayPsd) !== window.Miu.Trim(this.reNewPsd)) {
        this.$root.Toast('两次密码输入不一致')
        return
      }
      this.setCropPayPwd()
    },
    /* 获取验证码 */
    getPayCode () {
      if (!this.wait.show) {
        this.$http({
          method: 'GET',
          url: window.Miu.Data.ApiURL + '/User_1_0/GenForgetPayCode',
          params: {token: window.Miu.Data.Token}
        }).then(function (response) {
          if (response.data.Success === true) {
            this.$root.Toast('验证码已发送')
            this.countDown()
          }
        }, function (response) {
          console.log(response.data)
        })
      }
    },
    countDown () {
      let that = this
      this.wait.show = true
      that.wait.val = 60
      that.wait.text = `(${that.wait.val})`
      window.xx = setInterval(function () {
        if (that.wait.val > 0) {
          that.wait.val--
          that.wait.text = `(${that.wait.val})`
        } else {
          clearInterval(window.xx)
          that.wait.text = ''
          that.wait.val = 60
          that.wait.show = false
        }
      }, 1000)
    },
    /* 设置公司账户密码 */
    setCropPayPwd () {
      this.$http({
        method: 'GET',
        url: window.Miu.Data.ApiURL + '/User_1_0/SetCorpPayPwd',
        params: {
          token: window.Miu.Data.Token,
          code: window.Miu.Trim(this.checkCode),
          pwd: window.Miu.Trim(this.newPayPsd)
        }
      }).then(function (response) {
        if (response.data.errorCode === null && response.data.errorMessage === null) {
          this.$root.Toast('密码修改成功')
          this.checkCode = ''
          this.newPayPsd = ''
          this.reNewPsd = ''
          this.$emit('edit-success')
        }
      }, function (response) {
        this.$root.Toast(response.data.errorMessage)
        console.log(response.data)
      })
    },
    close () {
      this.checkCode = ''
      this.newPayPsd = ''
      this.reNewPsd = ''
      this.$emit('close')
    }
  }
}
</script>